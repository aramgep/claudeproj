# GitHub Workflows - Claude AI Integration

This directory contains GitHub Actions workflows that enable Claude AI integration for PR reviews, mention handling, and automated code quality checks.

## 📋 Workflows Overview

### 1. **claude-pr-review.yml** - Automated PR Reviews
**Triggered On:**
- Pull request opened, updated, or marked ready for review
- When `@claude` is mentioned in PR comments

**What it does:**
- Analyzes PR changes for code quality, design patterns, and potential issues
- Reviews test coverage and completeness
- Checks documentation updates
- Posts comprehensive review comments with:
  - Summary of changes
  - Strengths of the implementation
  - Suggestions for improvement
  - Questions for clarification
  - Risk assessment (Low/Medium/High)

**Review Focuses On:**
✅ Code Quality & Design Patterns
✅ Potential Bugs & Edge Cases  
✅ Testing & Coverage
✅ Documentation & Comments
✅ Best Practices & Conventions

**Example Usage:**
```
When you create a PR, Claude automatically reviews it.
Or comment: "@claude take a look at this implementation"
```

---

### 2. **claude-mention.yml** - @claude Mention Handler
**Triggered On:**
- Any comment or issue body containing `@claude`

**What it does:**
- Extracts the question/request context
- Gathers relevant file information from PR
- Responds with helpful information about:
  - Direct answers to questions
  - Code examples if needed
  - Documentation links
  - Important context or considerations

**How to Use:**
You can mention Claude in several ways:
```
@claude - what's the best approach for handling this state update?
@claude - can you explain how the file system context works?
@claude - review my component implementation
@claude - help debug this error
```

**Example Issues/PRs:**
- Questions about architecture
- Codebase explanations
- Best practice guidance
- Implementation approaches
- Integration help

---

### 3. **ci.yml** - Test & Lint Pipeline
**Triggered On:**
- Every push to `main` or `develop`
- Every pull request

**What it does:**
- Installs dependencies
- Runs ESLint (Code linting)
- Runs Vitest (Unit tests)
- Builds the application
- Posts results in PR comments
- Tests on Node 18.x and 20.x

**Status Indicators:**
- ✅ All checks passed
- ❌ Build/lint/test failures
- Comments detailed results to PR

---

### 4. **smart-analysis.yml** - Intelligent PR Analysis
**Triggered On:**
- Pull request opened or synchronized

**What it does:**
- Categorizes changed files (components, styles, tests, docs, config)
- Checks test coverage for new components
- Provides intelligent checklists:
  - TypeScript type verification
  - Tailwind CSS usage
  - Responsive design check
  - Accessibility attribute verification
  - UIGen pattern compliance

**Auto-Generated Checklists:**
- For component changes: Type definitions, styling, responsiveness, a11y
- For test coverage: Suggests missing test files
- For documentation: Reminds to update docs if needed

---

## 🚀 Quick Start

### Enabling These Workflows

1. Ensure this repo is on GitHub (not just local)
2. Push these workflow files to `.github/workflows/` directory
3. Enable GitHub Actions in repo settings (usually enabled by default)
4. Create or update a PR - workflows will run automatically

### Using Claude Features

#### Mention Claude in a PR Comment
```
@claude can you review the accessibility implementation?
```

#### Get PR Review
- Create a PR → Claude automatically reviews it
- Or mark as "Ready for Review" → Claude provides detailed feedback

#### Ask Questions
```
@claude how do we handle async state in components?
```

#### Trigger Manual Reviews
Add a comment to PR: 
```
@claude please review this implementation for performance
```

---

## 🔧 Configuration

### Environment Requirements
- GitHub Actions enabled in repository
- No additional secrets needed (uses default GitHub token)
- Works with public and private repositories

### Customization Options

**Edit PR Review Focus:**
Modify `.github/workflows/claude-pr-review.yml` → `review_prompt` step

**Change CI Node Versions:**
Edit `.github/workflows/ci.yml` → `strategy.matrix.node-version`

**Adjust Test Commands:**
Edit `.github/workflows/ci.yml` → replace `npm run test` with your command

---

## 👥 Team Usage Examples

### For Code Reviews
```
Developer A creates PR → GitHub Actions runs CI → Claude reviews
Reviewer B can @mention @claude for specific feedback areas
Claude provides structured feedback with suggestions
```

### For Knowledge Sharing
```
Developer: "@claude how does the FileSystemContext work?"
Claude: Explains architecture with code references
Developer: Gets clear explanation in issue/PR context
```

### For Quality Assurance
```
PR created → CI checks lint/tests
PR analyzed → Component checklist provided
PR reviewed → Claude provides detailed feedback
All in single PR conversation
```

---

## 📊 What Claude Analyzes

### Code Quality Review
- ✅ TypeScript type safety
- ✅ Component structure and reusability
- ✅ Design pattern compliance
- ✅ Naming conventions
- ✅ Code organization

### Testing
- ✅ Test coverage
- ✅ Edge case handling
- ✅ Mock strategies
- ✅ Assertion quality

### Documentation
- ✅ Code comments clarity
- ✅ JSDoc completeness
- ✅ README updates
- ✅ Component prop documentation

### Accessibility
- ✅ ARIA attributes
- ✅ Semantic HTML
- ✅ Keyboard navigation
- ✅ Screen reader compatibility

### Performance
- ✅ Unnecessary re-renders
- ✅ Memory leaks
- ✅ Bundle impact
- ✅ Animation smoothness

---

## 🎯 Best Practices

### Creating Great PR Reviews
1. Write clear PR titles and descriptions
2. Keep PRs focused and reasonably-sized
3. Include context about why changes were made
4. Reference related issues

### Getting Good Feedback from Claude
1. Be specific in @claude mentions
2. Provide context about the problem
3. Ask focused questions
4. Reference code sections you're asking about

### Working with CI Results
1. Fix linting errors first
2. Add tests for new code
3. Build and test locally before pushing
4. Review CI feedback and address failures

---

## 🔍 Troubleshooting

### Workflows Not Running
- Check repo settings → Actions → enabled
- Verify `.github/workflows/` path is correct
- Ensure YAML syntax is valid (no tabs, proper indentation)

### Claude Not Responding to Mentions
- Use exact format: `@claude` (with @)
- Ensure comment/issue is public
- Check workflow logs for errors

### CI Failures
- Run `npm run test` locally to verify
- Run `npm run lint` to check formatting
- Run `npm run build` to test build process

---

## 📚 Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Component Generation Prompt](../../src/lib/prompts/generation.tsx)

---

## 💡 Future Enhancements

Potential improvements to these workflows:
- Integration with Anthropic API for real Claude reviews
- Automated performance benchmarking
- Visual regression testing
- Automated changelog generation
- Security vulnerability scanning
- CodeQL analysis
- Coverage reports and tracking
- Automated dependency updates

