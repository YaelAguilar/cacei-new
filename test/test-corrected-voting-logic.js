// test/test-corrected-voting-logic.js
const axios = require('axios');
const config = require('./config');

class CorrectedVotingLogicTester {
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

    async testSectionCommentWithACTUALIZA(sectionName, subsectionName, commentText) {
        console.log(`\n🧪 Testing ACTUALIZA comment in section: ${sectionName} - ${subsectionName}`);
        
        const commentData = {
            proposalId: this.proposalId,
            sectionName,
            subsectionName,
            commentText,
            voteStatus: 'ACTUALIZA'  // ✅ CORRECTO: Solo ACTUALIZA para secciones
        };

        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'POST', '/comentarios', commentData);

            if (response.status === 201) {
                console.log(`✅ ACTUALIZA comment created successfully in ${sectionName} - ${subsectionName}`);
                console.log(`   Comment: ${commentText}`);
                return response.data;
            } else if (response.status === 400 && response.data.errors[0].detail.includes('Ya existe un comentario de este tutor en la sección')) {
                console.log(`⚠️ Comment already exists in ${sectionName} - ${subsectionName} (expected)`);
                return null;
            } else {
                console.log(`❌ Failed to create ACTUALIZA comment: ${response.status}`);
                console.log('Response:', response.data);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error creating ACTUALIZA comment: ${error.response?.data || error.message}`);
            return null;
        }
    }

    async testSectionCommentWithACEPTADO(sectionName, subsectionName, commentText) {
        console.log(`\n🧪 Testing ACEPTADO comment in section (should FAIL): ${sectionName} - ${subsectionName}`);
        
        const commentData = {
            proposalId: this.proposalId,
            sectionName,
            subsectionName,
            commentText,
            voteStatus: 'ACEPTADO'  // ❌ INCORRECTO: ACEPTADO no debe permitirse por sección
        };

        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'POST', '/comentarios', commentData);

            if (response.status === 400) {
                console.log(`✅ CORRECTLY REJECTED: ACEPTADO vote not allowed for individual sections`);
                console.log(`   Error: ${response.data.errors[0].detail}`);
                return true; // Expected failure
            } else {
                console.log(`❌ UNEXPECTED SUCCESS: ACEPTADO vote was allowed for individual section`);
                console.log('Response:', response.data);
                return false;
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log(`✅ CORRECTLY REJECTED: ACEPTADO vote not allowed for individual sections`);
                console.log(`   Error: ${error.response.data.errors[0].detail}`);
                return true; // Expected failure
            } else {
                console.error(`❌ Unexpected error: ${error.response?.data || error.message}`);
                return false;
            }
        }
    }

    async testSectionCommentWithRECHAZADO(sectionName, subsectionName, commentText) {
        console.log(`\n🧪 Testing RECHAZADO comment in section (should FAIL): ${sectionName} - ${subsectionName}`);
        
        const commentData = {
            proposalId: this.proposalId,
            sectionName,
            subsectionName,
            commentText,
            voteStatus: 'RECHAZADO'  // ❌ INCORRECTO: RECHAZADO no debe permitirse por sección
        };

        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'POST', '/comentarios', commentData);

            if (response.status === 400) {
                console.log(`✅ CORRECTLY REJECTED: RECHAZADO vote not allowed for individual sections`);
                console.log(`   Error: ${response.data.errors[0].detail}`);
                return true; // Expected failure
            } else {
                console.log(`❌ UNEXPECTED SUCCESS: RECHAZADO vote was allowed for individual section`);
                console.log('Response:', response.data);
                return false;
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log(`✅ CORRECTLY REJECTED: RECHAZADO vote not allowed for individual sections`);
                console.log(`   Error: ${error.response.data.errors[0].detail}`);
                return true; // Expected failure
            } else {
                console.error(`❌ Unexpected error: ${error.response?.data || error.message}`);
                return false;
            }
        }
    }

    async testApproveEntireProposal() {
        console.log('\n🧪 Testing approve entire proposal (should SUCCEED)');
        
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

    async testRejectEntireProposal() {
        console.log('\n🧪 Testing reject entire proposal (should SUCCEED)');
        
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

    async testGetCommentsByProposal() {
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
        console.log('🚀 Testing Corrected Voting Logic');
        console.log('===================================');
        console.log('📋 Rules:');
        console.log('   ✅ ACEPTADO/RECHAZADO: Only for entire proposal');
        console.log('   ✅ ACTUALIZA: Only for specific sections (with mandatory comment)');
        console.log('   ❌ ACEPTADO/RECHAZADO: NOT allowed for individual sections');
        console.log('');

        await this.getExistingProposalId();

        let testResults = {
            passed: 0,
            failed: 0,
            total: 0
        };

        // Test 1: ACTUALIZA comments in sections (should succeed)
        console.log('\n📝 Test 1: ACTUALIZA comments in sections');
        const sectionsToTest = [
            { section: 'Información de la Empresa', subsection: 'Nombre Legal', comment: 'El nombre legal necesita ser más específico y completo.' },
            { section: 'Información de Contacto', subsection: 'Nombre de Contacto', comment: 'La información de contacto requiere validación adicional.' },
            { section: 'Supervisor del Proyecto', subsection: 'Nombre del Supervisor', comment: 'El supervisor debe tener más experiencia en el área.' },
            { section: 'Datos del Proyecto', subsection: 'Objetivos Específicos', comment: 'Los objetivos específicos necesitan ser más medibles y alcanzables.' }
        ];

        for (const s of sectionsToTest) {
            const result = await this.testSectionCommentWithACTUALIZA(s.section, s.subsection, s.comment);
            testResults.total++;
            if (result) {
                testResults.passed++;
            } else {
                testResults.failed++;
            }
        }

        // Test 2: ACEPTADO comments in sections (should fail)
        console.log('\n📝 Test 2: ACEPTADO comments in sections (should fail)');
        const result1 = await this.testSectionCommentWithACEPTADO('Datos del Proyecto', 'Objetivo General', 'El objetivo está bien definido.');
        testResults.total++;
        if (result1) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 3: RECHAZADO comments in sections (should fail)
        console.log('\n📝 Test 3: RECHAZADO comments in sections (should fail)');
        const result2 = await this.testSectionCommentWithRECHAZADO('Datos del Proyecto', 'Objetivo General', 'El objetivo no es adecuado.');
        testResults.total++;
        if (result2) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 4: Get comments
        await this.testGetCommentsByProposal();

        // Test 5: Approve entire proposal (should succeed)
        console.log('\n📝 Test 4: Approve entire proposal');
        const approveResult = await this.testApproveEntireProposal();
        testResults.total++;
        if (approveResult) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 6: Reject entire proposal (should succeed)
        console.log('\n📝 Test 5: Reject entire proposal');
        const rejectResult = await this.testRejectEntireProposal();
        testResults.total++;
        if (rejectResult) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        console.log('\n🎯 Corrected Voting Logic Testing Complete!');
        console.log('==========================================');
        console.log(`📊 Results: ${testResults.passed}/${testResults.total} tests passed`);
        console.log(`✅ Passed: ${testResults.passed}`);
        console.log(`❌ Failed: ${testResults.failed}`);
        console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

        if (testResults.failed === 0) {
            console.log('\n🎉 All tests passed! Voting logic is correctly implemented.');
        } else {
            console.log('\n⚠️ Some tests failed. Review the implementation.');
        }
    }
}

const tester = new CorrectedVotingLogicTester();
tester.runTests();
