# GitHub Workflows + Generation Prompt Integration Guide

This document explains how the GitHub Actions workflows work with the improved generation prompt to create a complete AI-assisted development workflow.

## 🔄 Complete Development Workflow

```
Developer wants to build feature
    ↓
Creates PR with component request
    ↓
GitHub Actions triggers Claude workflows
    ├─ Smart Analysis: Component checklist
    ├─ CI: Lint, test, build checks
    └─ PR Review: Code quality feedback
    ↓
Claude reviews generated code against:
    ├─ Generation Prompt (TypeScript, a11y, responsive)
    ├─ UIGen Patterns (component structure)
    └─ Best Practices (performance, testing)
    ↓
Developer receives feedback:
    ├─ Automated code review
    ├─ Component checklist  
    ├─ Test coverage gaps
    └─ Suggestions for improvement
    ↓
Developer can @claude with questions
    ↓
Iterates and improves code
    ↓
All checks pass → PR ready to merge
```

## 🎯 How Workflows Enforce Generation Prompt Standards

### Component Quality Standards

**Generation Prompt Requirement:**
```
* Style with tailwindcss, not hardcoded styles
* Use TypeScript with proper type definitions
* Add ARIA labels where needed
* Ensure keyboard navigation works
```

**GitHub Workflows Enforcement:**

1. **smart-analysis.yml** provides checklist:
   ```
   - [ ] TypeScript types defined for all props
   - [ ] Tailwind CSS used for styling (no inline styles)
   - [ ] Accessibility attributes included (aria-*, role)
   ```

2. **claude-pr-review.yml** verifies:
   - Semantic HTML usage
   - Tailwind class combinations
   - ARIA attribute completeness
   - Keyboard navigation support

### Design System Consistency

**Generation Prompt Specifies:**
```
* Use consistent color palette
* Use consistent spacing (multiples of 4px)
* Use Tailwind's standard rounded corners
* Font sizes should be semantic
```

**Workflow Enforcement:**
- Claude checks for Tailwind utility classes only
- Alerts on hardcoded values
- Reviews spacing consistency
- Verifies responsive prefixes (sm:, md:, lg:)

### Responsive Design

**Generation Prompt Requires:**
```
Mobile-first design approach
- Use Tailwind responsive prefixes
- Stack layouts vertically on mobile
- Horizontal layouts on larger screens
```

**Workflow Checks:**
- smart-analysis.yml verifies responsive classes used
- claude-pr-review.yml checks mobile-first approach
- ci.yml ensures no build errors from responsive code

## 💬 @claude Integration Points

### Ask Questions About Standards
```
@claude - does this component follow the responsive design guidelines?
@claude - is this component accessible for screen readers?
@claude - should we add more tests for edge cases?
```

**Claude Can:**
- Reference specific parts of the generation prompt
- Explain UIGen conventions
- Suggest improvements aligned with project standards
- Debug implementation questions

### Getting Component Reviews
```
@claude please review this component for:
- TypeScript type safety
- Tailwind CSS proper usage
- Accessibility compliance
```

**Claude Reviews:**
- Against generation prompt standards
- For code quality patterns
- Testing completeness
- Documentation clarity

### Quick Standards Check
```
@claude - checkpoint: does this match our component standards?
```

**Workflow Response:**
```
✅ Component: Button
- Props properly typed ✓
- Tailwind only ✓
- ARIA labels present ✓
- Responsive classes ✓
- Tests included ✓

Minor suggestions:
- Add JSDoc for complex props
- Consider React.memo for performance
```

## 📊 Quality Metrics Tracked

### By Generation Prompt
- TypeScript type coverage
- Tailwind CSS compliance (no hardcoded styles)
- Accessibility compliance (ARIA, semantics)
- Responsive design implementation
- Performance optimization (memoization)

### By Smart Analysis
- Component structure consistency
- Test file organization
- Documentation updates
- Code organization

### By CI Pipeline
- Lint errors (ESLint)
- Test coverage
- Build success
- Node version compatibility

### By PR Review
- Code quality score
- Risk assessment
- Suggestions for improvement
- Pattern compliance

## 🚀 Workflow Triggers Summary

### Automatic (No Action Needed)
```
PR Created/Updated → smart-analysis.yml, claude-pr-review.yml, ci.yml
Push to main/develop → ci.yml
```

### Manual (@claude mentions)
```
Comment: @claude <question> → claude-mention.yml
Comment: @claude review <aspect> → claude-pr-review.yml
```

### On Status Change
```
Mark as "Ready for Review" → claude-pr-review.yml
All checks passing → PR ready
```

## 📝 Example Workflow Scenario

### Step 1: Create Component Request
```
Developer: "Create a CardComponent with title, description, and action button"
(Push to PR)
```

### Step 2: Automatic Analysis
```
✅ smart-analysis.yml runs:
- Detected new component file
- Checks TypeScript types: ✓
- Checks Tailwind usage: ✓
- Suggests testing: "Consider adding CardComponent.test.tsx"

✅ ci.yml runs:
- Lint: ✓
- Tests: ✓
- Build: ✓

✅ claude-pr-review.yml runs:
- Component review posted with suggestions
```

### Step 3: Developer Question
```
Developer: "@claude - is this responsive on mobile?"
```

### Step 4: Claude Response
```
✅ claude-mention.yml:
- Analyzes CardComponent
- Reviews responsive classes
- Checks mobile viewport approach
- Explains improvements

Response:
"Your component uses flex layout. For mobile, consider:
1. Add responsive prefixes: sm:flex-row md:flex-row
2. Test with mobile viewport (320px)
3. Stack vertically by default: <div className='flex flex-col sm:flex-row'>
```

### Step 5: Developer Updates
```
Developer implements feedback
Pushes updated code
```

### Step 6: Verification
```
All automated checks pass
Claude confirms improved accessibility
Developer can merge with confidence
```

## 🔍 Integration Points

### Generation Prompt → Workflows
- **Types**: Prompt specifies TypeScript → smart-analysis checks
- **Styling**: Prompt requires Tailwind → claude-pr-review verifies
- **A11y**: Prompt needs ARIA labels → workflows check implementation
- **Responsiveness**: Prompt requires mobile-first → smart-analysis verifies

### Workflows → Developer Feedback
- **smart-analysis.yml**: Provides implementation checklist
- **claude-pr-review.yml**: Gives detailed feedback on adherence
- **claude-mention.yml**: Answers specific questions
- **ci.yml**: Confirms build quality

## 📈 Continuous Improvement

The workflows create data for improving the generation prompt:

1. **Common CI Failures** → Update generation prompt to prevent
2. **Frequent Review Comments** → Add specific guidance to prompt
3. **Missing Tests** → Emphasize testing in prompt
4. **Accessibility Issues** → Expand a11y section in prompt

Example Feedback Loop:
```
If many PRs fail accessibility checks:
1. Claude notes this in reviews
2. Workflow stats show this is common
3. Generation prompt updated with better a11y guidance
4. Future generated components have better a11y
```

## 🎨 Sample Component Output

When developer requests "Create a button component" under this system:

### What Gets Generated (Following Enhanced Prompt)
```typescript
// /components/Button.tsx
import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  'aria-label': ariaLabel,
}) => {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 disabled:opacity-50 cursor-disabled:not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
```

### What Workflows Verify
```
✅ smart-analysis.yml Checklist:
  - [x] TypeScript types defined for all props (ButtonProps interface)
  - [x] Tailwind CSS used for styling (no inline styles)
  - [x] Component is responsive (scalable with size prop)
  - [x] Accessibility attributes included (aria-label, aria-disabled)
  - [x] Component follows UIGen patterns (default export, .tsx file)

✅ claude-pr-review.yml Feedback:
  - Summary: Well-structured accessible button component
  - Strengths: Proper typing, semantic HTML, ARIA support
  - Suggestions: Consider Button.test.tsx, add focus-visible for better UX
  - Risk Level: Low - isolated, self-contained component

✅ ci.yml Results:
  - Lint: ✓ No errors
  - Tests: ✓ All passing
  - Build: ✓ Compiled successfully
```

## 🎓 Learning Resource

These workflows serve as documentation for:
- **Generation Prompt**: What standards components should meet
- **UCI Code Style**: How UIGen components are structured
- **Quality Standards**: What makes a production-ready component
- **Best Practices**: Accessibility, testing, performance

New team members can see working examples in review comments!

