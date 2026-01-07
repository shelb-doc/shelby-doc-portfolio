#!/bin/bash

###############################################################################
# Test Runner Script
# Comprehensive test execution with reporting and CI/CD support
# Author: Shelby Cignetti
# Usage: ./scripts/run-tests.sh [options]
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

###############################################################################
# Helper Functions
###############################################################################

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

###############################################################################
# Check Dependencies
###############################################################################

check_dependencies() {
    print_header "Checking Dependencies"

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    print_success "Node.js $(node --version)"

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm $(npm --version)"

    if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
        print_warning "node_modules not found. Running npm install..."
        cd "$PROJECT_ROOT"
        npm install
    fi
    print_success "Dependencies installed"

    echo ""
}

###############################################################################
# Run Tests
###############################################################################

run_unit_tests() {
    print_header "Running Unit Tests"
    cd "$PROJECT_ROOT"

    if npm test; then
        print_success "All unit tests passed!"
        return 0
    else
        print_error "Unit tests failed!"
        return 1
    fi
}

run_tests_with_coverage() {
    print_header "Running Tests with Coverage"
    cd "$PROJECT_ROOT"

    if npm test -- --coverage; then
        print_success "Tests completed with coverage report"
        echo ""
        print_info "Coverage report available at: coverage/lcov-report/index.html"
        return 0
    else
        print_error "Tests failed!"
        return 1
    fi
}

run_watch_mode() {
    print_header "Starting Test Watch Mode"
    cd "$PROJECT_ROOT"
    print_info "Press 'q' to quit, 'a' to run all tests"
    npm run test:watch
}

###############################################################################
# Lint Code
###############################################################################

run_linter() {
    print_header "Running ESLint"
    cd "$PROJECT_ROOT"

    if npm run lint; then
        print_success "Linting passed!"
        return 0
    else
        print_warning "Linting issues found"
        return 1
    fi
}

###############################################################################
# Generate Reports
###############################################################################

generate_coverage_report() {
    print_header "Generating Coverage Report"
    cd "$PROJECT_ROOT"

    npm test -- --coverage --coverageReporters=html,text,lcov

    if [ -f "coverage/index.html" ]; then
        print_success "Coverage report generated"
        print_info "Open: coverage/index.html"
    fi
}

show_test_summary() {
    print_header "Test Summary"

    if [ -f "$PROJECT_ROOT/coverage/coverage-summary.json" ]; then
        cd "$PROJECT_ROOT"
        node -e "
        const summary = require('./coverage/coverage-summary.json');
        const total = summary.total;
        console.log('Lines:      ', total.lines.pct + '%');
        console.log('Statements: ', total.statements.pct + '%');
        console.log('Functions:  ', total.functions.pct + '%');
        console.log('Branches:   ', total.branches.pct + '%');
        "
    fi
}

###############################################################################
# CI/CD Mode
###############################################################################

run_ci_tests() {
    print_header "Running CI/CD Test Suite"

    # Run all checks
    local EXIT_CODE=0

    check_dependencies

    if ! run_linter; then
        EXIT_CODE=1
    fi

    if ! run_tests_with_coverage; then
        EXIT_CODE=1
    fi

    show_test_summary

    if [ $EXIT_CODE -eq 0 ]; then
        print_success "All CI checks passed!"
    else
        print_error "CI checks failed!"
    fi

    return $EXIT_CODE
}

###############################################################################
# Main Menu
###############################################################################

show_usage() {
    cat << EOF
${PURPLE}Portfolio Test Runner${NC}

${BLUE}Usage:${NC}
  ./scripts/run-tests.sh [option]

${BLUE}Options:${NC}
  -h, --help          Show this help message
  -u, --unit          Run unit tests only
  -c, --coverage      Run tests with coverage report
  -w, --watch         Run tests in watch mode
  -l, --lint          Run ESLint
  -r, --report        Generate detailed coverage report
  -ci, --ci-mode      Run full CI/CD test suite
  -a, --all           Run all checks (lint + tests + coverage)

${BLUE}Examples:${NC}
  ./scripts/run-tests.sh --unit
  ./scripts/run-tests.sh --coverage
  ./scripts/run-tests.sh --watch
  ./scripts/run-tests.sh --ci-mode

${BLUE}For more information:${NC}
  See docs/test-strategy.md
EOF
}

###############################################################################
# Main Execution
###############################################################################

main() {
    # Change to project root
    cd "$PROJECT_ROOT"

    # Parse arguments
    case "${1:-}" in
        -h|--help)
            show_usage
            ;;
        -u|--unit)
            check_dependencies
            run_unit_tests
            ;;
        -c|--coverage)
            check_dependencies
            run_tests_with_coverage
            show_test_summary
            ;;
        -w|--watch)
            check_dependencies
            run_watch_mode
            ;;
        -l|--lint)
            check_dependencies
            run_linter
            ;;
        -r|--report)
            check_dependencies
            generate_coverage_report
            ;;
        -ci|--ci-mode)
            run_ci_tests
            ;;
        -a|--all)
            check_dependencies
            run_linter
            run_tests_with_coverage
            show_test_summary
            ;;
        "")
            # Default: run basic tests
            check_dependencies
            run_unit_tests
            ;;
        *)
            print_error "Unknown option: $1"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
