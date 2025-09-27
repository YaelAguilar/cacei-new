// Test Helper Utilities
const axios = require('axios');
const config = require('../config');

class TestHelpers {
  constructor() {
    this.apiClient = axios.create({
      baseURL: config.apiBaseUrl,
      withCredentials: true,
      timeout: config.timeouts.medium
    });
    
    this.authTokens = new Map();
  }

  // Authentication helpers
  async login(userType) {
    const user = config.users[userType];
    if (!user) {
      throw new Error(`User type ${userType} not found in config`);
    }

    try {
      const response = await this.apiClient.post('/auth/signin', {
        email: user.email,
        password: user.password
      });

      if (response.status === 200) {
        // Store the user data and cookies for this user type
        this.authTokens.set(userType, {
          user: response.data,
          cookies: response.headers['set-cookie'] || []
        });
        return response.data;
      }
      
      throw new Error('Login failed: Invalid response');
    } catch (error) {
      console.error(`Login failed for ${userType}:`, error.response?.data || error.message);
      throw error;
    }
  }

  async logout(userType) {
    this.authTokens.delete(userType);
  }

  async getAuthenticatedClient(userType) {
    if (!this.authTokens.has(userType)) {
      await this.login(userType);
    }

    const authData = this.authTokens.get(userType);
    return axios.create({
      baseURL: config.apiBaseUrl,
      withCredentials: true,
      timeout: config.timeouts.medium,
      headers: {
        'Cookie': authData.cookies.join('; ')
      }
    });
  }

  // API Test helpers
  async makeRequest(method, endpoint, data = null, userType = null) {
    const client = userType ? await this.getAuthenticatedClient(userType) : this.apiClient;
    
    try {
      switch (method.toLowerCase()) {
        case 'get':
          return await client.get(endpoint);
        case 'post':
          return await client.post(endpoint, data);
        case 'put':
          return await client.put(endpoint, data);
        case 'patch':
          return await client.patch(endpoint, data);
        case 'delete':
          return await client.delete(endpoint);
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    } catch (error) {
      return error.response || error;
    }
  }

  // Test assertion helpers
  assertSuccess(response, expectedStatus = 200) {
    if (response.status !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, got ${response.status}. Response: ${JSON.stringify(response.data)}`);
    }
    return true;
  }

  assertError(response, expectedStatus = 400) {
    if (response.status !== expectedStatus) {
      throw new Error(`Expected error status ${expectedStatus}, got ${response.status}. Response: ${JSON.stringify(response.data)}`);
    }
    return true;
  }

  assertHasProperty(obj, property) {
    if (!obj.hasOwnProperty(property)) {
      throw new Error(`Expected object to have property '${property}'. Object: ${JSON.stringify(obj)}`);
    }
    return true;
  }

  assertArrayLength(arr, expectedLength) {
    if (!Array.isArray(arr)) {
      throw new Error(`Expected array, got ${typeof arr}`);
    }
    if (arr.length !== expectedLength) {
      throw new Error(`Expected array length ${expectedLength}, got ${arr.length}`);
    }
    return true;
  }

  assertValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
      throw new Error(`Invalid UUID format: ${uuid}`);
    }
    return true;
  }

  assertValidDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${dateString}`);
    }
    return true;
  }

  // Data generation helpers
  generateValidProposal(overrides = {}) {
    return {
      ...config.testData.validProposal,
      ...overrides
    };
  }

  generateInvalidProposal(overrides = {}) {
    return {
      ...config.testData.invalidProposal,
      ...overrides
    };
  }

  // Wait helpers
  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async waitForCondition(condition, timeout = config.timeouts.medium, interval = 1000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true;
      }
      await this.wait(interval);
    }
    
    throw new Error(`Condition not met within ${timeout}ms`);
  }

  // Cleanup helpers
  async cleanup() {
    this.authTokens.clear();
  }

  // Logging helpers
  logTest(testName, status = 'RUNNING') {
    const timestamp = new Date().toISOString();
    const statusEmoji = {
      'RUNNING': '🔄',
      'PASSED': '✅',
      'FAILED': '❌',
      'SKIPPED': '⏭️'
    };
    
    console.log(`${statusEmoji[status]} [${timestamp}] ${testName}`);
  }

  logResult(testName, passed, message = '') {
    const status = passed ? 'PASSED' : 'FAILED';
    this.logTest(testName, status);
    if (message) {
      console.log(`   ${message}`);
    }
  }

  // Test suite helpers
  async runTest(testName, testFunction) {
    this.logTest(testName);
    
    try {
      await testFunction();
      this.logResult(testName, true);
      return { name: testName, passed: true, error: null };
    } catch (error) {
      this.logResult(testName, false, error.message);
      return { name: testName, passed: false, error: error.message };
    }
  }

  async runTestSuite(suiteName, tests) {
    console.log(`\n🧪 Running test suite: ${suiteName}`);
    console.log('='.repeat(50));
    
    const results = [];
    let passed = 0;
    let failed = 0;

    for (const [testName, testFunction] of Object.entries(tests)) {
      const result = await this.runTest(testName, testFunction);
      results.push(result);
      
      if (result.passed) {
        passed++;
      } else {
        failed++;
      }
    }

    console.log(`\n📊 Test Suite Results: ${suiteName}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    
    return results;
  }
}

module.exports = TestHelpers;
