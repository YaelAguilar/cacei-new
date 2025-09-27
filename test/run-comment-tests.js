// Run only comment tests
const CommentTests = require('./tests/comment-tests');

async function runCommentTests() {
    console.log('🧪 Running Comment Tests Only');
    console.log('============================');
    
    const tests = new CommentTests();
    const results = await tests.runAllTests();
    
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    
    console.log(`\n📊 Comment Tests Results:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
        console.log('\n❌ Failed Tests:');
        results.filter(r => !r.passed).forEach(result => {
            console.log(`   • ${result.name}: ${result.error}`);
        });
    }
    
    return { passed, failed, results };
}

runCommentTests();
