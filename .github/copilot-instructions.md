# UIGen Workspace Instructions

**Project**: AI-powered React component generator with live preview using Claude AI

## Quick Start

### Commands
- **Development server**: `npm run dev` (or `npm run dev:daemon` for background)
  - Requires NODE_OPTIONS env var: `--require ./node-compat.cjs`
  - Runs on http://localhost:3000 (or PORT env var)
  - Uses Next.js Turbopack for fast builds
- **Build**: `npm run build`
- **Setup**: `npm run setup` (install + Prisma generate + migrations)
- **Test**: `npm run test` (vitest)
- **Lint**: `npm run lint`
- **Database reset**: `npm run db:reset` (caution: deletes all data)

### Windows Dev Environment
On Windows, use PowerShell with Node.js PATH configured:
```powershell
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
cd c:\AntropicCourse\uigen
npx next dev --turbopack  # NODE_OPTIONS already included in pkg scripts
```

## Architecture

### File Structure
```
src/
  app/              # Next.js App Router + API routes
  components/       # React components (organized by feature)
    ├── chat/       # Chat interface with markdown support
    ├── editor/     # Code editor with file tree
    ├── auth/       # Authentication forms
    ├── preview/    # Component preview frame
    └── ui/         # Reusable UI primitives (Radix-based)
  actions/          # Server Actions (form submissions, data fetches)
  lib/              # Shared utilities & logic
    ├── contexts/   # React contexts (chat, file-system)
    ├── tools/      # Tool functions (file-manager, str-replace)
    ├── transform/  # JSX/code transformation
    ├── auth.ts     # Auth utilities (JWT, bcrypt)
    └── prisma.ts   # DB client initialization
  hooks/            # Custom React hooks
  middleware.ts     # Next.js middleware (auth checks)
prisma/
  schema.prisma     # Data models (User, Project)
src/generated/      # Auto-generated Prisma client (DO NOT EDIT)
```

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, TypeScript, Tailwind CSS v4
- **Database**: SQLite with Prisma ORM
- **AI**: Anthropic Claude API (via `ai` SDK v4.3.16)
- **Editor**: Monaco (via @monaco-editor/react)
- **Testing**: Vitest + Testing Library
- **UI Components**: Radix UI (primitives) + Custom Tailwind styling

### Key Design Patterns

**Data Models** (see `prisma/schema.prisma`)

#### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  projects  Project[]
}
```
- `id`: Unique identifier (CUID)
- `email`: Unique email address (used for sign-in)
- `password`: Hashed with bcrypt (never stored as plaintext)
- `projects`: One-to-many relationship (user can own multiple projects)

#### Project Model
```prisma
model Project {
  id        String   @id @default(cuid())
  name      String
  userId    String?
  messages  String   @default("[]")
  data      String   @default("{}")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```
- `id`: Unique identifier (CUID)
- `name`: Project display name
- `userId`: Optional FK to User (allows **anonymous projects** without authentication)
- `messages`: Chat history stored as JSON string (default empty array)
- `data`: Virtual file system data stored as JSON string (default empty object)
- `onDelete: Cascade`: Deleting a user automatically deletes their projects

**Database Configuration**
- **Provider**: SQLite (file: `prisma/dev.db`)
- **Prisma Client Output**: `src/generated/prisma/` (auto-generated, do NOT edit)
- **JSON Storage**: Both `messages` and `data` are stored as JSON strings in the database

**State Management**
- React Contexts: `ChatContext` (messages), `FileSystemContext` (virtual files)
- Server Actions: Handle form submissions and data mutations
- Virtual file system (in-memory, no disk writes)

**Component Patterns**
- All UI components in `src/components/ui/` are built with Radix UI + Tailwind
- Feature components (chat, editor, etc.) compose UI primitives
- Markdown rendering: Custom `MarkdownRenderer` component (react-markdown)

**API Routes**
- Chat completions: `/api/chat` (POST) - calls Claude for code generation
- Middleware checks auth before app routes

## Common Development Tasks

### Adding a New Feature
1. Create component in `src/components/<feature>/`
2. Add tests in `__tests__/` subdirectory
3. Wire up with Server Actions in `src/actions/`
4. Update contexts/hooks if needed for global state

### Database Changes
1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <migration_name>`
3. Prisma client auto-regenerates in `src/generated/prisma/`

### Adding UI Components
1. Create in `src/components/ui/<component>.tsx`
2. Use Radix UI + Tailwind CSS
3. Follow existing component patterns (use `class-variance-authority` for variants)

### Code Generation / Transform
- JSX transformer: `src/lib/transform/jsx-transformer.ts`
- File manager tools: `src/lib/tools/file-manager.ts`
- String replacement: `src/lib/tools/str-replace.ts`

## Configuration

### Environment Variables
```
ANTHROPIC_API_KEY=your-api-key-here  # Optional (uses static code if missing)
PORT=3000                            # Dev server port
NODE_OPTIONS=--require ./node-compat.cjs  # CommonJS compat (auto-included)
```

### Import Paths
- Use `@/` alias (resolves to `src/`) for all imports
- Example: `import Button from "@/components/ui/button"`

### TypeScript
- Strict mode enabled
- Target: ES2017
- Path aliases configured in `tsconfig.json`

## Debugging & Troubleshooting

**"Command not recognized" on Windows**
- Solution: Add Node.js to PATH first: `$env:PATH = "C:\Program Files\nodejs;" + $env:PATH`

**Port already in use**
- Change: `PORT=8080 npm run dev` or kill process on port 3000

**Prisma client outdated**
- Solution: `npx prisma generate`

**Tests failing**
- Check: `npm run test` to run vitest
- Vitest config: `vitest.config.mts`
- Test files: `__tests__/` directories alongside source

**Database locked errors**
- Solution: Delete `prisma/dev.db` and re-run `npm run setup`

## Testing

- **Framework**: Vitest + Testing Library
- **Coverage**: Components in `src/components/*/\_\_tests\_\_/`
- **Run tests**: `npm run test`
- **Watch mode**: `npm run test -- --watch`

## Performance Notes

- Turbopack used for fast dev builds
- Next.js Image optimization enabled
- Virtual file system prevents expensive disk I/O
- Prisma client generated to custom location (`src/generated/prisma/`)

## Common Pitfalls to Avoid

- ❌ Do NOT edit files in `src/generated/prisma/` - auto-generated
- ❌ Do NOT run Server Actions from client without proper serialization
- ❌ Do NOT forget `NODE_OPTIONS` when running npm scripts (included in pkg.json scripts)
- ❌ Do NOT store sensitive data in virtual file system (ephemeral, lost on server restart)
- ✅ DO use React Contexts for global UI state
- ✅ DO test component interactions with Testing Library
- ✅ DO use Prisma migrations for schema changes
