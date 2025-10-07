# Contributing to CoDi API

First off, thank you for considering contributing to CoDi API! It's people like you that make this project such a great tool for the Mexican fintech community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

When you [create a new bug report](../../issues/new?template=bug_report.md), our template will guide you through providing:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected vs actual behavior**
- **Environment details**: Node.js version, OS, etc.
- **Error messages** or logs (sanitize sensitive data)

**Security Note:** For security vulnerabilities, please follow our [Security Policy](SECURITY.md) instead of creating a public issue.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues.

When you [create a new feature request](../../issues/new?template=feature_request.md), our template will guide you through providing:

- **Use a clear title** describing the enhancement
- **Provide detailed description** of the suggested enhancement
- **Explain why** this enhancement would be useful
- **List alternatives** you've considered
- **Impact assessment** on existing functionality and integrations

### Your First Code Contribution

Look for issues tagged with:

- `good first issue` - Simple issues perfect for newcomers
- `help wanted` - Issues where we need community help
- `documentation` - Documentation improvements

### Areas for Contribution

- 🐛 Bug fixes
- 📝 Documentation improvements
- ✨ New features (discuss in an issue first)
- ✅ Test coverage improvements
- 🔒 Security enhancements
- 🌐 Internationalization (i18n)
- ⚡ Performance optimizations

## Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/codi-api.git
cd codi-api
```

### 2. Add Upstream Remote

```bash
git remote add upstream https://github.com/portfedh/codi-api.git
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Test improvements
- `refactor/` - Code refactoring

### 4. Set Up Development Environment

```bash
npm install
cp .env.example .env
# Edit .env with your test configuration
```

## Development Workflow

### Making Changes

1. Keep commits focused - one logical change per commit
2. Write tests for new features or bug fixes
3. Run tests before committing
4. Follow coding standards
5. Update documentation if needed

### Running Tests

```bash
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- --coverage      # With coverage
```

### Local Development

```bash
npm run dev                 # Start development server
curl http://localhost:3131/v2/health  # Test endpoint
```

## Coding Standards

### JavaScript Style Guide

- Use **2 spaces** for indentation
- Use **semicolons** at the end of statements
- Use **single quotes** for strings
- Use **const** by default, `let` when reassignment needed
- Use **async/await** instead of raw promises

### Naming Conventions

```javascript
// Variables and functions: camelCase
const apiKey = "abc123";
function getUserData() {}

// Classes: PascalCase
class PaymentProcessor {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
```

### Documentation

Use JSDoc comments for functions:

```javascript
/**
 * Sends a CoDi payment request via QR code.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function sendQrPayment(req, res) {
  // Implementation
}
```

### Error Handling

```javascript
try {
  const result = await processPayment(data);
  return res.json({ success: true, result });
} catch (error) {
  console.error("Payment processing failed:", error);
  return res.status(500).json({
    success: false,
    message: "Payment processing failed"
  });
}
```

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(qr): add timeout configuration for QR generation
fix(webhook): prevent duplicate payment processing
docs(readme): update installation instructions
```

## Pull Request Process

### Before Submitting

- ✅ Tests pass: `npm test` succeeds
- ✅ Code is formatted per standards
- ✅ Documentation updated
- ✅ Commits have meaningful messages
- ✅ Branch is up to date with main

### Submitting Your PR

1. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create Pull Request on GitHub

3. Our [PR template](.github/PULL_REQUEST_TEMPLATE.md) will auto-populate. Fill it out with:
   - Description of changes
   - Type of change (bug fix, feature, etc.)
   - Testing performed
   - Related issues
   - License compliance checklist
   - Security considerations

### Review Process

- Maintainers will review your PR
- Address any requested changes
- Once approved, your PR will be merged
- Your contribution will be credited

## Testing Guidelines

### Test Structure

```javascript
describe("Feature Name", () => {
  it("should do X when Y happens", () => {
    // Arrange
    const input = "test";

    // Act
    const result = processInput(input);

    // Assert
    expect(result).toBe("expected");
  });
});
```

### Test Coverage

- Aim for **80%+ coverage** on new code
- Test happy paths and error cases
- Test edge cases and boundary conditions
- Mock external dependencies

## Questions?

- 💬 GitHub Discussions for general questions
- 🐛 GitHub Issues for bugs and feature requests
- 📧 Email for security issues (see SECURITY.md)

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- README acknowledgments for major features

Thank you for contributing to CoDi API! 🚀
