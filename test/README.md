# CACEI Test Suite

Comprehensive test suite for the CACEI alumnos-propuestas feature, covering authentication, proposal management, comment system, and end-to-end workflows.

## Overview

This test suite validates the complete functionality of the alumnos-propuestas feature, ensuring that:

- Students can create and manage proposals
- Tutors can evaluate proposals through comments and voting
- Proposal status management works correctly
- Role-based access control is enforced
- Data consistency is maintained across operations

## Test Structure

### Test Categories

1. **Authentication Tests** (`tests/auth-tests.js`)
   - User login/logout functionality
   - Token validation and expiration
   - Protected route access control
   - Multiple user authentication

2. **Proposal Tests** (`tests/proposal-tests.js`)
   - Proposal creation and validation
   - Data field validation
   - Business rule enforcement
   - CRUD operations
   - Status management

3. **Comment Tests** (`tests/comment-tests.js`)
   - Comment creation and validation
   - Voting system functionality
   - Comment updates (ACTUALIZA only)
   - Proposal approval/rejection workflows
   - Status calculation logic

4. **Integration Tests** (`tests/integration-tests.js`)
   - End-to-end user workflows
   - Multi-user scenarios
   - Concurrent operations
   - Data consistency validation
   - Error handling and recovery

## Setup

### Prerequisites

- Node.js (v14 or higher)
- Backend server running on `http://localhost:3000`
- Frontend server running on `http://localhost:5173`
- Database with test data

### Installation

```bash
cd test
npm install
```

### Configuration

Copy the example configuration and update with your test environment details:

```bash
cp config.js.example config.js
```

Update the configuration file with:
- API base URL
- Test user credentials
- Database connection details

## Running Tests

### Run All Tests

```bash
npm test
# or
node test-runner.js
```

### Run Specific Test Suites

```bash
# Authentication tests only
npm run test:auth

# Proposal tests only
npm run test:proposals

# Comment tests only
npm run test:comments

# Integration tests only
npm run test:integration
```

### Generate Test Report

```bash
# Run tests and save detailed report
node test-runner.js --save-report

# Specify custom report filename
node test-runner.js --save-report --report-file=my-report.json
```

## Test Data

### Test Users

The test suite uses predefined test users with different roles:

- **Alumno**: `alumno-test@upchiapas.edu.mx`
- **Director**: `director-test@upchiapas.edu.mx`
- **PTC**: `ptc@upchiapas.edu.mx`
- **PA**: `pa@upchiapas.edu.mx`
- **Admin Usuarios**: `admin-usuarios@upchiapas.edu.mx`
- **Super Admin**: `yam778123@gmail.com`

Additional PTC users:
- `carlos.mendoza@upchiapas.edu.mx`
- `maria.gonzalez@upchiapas.edu.mx`
- `jose.hernandez@upchiapas.edu.mx`
- `ana.perez@upchiapas.edu.mx`
- `roberto.jimenez@upchiapas.edu.mx`

**Note**: All PTC users use the same password for testing purposes.

### Test Proposals

The test suite generates valid test proposals with:
- Complete company information
- Valid project details
- Proper date ranges
- All required fields populated

## Test Scenarios

### Student Workflow

1. **Login** as student
2. **Check** for active convocatoria
3. **Create** new proposal
4. **Verify** proposal status is PENDIENTE
5. **View** student's proposals
6. **Update** proposal (if status allows)
7. **Attempt** to create duplicate proposal (should fail)

### Tutor Evaluation Workflow

1. **Login** as tutor
2. **View** proposal details
3. **Create** comments on specific sections
4. **Vote** on proposal sections (ACEPTADO/RECHAZADO/ACTUALIZA)
5. **Update** comments (if ACTUALIZA)
6. **Approve/Reject** entire proposal
7. **Verify** proposal status changes

### Proposal Status Management

The test suite validates the following status transitions:

- **PENDIENTE** → **APROBADO** (3 ACEPTADO votes)
- **PENDIENTE** → **RECHAZADO** (3 RECHAZADO votes)
- **PENDIENTE** → **ACTUALIZAR** (1+ ACTUALIZA votes)
- **ACTUALIZAR** → **APROBADO** (after updates and 3 ACEPTADO votes)
- **ACTUALIZAR** → **RECHAZADO** (after updates and 3 RECHAZADO votes)

### Business Rules Validation

- One proposal per student per convocatoria
- Minimum 30-day project duration
- Valid RFC format
- Valid postal code format
- Required field validation
- Date range validation
- Email format validation

## Expected Results

### Successful Test Run

```
🚀 Starting CACEI Test Suite
============================================================
📅 Test Run: 2025-01-27T10:30:00.000Z
🎯 Target: http://localhost:3000/api/v1

🧪 Running Authentication Tests
--------------------------------------------------
✅ Login with valid credentials
✅ Login with invalid email
✅ Login with invalid password
...

📊 Authentication Tests Summary:
   ✅ Passed: 9
   ❌ Failed: 0
   📈 Success Rate: 100.0%

🧪 Running Proposal Tests
--------------------------------------------------
...

============================================================
📋 FINAL TEST RESULTS
============================================================
🎯 Total Tests: 45
✅ Passed: 45
❌ Failed: 0
📈 Overall Success Rate: 100.0%
⏱️  Duration: 12.34s

🎉 ALL TESTS PASSED! The system is working correctly.
============================================================
```

### Failed Test Example

```
❌ FAILED TESTS:
📁 Proposal Tests:
   • Create proposal with invalid data: Expected status 400, got 200
   • Validate proposal fields: Invalid RFC format not rejected

📁 Comment Tests:
   • Create comment on proposal: Proposal not found
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure backend server is running on port 3000
   - Check API_BASE_URL in config.js

2. **Authentication Failures**
   - Verify test user credentials in config.js
   - Ensure users exist in database
   - Check password hashing

3. **Database Errors**
   - Ensure database is accessible
   - Verify test data exists
   - Check foreign key constraints

4. **Test Data Conflicts**
   - Tests may fail if run multiple times
   - Consider cleaning up test data between runs
   - Use unique identifiers for test data

### Debug Mode

Enable detailed logging by setting environment variable:

```bash
DEBUG=true node test-runner.js
```

### Test Isolation

Each test suite is designed to be independent, but some tests may affect others due to:
- Shared database state
- User session persistence
- Proposal creation limits

Consider running tests in isolated environments for production validation.

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Use descriptive test names
3. Include proper error messages
4. Clean up test data
5. Update this README if adding new test categories

## Maintenance

- Update test data when database schema changes
- Verify test user credentials periodically
- Review and update business rule validations
- Monitor test execution time and optimize if needed
