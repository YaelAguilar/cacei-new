@echo off
REM CACEI Test Suite Runner Script for Windows
REM This script sets up the test environment and runs all tests

echo 🚀 CACEI Test Suite Setup and Execution
echo ======================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js (v14 or higher) and try again.
    exit /b 1
)

echo [SUCCESS] Node.js version: 
node --version

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm and try again.
    exit /b 1
)

echo [SUCCESS] npm version: 
npm --version

REM Navigate to test directory
cd /d "%~dp0"

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found. Please ensure you're in the test directory.
    exit /b 1
)

REM Install dependencies
echo [INFO] Installing test dependencies...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)
echo [SUCCESS] Dependencies installed successfully

REM Check if config.js exists
if not exist "config.js" (
    echo [WARNING] config.js not found. Using default configuration.
    echo [INFO] You may want to create a custom config.js file for your environment.
)

REM Check if backend server is running
echo [INFO] Checking backend server availability...
curl -s http://localhost:3000/api/v1/auth/signin >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Backend server is running on http://localhost:3000
) else (
    curl -s http://localhost:3000 >nul 2>&1
    if %errorlevel% equ 0 (
        echo [WARNING] Backend server is running but API endpoint may not be available
    ) else (
        echo [WARNING] Backend server is not running on http://localhost:3000
        echo [INFO] Please ensure the backend server is running before running tests.
    )
)

REM Run tests
echo [INFO] Starting test execution...
echo.

REM Run the test suite
node test-runner.js --save-report
if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] All tests completed successfully!
    echo.
    echo [INFO] Test report saved to test-report.json
    
    REM Show summary if report exists
    if exist "test-report.json" (
        echo.
        echo [INFO] Test Summary:
        node -e "const report = require('./test-report.json'); console.log('   Total Tests: ' + report.summary.total); console.log('   Passed: ' + report.summary.passed); console.log('   Failed: ' + report.summary.failed); console.log('   Success Rate: ' + report.summary.successRate + '%');"
    )
    
    exit /b 0
) else (
    echo.
    echo [ERROR] Some tests failed. Check the output above for details.
    echo.
    echo [INFO] Test report saved to test-report.json for detailed analysis
    exit /b 1
)
