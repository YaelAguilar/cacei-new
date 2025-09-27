// test/test-tutor-final-vote-endpoint.js
const axios = require('axios');
const config = require('./config');

class TutorFinalVoteEndpointTester {
    constructor() {
        this.apiClient = axios.create({
            baseURL: config.apiBaseUrl,
            withCredentials: true,
            timeout: config.timeouts.medium
        });
        this.authCookies = {};
        this.proposalId = null;
    }

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
                this.authCookies[userType] = response.headers['set-cookie'] || [];
                return response.data;
            }
            throw new Error('Login failed: Invalid response');
        } catch (error) {
            console.error(`Login failed for ${userType}:`, error.response?.data || error.message);
            throw error;
        }
    }

    async makeAuthenticatedRequest(userType, method, endpoint, data = null) {
        if (!this.authCookies[userType]) {
            await this.login(userType);
        }
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': this.authCookies[userType].join('; ')
        };
        try {
            switch (method.toLowerCase()) {
                case 'get':
                    return await this.apiClient.get(endpoint, { headers });
                case 'post':
                    return await this.apiClient.post(endpoint, data, { headers });
                case 'put':
                    return await this.apiClient.put(endpoint, data, { headers });
                case 'patch':
                    return await this.apiClient.patch(endpoint, data, { headers });
                case 'delete':
                    return await this.apiClient.delete(endpoint, { headers });
                default:
                    throw new Error(`Unsupported HTTP method: ${method}`);
            }
        } catch (error) {
            return error.response || error;
        }
    }

    async getExistingProposalId() {
        try {
            await this.login('alumno');
            const response = await this.makeAuthenticatedRequest('alumno', 'GET', '/propuestas/mis-propuestas');
            if (response.status === 200 && response.data.data && response.data.data.length > 0) {
                this.proposalId = response.data.data[0].id;
                console.log(`📋 Using existing proposal: ${this.proposalId}`);
                return this.proposalId;
            }
        } catch (error) {
            console.error('Error getting existing proposal:', error.message);
        }
        throw new Error('No existing proposal found for testing');
    }

    async testTutorFinalVoteEndpoint() {
        console.log('\n🧪 Testing tutor final vote endpoint');
        
        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'GET', `/propuestas/${this.proposalId}/tutor-voto-final`);
            
            if (response.status === 200) {
                console.log('✅ Tutor final vote endpoint working!');
                console.log('Response:', JSON.stringify(response.data, null, 2));
                
                if (response.data.success) {
                    if (response.data.data.hasVoted) {
                        console.log(`   ✅ Tutor has voted: ${response.data.data.voteStatus}`);
                        console.log(`   📝 Comment: ${response.data.data.commentText}`);
                        console.log(`   👤 Tutor: ${response.data.data.tutorName}`);
                    } else {
                        console.log('   ℹ️ Tutor has not voted with final vote yet');
                    }
                }
                return response.data;
            } else {
                console.log(`❌ Failed to get tutor final vote: ${response.status}`);
                console.log('Response:', response.data);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error getting tutor final vote: ${error.response?.data || error.message}`);
            return null;
        }
    }

    async testWithDifferentTutor() {
        console.log('\n🧪 Testing with different tutor (director)');
        
        try {
            await this.login('director');
            const response = await this.makeAuthenticatedRequest('director', 'GET', `/propuestas/${this.proposalId}/tutor-voto-final`);
            
            if (response.status === 200) {
                console.log('✅ Director can also check final vote!');
                console.log('Response:', JSON.stringify(response.data, null, 2));
                return response.data;
            } else {
                console.log(`❌ Failed to get tutor final vote for director: ${response.status}`);
                console.log('Response:', response.data);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error getting tutor final vote for director: ${error.response?.data || error.message}`);
            return null;
        }
    }

    async runTests() {
        console.log('🚀 Testing Tutor Final Vote Endpoint');
        console.log('=====================================');
        console.log('📋 Testing the new endpoint: GET /propuestas/:proposalId/tutor-voto-final');
        console.log('');

        await this.getExistingProposalId();

        let testResults = {
            passed: 0,
            failed: 0,
            total: 0
        };

        // Test 1: Check tutor final vote with PTC
        console.log('\n📝 Test 1: Check tutor final vote with PTC');
        const result1 = await this.testTutorFinalVoteEndpoint();
        testResults.total++;
        if (result1) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 2: Check tutor final vote with Director
        console.log('\n📝 Test 2: Check tutor final vote with Director');
        const result2 = await this.testWithDifferentTutor();
        testResults.total++;
        if (result2) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        console.log('\n🎯 Tutor Final Vote Endpoint Testing Complete!');
        console.log('==============================================');
        console.log(`📊 Results: ${testResults.passed}/${testResults.total} tests passed`);
        console.log(`✅ Passed: ${testResults.passed}`);
        console.log(`❌ Failed: ${testResults.failed}`);
        console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

        if (testResults.failed === 0) {
            console.log('\n🎉 All tests passed! Tutor final vote endpoint is working correctly.');
        } else {
            console.log('\n⚠️ Some tests failed. Review the implementation.');
        }
    }
}

const tester = new TutorFinalVoteEndpointTester();
tester.runTests();
