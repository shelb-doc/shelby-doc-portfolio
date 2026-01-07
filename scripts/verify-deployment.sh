#!/bin/bash

###############################################################################
# Deployment Verification Script
# Checks if your portfolio is ready for GitHub Pages deployment
# Author: Shelby Cignetti
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

print_header "GitHub Pages Deployment Verification"
echo ""

# Check 1: Verify src directory structure
print_info "Checking file structure..."
if [ -f "src/index.html" ]; then
    print_success "src/index.html exists"
else
    print_error "src/index.html not found"
    exit 1
fi

if [ -d "src/css" ] && [ -f "src/css/styles.css" ]; then
    print_success "CSS directory and files exist"
else
    print_error "CSS files not found in src/css/"
    exit 1
fi

if [ -d "src/js" ]; then
    JS_FILES=$(find src/js -name "*.js" | wc -l)
    if [ "$JS_FILES" -gt 0 ]; then
        print_success "JavaScript files exist ($JS_FILES files)"
    else
        print_error "No JavaScript files found in src/js/"
        exit 1
    fi
else
    print_error "JavaScript directory not found"
    exit 1
fi

echo ""

# Check 2: Verify workflow configuration
print_info "Checking GitHub Actions workflow..."
if [ -f ".github/workflows/ci.yml" ]; then
    print_success "Workflow file exists"

    if grep -q "publish_dir: ./src" ".github/workflows/ci.yml"; then
        print_success "Workflow configured to deploy from src/"
    else
        print_warning "Workflow may not be configured correctly"
        print_info "Expected: publish_dir: ./src"
    fi
else
    print_error "Workflow file not found"
    exit 1
fi

echo ""

# Check 3: Verify package.json scripts
print_info "Checking npm scripts..."
if [ -f "package.json" ]; then
    print_success "package.json exists"

    if grep -q '"serve"' package.json; then
        print_success "Serve script configured"
    fi

    if grep -q '"test"' package.json; then
        print_success "Test script configured"
    fi
fi

echo ""

# Check 4: Check for common issues
print_info "Checking for common deployment issues..."

# Check for absolute paths in HTML
if grep -q 'href="/' src/index.html || grep -q 'src="/' src/index.html; then
    print_warning "Found absolute paths in HTML - may cause 404 errors"
    print_info "Use relative paths: href=\"css/styles.css\" not href=\"/css/styles.css\""
else
    print_success "All paths are relative"
fi

# Check for proper meta tags
if grep -q '<meta name="description"' src/index.html; then
    print_success "Meta description found"
else
    print_warning "Meta description not found"
fi

echo ""

# Check 5: Verify git status
print_info "Checking git status..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    print_success "Git repository initialized"

    BRANCH=$(git branch --show-current)
    print_info "Current branch: $BRANCH"

    if [ "$BRANCH" = "main" ]; then
        print_success "On main branch (deployment will trigger)"
    else
        print_warning "Not on main branch (deployment won't trigger)"
        print_info "Switch to main: git checkout main"
    fi

    # Check for uncommitted changes
    if [ -z "$(git status --porcelain)" ]; then
        print_success "No uncommitted changes"
    else
        print_warning "You have uncommitted changes"
        print_info "Commit and push to trigger deployment"
    fi
else
    print_error "Not a git repository"
    exit 1
fi

echo ""

# Check 6: Test local server
print_info "Testing if local server can run..."
if command -v http-server &> /dev/null; then
    print_success "http-server is available"
    print_info "Run: npm run serve"
    print_info "Then visit: http://localhost:8080"
else
    print_warning "http-server not installed"
    print_info "Install: npm install"
fi

echo ""

# Summary
print_header "Verification Summary"

echo ""
print_info "Next Steps:"
echo "1. Commit and push changes: git add . && git commit -m \"Update\" && git push origin main"
echo "2. Check Actions tab: https://github.com/shelb-doc/shelby-doc-portfolio/actions"
echo "3. Wait for deployment (1-5 minutes)"
echo "4. Visit: https://shelb-doc.github.io/shelby-doc-portfolio/"

echo ""
print_success "Verification complete! Your site is ready to deploy."
