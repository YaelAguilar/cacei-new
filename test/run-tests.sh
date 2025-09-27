#!/bin/bash

# CACEI Test Suite Runner Script
# This script sets up the test environment and runs all tests

set -e  # Exit on any error

echo "🚀 CACEI Test Suite Setup and Execution"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js (v14 or higher) and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    print_error "Node.js version 14 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm and try again."
    exit 1
fi

print_success "npm version: $(npm -v)"

# Navigate to test directory
cd "$(dirname "$0")"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please ensure you're in the test directory."
    exit 1
fi

# Install dependencies
print_status "Installing test dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Check if config.js exists
if [ ! -f "config.js" ]; then
    print_warning "config.js not found. Using default configuration."
    print_status "You may want to create a custom config.js file for your environment."
fi

# Check if backend server is running
print_status "Checking backend server availability..."
if curl -s http://localhost:3000/api/v1/auth/signin > /dev/null 2>&1; then
    print_success "Backend server is running on http://localhost:3000"
elif curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_warning "Backend server is running but API endpoint may not be available"
else
    print_warning "Backend server is not running on http://localhost:3000"
    print_status "Please ensure the backend server is running before running tests."
fi

# Run tests
print_status "Starting test execution..."
echo ""

# Run the test suite
if node test-runner.js --save-report; then
    print_success "All tests completed successfully!"
    echo ""
    print_status "Test report saved to test-report.json"
    
    # Show summary if report exists
    if [ -f "test-report.json" ]; then
        echo ""
        print_status "Test Summary:"
        node -e "
            const report = require('./test-report.json');
            console.log(\`   Total Tests: \${report.summary.total}\`);
            console.log(\`   Passed: \${report.summary.passed}\`);
            console.log(\`   Failed: \${report.summary.failed}\`);
            console.log(\`   Success Rate: \${report.summary.successRate}%\`);
        "
    fi
    
    exit 0
else
    print_error "Some tests failed. Check the output above for details."
    echo ""
    print_status "Test report saved to test-report.json for detailed analysis"
    exit 1
fi
