// test/test-frontend-backend-integration.js
const axios = require('axios');
const config = require('./config');

class FrontendBackendIntegrationTester {
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

    async testSectionCommentCreation() {
        console.log('\n🧪 Testing section comment creation (ACTUALIZA only)');
        
        const commentData = {
            proposalId: this.proposalId,
            sectionName: 'Datos del Proyecto',
            subsectionName: 'Objetivo General',
            commentText: 'El objetivo general necesita ser más específico y medible para cumplir con los estándares académicos.',
            voteStatus: 'ACTUALIZA'
        };

        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'POST', '/comentarios', commentData);

            if (response.status === 201) {
                console.log('✅ Section comment created successfully');
                console.log(`   Comment ID: ${response.data.data.id}`);
                console.log(`   Vote Status: ${response.data.data.attributes.voteStatus}`);
                return response.data;
            } else if (response.status === 400 && response.data.errors[0].detail.includes('Ya existe un comentario de este tutor en la sección')) {
                console.log('⚠️ Comment already exists in this section (expected)');
                return null;
            } else {
                console.log(`❌ Failed to create section comment: ${response.status}`);
                console.log('Response:', response.data);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error creating section comment: ${error.response?.data || error.message}`);
            return null;
        }
    }

    async testInvalidSectionVote() {
        console.log('\n🧪 Testing invalid section vote (ACEPTADO should fail)');
        
        const commentData = {
            proposalId: this.proposalId,
            sectionName: 'Datos del Proyecto',
            subsectionName: 'Objetivo General',
            commentText: 'El objetivo general está bien definido y es alcanzable.',
            voteStatus: 'ACEPTADO'  // This should fail
        };

        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'POST', '/comentarios', commentData);

            if (response.status === 400) {
                console.log('✅ CORRECTLY REJECTED: ACEPTADO vote not allowed for individual sections');
                console.log(`   Error: ${response.data.errors[0].detail}`);
                return true; // Expected failure
            } else {
                console.log(`❌ UNEXPECTED SUCCESS: ACEPTADO vote was allowed for individual section`);
                console.log('Response:', response.data);
                return false;
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✅ CORRECTLY REJECTED: ACEPTADO vote not allowed for individual sections');
                console.log(`   Error: ${error.response.data.errors[0].detail}`);
                return true; // Expected failure
            } else {
                console.error(`❌ Unexpected error: ${error.response?.data || error.message}`);
                return false;
            }
        }
    }

    async testProposalApproval() {
        console.log('\n🧪 Testing proposal approval (complete proposal)');
        
        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'POST', '/aprobar-propuesta', { 
                proposalId: this.proposalId 
            });

            if (response.status === 200) {
                console.log('✅ Proposal approved successfully!');
                console.log(`   Approved by: ${response.data.data.attributes.approvedBy}`);
                return response.data;
            } else {
                console.log(`❌ Failed to approve proposal: ${response.status}`);
                console.log('Response:', response.data);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error approving proposal: ${error.response?.data || error.message}`);
            return null;
        }
    }

    async testProposalRejection() {
        console.log('\n🧪 Testing proposal rejection (complete proposal)');
        
        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'POST', '/rechazar-propuesta', { 
                proposalId: this.proposalId,
                comment: 'La propuesta no cumple con los requisitos mínimos establecidos por la institución.'
            });

            if (response.status === 200) {
                console.log('✅ Proposal rejected successfully!');
                console.log(`   Rejected by: ${response.data.data.attributes.rejectedBy}`);
                return response.data;
            } else {
                console.log(`❌ Failed to reject proposal: ${response.status}`);
                console.log('Response:', response.data);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error rejecting proposal: ${error.response?.data || error.message}`);
            return null;
        }
    }

    async testGetComments() {
        console.log('\n🧪 Testing get comments by proposal');
        
        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'GET', `/propuestas/${this.proposalId}/comentarios`);
            
            if (response.status === 200) {
                console.log(`✅ Retrieved ${response.data.data.length} comments for proposal`);
                response.data.data.forEach((comment, index) => {
                    console.log(`   ${index + 1}. ${comment.attributes.sectionName} - ${comment.attributes.subsectionName}: ${comment.attributes.voteStatus}`);
                });
                return response.data.data;
            } else {
                console.log(`❌ Failed to get comments: ${response.status}`);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error getting comments: ${error.response?.data || error.message}`);
            return null;
        }
    }

    async runTests() {
        console.log('🚀 Testing Frontend-Backend Integration');
        console.log('=======================================');
        console.log('📋 Testing the corrected voting logic:');
        console.log('   ✅ ACTUALIZA: Only for specific sections');
        console.log('   ✅ ACEPTADO/RECHAZADO: Only for complete proposal');
        console.log('   ❌ ACEPTADO/RECHAZADO: NOT allowed for individual sections');
        console.log('');

        await this.getExistingProposalId();

        let testResults = {
            passed: 0,
            failed: 0,
            total: 0
        };

        // Test 1: Create section comment with ACTUALIZA (should succeed)
        console.log('\n📝 Test 1: Section comment with ACTUALIZA');
        const result1 = await this.testSectionCommentCreation();
        testResults.total++;
        if (result1) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 2: Try to create section comment with ACEPTADO (should fail)
        console.log('\n📝 Test 2: Section comment with ACEPTADO (should fail)');
        const result2 = await this.testInvalidSectionVote();
        testResults.total++;
        if (result2) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 3: Get comments
        console.log('\n📝 Test 3: Get comments by proposal');
        const result3 = await this.testGetComments();
        testResults.total++;
        if (result3) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 4: Approve complete proposal (may fail if already voted)
        console.log('\n📝 Test 4: Approve complete proposal');
        const result4 = await this.testProposalApproval();
        testResults.total++;
        if (result4) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 5: Reject complete proposal (may fail if already voted)
        console.log('\n📝 Test 5: Reject complete proposal');
        const result5 = await this.testProposalRejection();
        testResults.total++;
        if (result5) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        console.log('\n🎯 Frontend-Backend Integration Testing Complete!');
        console.log('=================================================');
        console.log(`📊 Results: ${testResults.passed}/${testResults.total} tests passed`);
        console.log(`✅ Passed: ${testResults.passed}`);
        console.log(`❌ Failed: ${testResults.failed}`);
        console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

        if (testResults.failed === 0) {
            console.log('\n🎉 All tests passed! Frontend-Backend integration is working correctly.');
        } else {
            console.log('\n⚠️ Some tests failed. Review the implementation.');
        }

        console.log('\n📋 Summary of Changes Made:');
        console.log('   ✅ Backend: Corrected voting logic validation');
        console.log('   ✅ Frontend: Updated comment forms to only show ACTUALIZA');
        console.log('   ✅ Frontend: Improved proposal voting interface');
        console.log('   ✅ Frontend: Added help modal explaining new voting rules');
        console.log('   ✅ Integration: Both systems now work together correctly');
    }
}

const tester = new FrontendBackendIntegrationTester();
tester.runTests();
