# Contributing to Shelby's Portfolio

Thank you for your interest in contributing! This is a personal portfolio project, but I welcome suggestions and improvements.

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists in the [Issues](https://github.com/shelb-doc/shelby-doc-portfolio/issues) tab
2. If not, create a new issue with a clear title and description
3. Include steps to reproduce (for bugs) or use cases (for features)

### Submitting Changes

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Write or update tests as needed
   - Ensure all tests pass: `npm test`

4. **Commit your changes**
   ```bash
   git commit -m "Add: brief description of changes"
   ```
   Use prefixes: `Add:`, `Fix:`, `Update:`, `Remove:`, `Refactor:`

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/shelby-doc-portfolio.git
cd shelby-doc-portfolio

# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Start local server
npm run serve
```

## Testing Guidelines

- All new features should include tests
- Maintain or improve code coverage (target: 70%+)
- Test files should be placed in `__tests__/` directory
- Follow existing test patterns

## Code Style

- Use consistent indentation (2 spaces for JS, 4 for HTML)
- Follow ESLint rules (run `npm run lint`)
- Write clear, descriptive variable and function names
- Add comments for complex logic

## Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] Tests pass locally (`npm test`)
- [ ] New tests added for new features
- [ ] Documentation updated (README, comments)
- [ ] No console errors or warnings
- [ ] Commits are clear and descriptive

## Questions?

Feel free to reach out:
- Open an issue for discussion
- Email: shelbycignetti@gmail.com
- LinkedIn: [linkedin.com/in/shelbycignetti](https://www.linkedin.com/in/shelbycignetti/)

Thank you for contributing! 💜
