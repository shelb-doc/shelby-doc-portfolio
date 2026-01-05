# Quick Start Guide

Get your portfolio up and running in minutes!

## Prerequisites

- Node.js 18.x or 20.x ([Download here](https://nodejs.org/))
- Git ([Download here](https://git-scm.com/))
- A code editor (VS Code, Sublime, etc.)

## Installation

```bash
# Clone the repository
git clone https://github.com/shelb-doc/shelby-doc-portfolio.git
cd shelby-doc-portfolio

# Install dependencies
npm install
```

## Common Commands

### Development

```bash
# Start a local development server
npm run serve
# Visit: http://localhost:8080

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch
```

### Testing

```bash
# Run all tests once
npm test

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test navigation.test.js
```

### Linting

```bash
# Check code quality
npm run lint
```

## Project Structure Overview

```
📦 Portfolio
├── 📁 .github/workflows    # CI/CD automation
├── 📁 __tests__           # Test files
├── 📄 index.html          # Main portfolio (open in browser)
├── 📄 package.json        # Dependencies and scripts
└── 📄 README.md           # Full documentation
```

## Making Changes

1. **Edit the HTML**: Open `index.html` in your editor
2. **Test locally**: Open `index.html` in your browser or use `npm run serve`
3. **Run tests**: `npm test` to ensure nothing broke
4. **Commit**: `git commit -m "Your changes"`

## Deployment

### GitHub Pages (Automated)

The portfolio auto-deploys to GitHub Pages when you push to `main`:

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

Visit: `https://YOUR-USERNAME.github.io/shelby-doc-portfolio/`

### Manual Hosting

Simply upload `index.html` to any web hosting service:
- Netlify
- Vercel
- AWS S3
- Your own server

## Need Help?

- 📖 Full docs: [README.md](README.md)
- 🤝 Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)
- 🐛 Report issues: [GitHub Issues](https://github.com/shelb-doc/shelby-doc-portfolio/issues)
- 📧 Contact: shelbycignetti@gmail.com

## Tips

- The rubber duck in the bottom-right corner is clickable! 🦆
- Tests ensure your changes don't break existing functionality
- Check GitHub Actions tab for deployment status
- Coverage reports are in `coverage/` folder after running tests

Happy coding! 💜
