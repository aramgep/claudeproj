---
type: command
name: audit
description: Detect and fix dependency vulnerabilities
---

# Audit Command

Detects and fixes dependency vulnerabilities in the UIGen project.

## What it does:

1. **Scans** for vulnerable packages with `npm audit`
2. **Fixes** vulnerabilities with `npm audit fix`
3. **Verifies** fixes by running the test suite
4. **Reports** on any remaining issues

## Usage:

Type `/audit` in the Copilot chat to run the full vulnerability detection and remediation workflow.