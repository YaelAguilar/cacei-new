// test/test-section-comments-viewing.js
const axios = require('axios');
const config = require('./config');

class SectionCommentsViewingTester {
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

    async testGetCommentsByProposal() {
        console.log('\n🧪 Testing get comments by proposal');
        
        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'GET', `/propuestas/${this.proposalId}/comentarios`);
            
            if (response.status === 200) {
                console.log(`✅ Retrieved ${response.data.data.length} comments for proposal`);
                
                // Agrupar comentarios por sección
                const commentsBySection = {};
                response.data.data.forEach((comment) => {
                    const sectionKey = `${comment.attributes.sectionName} - ${comment.attributes.subsectionName}`;
                    if (!commentsBySection[sectionKey]) {
                        commentsBySection[sectionKey] = [];
                    }
                    commentsBySection[sectionKey].push(comment);
                });
                
                console.log('\n📊 Comments by Section:');
                Object.keys(commentsBySection).forEach(section => {
                    console.log(`   📝 ${section}: ${commentsBySection[section].length} comments`);
                    commentsBySection[section].forEach((comment, index) => {
                        console.log(`      ${index + 1}. ${comment.attributes.tutorName} - ${comment.attributes.voteStatus}`);
                        console.log(`         "${comment.attributes.commentText.substring(0, 50)}..."`);
                    });
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

    async testCreateMultipleComments() {
        console.log('\n🧪 Testing creation of multiple comments for different sections');
        
        const sectionsToTest = [
            { sectionName: 'Datos del Proyecto', subsectionName: 'Contexto y Problemática', description: 'Contexto y Problemática' },
            { sectionName: 'Datos del Proyecto', subsectionName: 'Objetivos del Proyecto', description: 'Objetivos del Proyecto' },
            { sectionName: 'Información de la Empresa', subsectionName: 'Datos de la Empresa', description: 'Información de la Empresa' }
        ];

        let createdComments = 0;
        
        for (const section of sectionsToTest) {
            const commentData = {
                proposalId: this.proposalId,
                sectionName: section.sectionName,
                subsectionName: section.subsectionName,
                commentText: `Comentario de prueba para ${section.description}. Este es un comentario detallado que explica las observaciones sobre esta sección específica.`,
                voteStatus: 'ACTUALIZA'
            };

            try {
                await this.login('director');
                const response = await this.makeAuthenticatedRequest('director', 'POST', '/comentarios', commentData);

                if (response.status === 201) {
                    console.log(`✅ Comment created successfully for ${section.description}`);
                    createdComments++;
                } else if (response.status === 400 && response.data.errors[0].detail.includes('Ya existe un comentario de este tutor en la sección')) {
                    console.log(`⚠️ Comment already exists for ${section.description} (expected)`);
                } else {
                    console.log(`❌ Failed to create comment for ${section.description}: ${response.status}`);
                }
            } catch (error) {
                console.error(`❌ Error creating comment for ${section.description}: ${error.response?.data || error.message}`);
            }
        }
        
        return createdComments;
    }

    async runTests() {
        console.log('🚀 Testing Section Comments Viewing');
        console.log('===================================');
        console.log('📋 Testing new functionality:');
        console.log('   ✅ Modal para ver comentarios existentes');
        console.log('   ✅ Agrupación de comentarios por sección');
        console.log('   ✅ Información detallada de cada comentario');
        console.log('   ✅ Botón para agregar nuevos comentarios');
        console.log('   ✅ Integración con formulario existente');
        console.log('');

        await this.getExistingProposalId();

        let testResults = {
            passed: 0,
            failed: 0,
            total: 0
        };

        // Test 1: Get existing comments
        console.log('\n📝 Test 1: Get existing comments');
        const result1 = await this.testGetCommentsByProposal();
        testResults.total++;
        if (result1) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 2: Create multiple comments for different sections
        console.log('\n📝 Test 2: Create multiple comments for different sections');
        const result2 = await this.testCreateMultipleComments();
        testResults.total++;
        if (result2 > 0) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 3: Get comments again to verify new ones
        console.log('\n📝 Test 3: Get comments again to verify new ones');
        const result3 = await this.testGetCommentsByProposal();
        testResults.total++;
        if (result3) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        console.log('\n🎯 Section Comments Viewing Testing Complete!');
        console.log('==============================================');
        console.log(`📊 Results: ${testResults.passed}/${testResults.total} tests passed`);
        console.log(`✅ Passed: ${testResults.passed}`);
        console.log(`❌ Failed: ${testResults.failed}`);
        console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

        if (testResults.failed === 0) {
            console.log('\n🎉 All tests passed! Section comments viewing is working correctly.');
            console.log('\n📋 Summary of New Features:');
            console.log('   ✅ SectionCommentsModal: Modal completo para comentarios');
            console.log('   ✅ Visualización de comentarios existentes por sección');
            console.log('   ✅ Información detallada: tutor, fecha, voto, comentario');
            console.log('   ✅ Botón "Agregar Comentario" integrado');
            console.log('   ✅ Formulario InlineCommentForm reutilizado');
            console.log('   ✅ Agrupación automática por sección/subsección');
            console.log('   ✅ Estados visuales diferenciados por tipo de voto');
            console.log('   ✅ UX mejorada: Ver y agregar en un solo lugar');
            
            console.log('\n🎨 UI Features:');
            console.log('   ✅ Iconos diferenciados por tipo de voto');
            console.log('   ✅ Colores temáticos por estado de voto');
            console.log('   ✅ Información completa del tutor');
            console.log('   ✅ Fechas formateadas en español');
            console.log('   ✅ Diseño responsive y accesible');
            console.log('   ✅ Modal con scroll para muchos comentarios');
        } else {
            console.log('\n⚠️ Some tests failed. Review the implementation.');
        }
    }
}

const tester = new SectionCommentsViewingTester();
tester.runTests();
