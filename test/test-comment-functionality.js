// Test comment functionality with different sections
const axios = require('axios');
const config = require('./config');

class CommentFunctionalityTest {
    constructor() {
        this.apiClient = axios.create({
            baseURL: config.apiBaseUrl,
            withCredentials: true,
            timeout: 10000
        });
        this.authTokens = new Map();
        this.proposalId = null;
    }

    async login(userType) {
        const user = config.users[userType];
        try {
            const response = await this.apiClient.post('/auth/signin', {
                email: user.email,
                password: user.password
            });
            
            if (response.status === 200) {
                this.authTokens.set(userType, {
                    user: response.data,
                    cookies: response.headers['set-cookie'] || []
                });
                return response.data;
            }
        } catch (error) {
            console.error(`Login failed for ${userType}:`, error.response?.data || error.message);
            throw error;
        }
    }

    async makeAuthenticatedRequest(userType, method, endpoint, data = null) {
        const authData = this.authTokens.get(userType);
        if (!authData) {
            throw new Error(`User ${userType} not authenticated`);
        }

        const requestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': authData.cookies.join('; ')
            }
        };

        try {
            switch (method.toLowerCase()) {
                case 'get':
                    return await this.apiClient.get(endpoint, requestConfig);
                case 'post':
                    return await this.apiClient.post(endpoint, data, requestConfig);
                case 'patch':
                    return await this.apiClient.patch(endpoint, data, requestConfig);
                default:
                    throw new Error(`Unsupported HTTP method: ${method}`);
            }
        } catch (error) {
            throw error;
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
            console.error('Error getting existing proposal:', error.response?.data || error.message);
        }
        
        throw new Error('No existing proposal found for testing');
    }

    async testCreateCommentInDifferentSection(sectionName, subsectionName, voteStatus, commentText) {
        console.log(`\n🧪 Testing comment creation in section: ${sectionName} - ${subsectionName}`);
        
        try {
            await this.login('ptc');
            
            const commentData = {
                proposalId: this.proposalId,
                sectionName: sectionName,
                subsectionName: subsectionName,
                commentText: commentText,
                voteStatus: voteStatus
            };
            
            const response = await this.makeAuthenticatedRequest('ptc', 'POST', '/comentarios', commentData);
            
            if (response.status === 201) {
                console.log(`✅ Comment created successfully in ${sectionName} - ${subsectionName}`);
                console.log(`   Vote: ${voteStatus}`);
                console.log(`   Comment: ${commentText}`);
                return response.data.data.id;
            } else {
                console.log(`❌ Failed to create comment: ${response.status}`);
                console.log(`   Response: ${JSON.stringify(response.data)}`);
                return null;
            }
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.errors?.[0]?.detail?.includes('Ya existe un comentario')) {
                console.log(`⚠️ Comment already exists in ${sectionName} - ${subsectionName} (expected)`);
                return 'exists';
            } else {
                console.error(`❌ Error creating comment: ${error.response?.data || error.message}`);
                return null;
            }
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

    async testApproveProposal() {
        console.log('\n🧪 Testing approve proposal completely');
        
        try {
            await this.login('ptc');
            
            const approveData = {
                proposalId: this.proposalId,
                commentText: 'Propuesta aprobada completamente. Todos los aspectos están bien definidos.',
                voteStatus: 'ACEPTADO'
            };
            
            const response = await this.makeAuthenticatedRequest('ptc', 'POST', '/aprobar-propuesta', approveData);
            
            if (response.status === 200) {
                console.log('✅ Proposal approved successfully');
                return response.data;
            } else {
                console.log(`❌ Failed to approve proposal: ${response.status}`);
                console.log(`   Response: ${JSON.stringify(response.data)}`);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error approving proposal: ${error.response?.data || error.message}`);
            return null;
        }
    }

    async testRejectProposal() {
        console.log('\n🧪 Testing reject proposal completely');
        
        try {
            await this.login('ptc');
            
            const rejectData = {
                proposalId: this.proposalId,
                commentText: 'Propuesta rechazada. Se requieren mejoras significativas en varios aspectos.',
                voteStatus: 'RECHAZADO'
            };
            
            const response = await this.makeAuthenticatedRequest('ptc', 'POST', '/rechazar-propuesta', rejectData);
            
            if (response.status === 200) {
                console.log('✅ Proposal rejected successfully');
                return response.data;
            } else {
                console.log(`❌ Failed to reject proposal: ${response.status}`);
                console.log(`   Response: ${JSON.stringify(response.data)}`);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error rejecting proposal: ${error.response?.data || error.message}`);
            return null;
        }
    }

    async testRequestProposalUpdate() {
        console.log('\n🧪 Testing request proposal update');
        
        try {
            await this.login('ptc');
            
            const updateData = {
                proposalId: this.proposalId,
                commentText: 'Se requiere actualización en los objetivos específicos para mayor claridad.',
                voteStatus: 'ACTUALIZA'
            };
            
            const response = await this.makeAuthenticatedRequest('ptc', 'POST', '/actualizar-propuesta', updateData);
            
            if (response.status === 200) {
                console.log('✅ Proposal update requested successfully');
                return response.data;
            } else {
                console.log(`❌ Failed to request proposal update: ${response.status}`);
                console.log(`   Response: ${JSON.stringify(response.data)}`);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error requesting proposal update: ${error.response?.data || error.message}`);
            return null;
        }
    }

    async runAllTests() {
        console.log('🚀 Testing Comment Functionality');
        console.log('=================================');
        
        // Get existing proposal
        await this.getExistingProposalId();
        
        // Test creating comments in different sections
        const sections = [
            { section: 'Información de la Empresa', subsection: 'Nombre Legal', vote: 'ACEPTADO', comment: 'El nombre legal está correctamente especificado.' },
            { section: 'Información de Contacto', subsection: 'Nombre de Contacto', vote: 'ACEPTADO', comment: 'La información de contacto es adecuada.' },
            { section: 'Supervisor del Proyecto', subsection: 'Nombre del Supervisor', vote: 'ACEPTADO', comment: 'El supervisor está bien identificado.' },
            { section: 'Datos del Proyecto', subsection: 'Objetivos Específicos', vote: 'ACTUALIZA', comment: 'Los objetivos específicos necesitan mayor detalle.' },
            { section: 'Datos del Proyecto', subsection: 'Tecnologías', vote: 'RECHAZADO', comment: 'Las tecnologías propuestas no son las más adecuadas.' }
        ];
        
        const createdComments = [];
        
        for (const section of sections) {
            const commentId = await this.testCreateCommentInDifferentSection(
                section.section,
                section.subsection,
                section.vote,
                section.comment
            );
            
            if (commentId && commentId !== 'exists') {
                createdComments.push(commentId);
            }
        }
        
        // Test getting comments
        await this.testGetCommentsByProposal();
        
        // Test proposal actions (these might fail if already done)
        await this.testApproveProposal();
        await this.testRejectProposal();
        await this.testRequestProposalUpdate();
        
        console.log('\n🎯 Comment functionality testing complete!');
        console.log(`📊 Created ${createdComments.length} new comments`);
    }
}

// Run tests
const tester = new CommentFunctionalityTest();
tester.runAllTests().catch(console.error);
