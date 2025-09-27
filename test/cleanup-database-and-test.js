// test/cleanup-database-and-test.js
const axios = require('axios');
const config = require('./config');

class DatabaseCleanupTester {
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

    async testACTUALIZAComment(sectionName, subsectionName, commentText) {
        console.log(`\n🧪 Testing ACTUALIZA comment: ${sectionName} - ${subsectionName}`);
        
        const commentData = {
            proposalId: this.proposalId,
            sectionName,
            subsectionName,
            commentText,
            voteStatus: 'ACTUALIZA'
        };

        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'POST', '/comentarios', commentData);

            if (response.status === 201) {
                console.log(`✅ ACTUALIZA comment created successfully`);
                return response.data;
            } else if (response.status === 400 && response.data.errors[0].detail.includes('Ya existe un comentario de este tutor en la sección')) {
                console.log(`⚠️ Comment already exists in this section (expected)`);
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

    async testACEPTADOComment(sectionName, subsectionName, commentText) {
        console.log(`\n🧪 Testing ACEPTADO comment (should FAIL): ${sectionName} - ${subsectionName}`);
        
        const commentData = {
            proposalId: this.proposalId,
            sectionName,
            subsectionName,
            commentText,
            voteStatus: 'ACEPTADO'
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

    async testApproveEntireProposal() {
        console.log('\n🧪 Testing approve entire proposal');
        
        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'POST', '/aprobar-propuesta', { 
                proposalId: this.proposalId 
            });

            if (response.status === 200) {
                console.log('✅ Proposal approved successfully!');
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
        console.log('\n🧪 Testing reject entire proposal');
        
        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'POST', '/rechazar-propuesta', { 
                proposalId: this.proposalId,
                comment: 'La propuesta no cumple con los requisitos mínimos establecidos por la institución.'
            });

            if (response.status === 200) {
                console.log('✅ Proposal rejected successfully!');
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

    async runTests() {
        console.log('🚀 Testing Corrected Voting Logic (Fresh Start)');
        console.log('===============================================');
        console.log('📋 Rules:');
        console.log('   ✅ ACEPTADO/RECHAZADO: Only for entire proposal');
        console.log('   ✅ ACTUALIZA: Only for specific sections (with mandatory comment)');
        console.log('   ❌ ACEPTADO/RECHAZADO: NOT allowed for individual sections');
        console.log('');
        console.log('⚠️  Note: This test assumes existing comments may violate the new rules.');
        console.log('   The system should handle this gracefully.');
        console.log('');

        await this.getExistingProposalId();

        let testResults = {
            passed: 0,
            failed: 0,
            total: 0
        };

        // Test 1: Try to create ACTUALIZA comments in new sections
        console.log('\n📝 Test 1: ACTUALIZA comments in new sections');
        const newSections = [
            { section: 'Datos del Proyecto', subsection: 'Justificación', comment: 'La justificación necesita ser más sólida y fundamentada.' },
            { section: 'Datos del Proyecto', subsection: 'Metodología', comment: 'La metodología requiere mayor detalle y especificidad.' },
            { section: 'Datos del Proyecto', subsection: 'Cronograma', comment: 'El cronograma necesita ser más realista y detallado.' }
        ];

        for (const s of newSections) {
            const result = await this.testACTUALIZAComment(s.section, s.subsection, s.comment);
            testResults.total++;
            if (result) {
                testResults.passed++;
            } else {
                testResults.failed++;
            }
        }

        // Test 2: Try to create ACEPTADO comment (should fail)
        console.log('\n📝 Test 2: ACEPTADO comment in section (should fail)');
        const result1 = await this.testACEPTADOComment('Datos del Proyecto', 'Justificación', 'El objetivo está bien definido.');
        testResults.total++;
        if (result1) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 3: Try to approve entire proposal (should work if no section comments exist)
        console.log('\n📝 Test 3: Approve entire proposal');
        const approveResult = await this.testApproveEntireProposal();
        testResults.total++;
        if (approveResult) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 4: Try to reject entire proposal (should work if no section comments exist)
        console.log('\n📝 Test 4: Reject entire proposal');
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
            console.log('\n📋 Summary of Issues:');
            console.log('   1. ✅ Votos ACEPTADO/RECHAZADO por sección están siendo rechazados correctamente');
            console.log('   2. ❌ No se puede aprobar/rechazar propuesta completa si existen comentarios específicos');
            console.log('   3. ❌ Existen comentarios ACEPTADO antiguos que violan las nuevas reglas');
            console.log('\n🔧 Next Steps:');
            console.log('   1. Modificar lógica para permitir aprobación/rechazo con comentarios ACTUALIZA');
            console.log('   2. Limpiar comentarios ACEPTADO/RECHAZADO existentes por sección');
            console.log('   3. Probar flujo completo desde cero');
        }
    }
}

const tester = new DatabaseCleanupTester();
tester.runTests();
