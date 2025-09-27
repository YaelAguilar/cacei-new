// Main Test Runner
const colors = require('colors');
const AuthTests = require('./tests/auth-tests');
const ProposalTests = require('./tests/proposal-tests');
const CommentTests = require('./tests/comment-tests');
const IntegrationTests = require('./tests/integration-tests');

class TestRunner {
  constructor() {
    this.testSuites = [
      { name: 'Authentication Tests', class: AuthTests },
      { name: 'Proposal Tests', class: ProposalTests },
      { name: 'Comment Tests', class: CommentTests },
      { name: 'Integration Tests', class: IntegrationTests }
    ];
    
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      suites: []
    };
  }

  async runAllTests() {
    console.log('🚀 Starting CACEI Test Suite'.cyan.bold);
    console.log('='.repeat(60).cyan);
    console.log(`📅 Test Run: ${new Date().toISOString()}`.gray);
    console.log(`🎯 Target: ${process.env.API_BASE_URL || 'http://localhost:3000/api/v1'}`.gray);
    console.log('');

    const startTime = Date.now();

    for (const suite of this.testSuites) {
      console.log(`\n🧪 Running ${suite.name}`.yellow.bold);
      console.log('-'.repeat(50).yellow);
      
      try {
        const suiteInstance = new suite.class();
        const suiteResults = await suiteInstance.runAllTests();
        
        const suiteStats = this.calculateSuiteStats(suiteResults);
        this.results.suites.push({
          name: suite.name,
          ...suiteStats,
          results: suiteResults
        });
        
        this.results.total += suiteStats.total;
        this.results.passed += suiteStats.passed;
        this.results.failed += suiteStats.failed;
        
        this.printSuiteSummary(suite.name, suiteStats);
        
      } catch (error) {
        console.error(`❌ Test suite ${suite.name} failed to run:`.red.bold);
        console.error(`   ${error.message}`.red);
        
        this.results.suites.push({
          name: suite.name,
          total: 0,
          passed: 0,
          failed: 1,
          error: error.message,
          results: []
        });
        
        this.results.total += 1;
        this.results.failed += 1;
      }
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    this.printFinalSummary(duration);
    
    return this.results;
  }

  calculateSuiteStats(suiteResults) {
    const total = suiteResults.length;
    const passed = suiteResults.filter(r => r.passed).length;
    const failed = suiteResults.filter(r => !r.passed).length;
    
    return { total, passed, failed };
  }

  printSuiteSummary(suiteName, stats) {
    const successRate = ((stats.passed / stats.total) * 100).toFixed(1);
    const statusColor = stats.failed === 0 ? 'green' : 'red';
    
    console.log(`\n📊 ${suiteName} Summary:`.bold);
    console.log(`   ✅ Passed: ${stats.passed}`.green);
    console.log(`   ❌ Failed: ${stats.failed}`.red);
    console.log(`   📈 Success Rate: ${successRate}%`[statusColor]);
  }

  printFinalSummary(duration) {
    console.log('\n' + '='.repeat(60).cyan);
    console.log('📋 FINAL TEST RESULTS'.cyan.bold);
    console.log('='.repeat(60).cyan);
    
    const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    const statusColor = this.results.failed === 0 ? 'green' : 'yellow';
    
    console.log(`🎯 Total Tests: ${this.results.total}`.bold);
    console.log(`✅ Passed: ${this.results.passed}`.green.bold);
    console.log(`❌ Failed: ${this.results.failed}`.red.bold);
    console.log(`📈 Overall Success Rate: ${successRate}%`[statusColor].bold);
    console.log(`⏱️  Duration: ${(duration / 1000).toFixed(2)}s`.gray);
    
    if (this.results.failed > 0) {
      console.log('\n❌ FAILED TESTS:'.red.bold);
      this.results.suites.forEach(suite => {
        if (suite.failed > 0) {
          console.log(`\n📁 ${suite.name}:`.red);
          suite.results
            .filter(r => !r.passed)
            .forEach(test => {
              console.log(`   • ${test.name}: ${test.error}`.red);
            });
        }
      });
    }
    
    console.log('\n' + '='.repeat(60).cyan);
    
    if (this.results.failed === 0) {
      console.log('🎉 ALL TESTS PASSED! The system is working correctly.'.green.bold);
    } else {
      console.log('⚠️  Some tests failed. Please review the issues above.'.yellow.bold);
    }
    
    console.log('='.repeat(60).cyan);
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: ((this.results.passed / this.results.total) * 100).toFixed(1)
      },
      suites: this.results.suites.map(suite => ({
        name: suite.name,
        total: suite.total,
        passed: suite.passed,
        failed: suite.failed,
        successRate: suite.total > 0 ? ((suite.passed / suite.total) * 100).toFixed(1) : '0.0',
        tests: suite.results.map(test => ({
          name: test.name,
          passed: test.passed,
          error: test.error || null
        }))
      }))
    };
    
    return report;
  }

  saveReport(filename = 'test-report.json') {
    const fs = require('fs');
    const report = this.generateReport();
    
    try {
      fs.writeFileSync(filename, JSON.stringify(report, null, 2));
      console.log(`📄 Test report saved to ${filename}`.gray);
    } catch (error) {
      console.error(`❌ Failed to save test report: ${error.message}`.red);
    }
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  const runner = new TestRunner();
  
  // Parse command line arguments
  const options = {
    saveReport: args.includes('--save-report'),
    reportFile: args.find(arg => arg.startsWith('--report-file='))?.split('=')[1] || 'test-report.json',
    help: args.includes('--help') || args.includes('-h')
  };
  
  if (options.help) {
    console.log('CACEI Test Suite Runner'.cyan.bold);
    console.log('');
    console.log('Usage: node test-runner.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  --save-report        Save detailed test report to JSON file');
    console.log('  --report-file=FILE   Specify report filename (default: test-report.json)');
    console.log('  --help, -h           Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  node test-runner.js');
    console.log('  node test-runner.js --save-report');
    console.log('  node test-runner.js --save-report --report-file=my-report.json');
    return;
  }
  
  try {
    const results = await runner.runAllTests();
    
    if (options.saveReport) {
      runner.saveReport(options.reportFile);
    }
    
    // Exit with appropriate code
    process.exit(results.failed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Test runner failed:'.red.bold);
    console.error(`   ${error.message}`.red);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = TestRunner;
