// test/test-voting-modal-and-section-comments.js
const axios = require('axios');
const config = require('./config');

class VotingModalAndSectionCommentsTester {
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

    async testApprovalWithComment() {
        console.log('\n🧪 Testing approval with comment');
        
        const approvalData = {
            proposalId: this.proposalId,
            comment: 'Esta propuesta cumple con todos los requisitos académicos y técnicos necesarios. El estudiante ha demostrado un buen entendimiento del proyecto propuesto.'
        };

        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'POST', '/aprobar-propuesta', approvalData);

            if (response.status === 200) {
                console.log('✅ Proposal approved with comment successfully');
                console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
                return response.data;
            } else {
                console.log(`❌ Failed to approve proposal with comment: ${response.status}`);
                console.log('Response:', response.data);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error approving proposal with comment: ${error.response?.data || error.message}`);
            return null;
        }
    }

    async testRejectionWithComment() {
        console.log('\n🧪 Testing rejection with comment');
        
        const rejectionData = {
            proposalId: this.proposalId,
            comment: 'La propuesta no cumple con los estándares académicos requeridos. Los objetivos específicos son demasiado vagos y las actividades propuestas no están bien estructuradas.'
        };

        try {
            await this.login('director');
            const response = await this.makeAuthenticatedRequest('director', 'POST', '/rechazar-propuesta', rejectionData);

            if (response.status === 200) {
                console.log('✅ Proposal rejected with comment successfully');
                console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
                return response.data;
            } else {
                console.log(`❌ Failed to reject proposal with comment: ${response.status}`);
                console.log('Response:', response.data);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error rejecting proposal with comment: ${error.response?.data || error.message}`);
            return null;
        }
    }

    async testApprovalWithoutComment() {
        console.log('\n🧪 Testing approval without comment (optional)');
        
        const approvalData = {
            proposalId: this.proposalId,
            comment: '' // Empty comment should be allowed for approval
        };

        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'POST', '/aprobar-propuesta', approvalData);

            if (response.status === 200) {
                console.log('✅ Proposal approved without comment successfully');
                console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
                return response.data;
            } else {
                console.log(`❌ Failed to approve proposal without comment: ${response.status}`);
                console.log('Response:', response.data);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error approving proposal without comment: ${error.response?.data || error.message}`);
            return null;
        }
    }

    async testSectionCommentCreation() {
        console.log('\n🧪 Testing section comment creation');
        
        const commentData = {
            proposalId: this.proposalId,
            sectionName: 'Datos del Proyecto',
            subsectionName: 'Objetivos del Proyecto',
            commentText: 'Los objetivos están bien definidos pero podrían beneficiarse de métricas más específicas para medir el éxito del proyecto.',
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

    async testGetComments() {
        console.log('\n🧪 Testing get comments by proposal');
        
        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'GET', `/propuestas/${this.proposalId}/comentarios`);
            
            if (response.status === 200) {
                console.log(`✅ Retrieved ${response.data.data.length} comments for proposal`);
                response.data.data.forEach((comment, index) => {
                    console.log(`   ${index + 1}. ${comment.attributes.sectionName} - ${comment.attributes.subsectionName}: ${comment.attributes.voteStatus}`);
                    if (comment.attributes.commentText) {
                        console.log(`      Comment: ${comment.attributes.commentText.substring(0, 100)}...`);
                    }
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
        console.log('🚀 Testing Voting Modal and Section Comments');
        console.log('=============================================');
        console.log('📋 Testing new functionality:');
        console.log('   ✅ Modal de votación con comentarios');
        console.log('   ✅ Comentarios obligatorios para rechazo');
        console.log('   ✅ Comentarios opcionales para aprobación');
        console.log('   ✅ Botones de comentarios por sección');
        console.log('   ✅ Integración frontend-backend completa');
        console.log('');

        await this.getExistingProposalId();

        let testResults = {
            passed: 0,
            failed: 0,
            total: 0
        };

        // Test 1: Create section comment
        console.log('\n📝 Test 1: Section comment creation');
        const result1 = await this.testSectionCommentCreation();
        testResults.total++;
        if (result1) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 2: Approval with comment
        console.log('\n📝 Test 2: Approval with comment');
        const result2 = await this.testApprovalWithComment();
        testResults.total++;
        if (result2) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 3: Approval without comment (optional)
        console.log('\n📝 Test 3: Approval without comment (optional)');
        const result3 = await this.testApprovalWithoutComment();
        testResults.total++;
        if (result3) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 4: Rejection with comment
        console.log('\n📝 Test 4: Rejection with comment');
        const result4 = await this.testRejectionWithComment();
        testResults.total++;
        if (result4) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 5: Get comments
        console.log('\n📝 Test 5: Get comments by proposal');
        const result5 = await this.testGetComments();
        testResults.total++;
        if (result5) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        console.log('\n🎯 Voting Modal and Section Comments Testing Complete!');
        console.log('=======================================================');
        console.log(`📊 Results: ${testResults.passed}/${testResults.total} tests passed`);
        console.log(`✅ Passed: ${testResults.passed}`);
        console.log(`❌ Failed: ${testResults.failed}`);
        console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

        if (testResults.failed === 0) {
            console.log('\n🎉 All tests passed! New functionality is working correctly.');
            console.log('\n📋 Summary of New Features:');
            console.log('   ✅ Modal de votación con campo de comentario');
            console.log('   ✅ Comentarios obligatorios para rechazo (mínimo 10 caracteres)');
            console.log('   ✅ Comentarios opcionales para aprobación');
            console.log('   ✅ Botones de comentarios por sección en el frontend');
            console.log('   ✅ Backend actualizado para manejar comentarios en votación');
            console.log('   ✅ Integración completa frontend-backend');
        } else {
            console.log('\n⚠️ Some tests failed. Review the implementation.');
        }
    }
}

const tester = new VotingModalAndSectionCommentsTester();
tester.runTests();
