// Setup test data for comment and evaluation testing
const axios = require('axios');
const config = require('./config');

class TestDataSetup {
    constructor() {
        this.apiClient = axios.create({
            baseURL: config.apiBaseUrl,
            withCredentials: true,
            timeout: 10000
        });
        this.authTokens = new Map();
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
                case 'delete':
                    return await this.apiClient.delete(endpoint, requestConfig);
                default:
                    throw new Error(`Unsupported HTTP method: ${method}`);
            }
        } catch (error) {
            throw error;
        }
    }

    async cleanupExistingProposals() {
        console.log('🧹 Cleaning up existing proposals...');
        
        try {
            // Login as alumno
            await this.login('alumno');
            
            // Get existing proposals
            const response = await this.makeAuthenticatedRequest('alumno', 'GET', '/propuestas/mis-propuestas');
            
            if (response.status === 200 && response.data.data) {
                console.log(`Found ${response.data.data.length} existing proposals`);
                
                // Note: We can't delete proposals through API, but we can note them
                // The tests will need to work with existing data or use different users
                return response.data.data;
            }
        } catch (error) {
            console.log('No existing proposals found or error:', error.message);
        }
        
        return [];
    }

    async createTestProposal() {
        console.log('📝 Creating test proposal...');
        
        try {
            // Login as alumno
            await this.login('alumno');
            
            const proposalData = {
                academicTutorId: 8, // PTC user
                internshipType: 'Estancia I',
                companyShortName: 'TestCorp',
                companyLegalName: 'TestCorp Solutions S.A. de C.V.',
                companyTaxId: 'TST123456789',
                companyState: 'Chiapas',
                companyMunicipality: 'Tuxtla Gutiérrez',
                companySettlementType: 'Colonia',
                companySettlementName: 'Centro',
                companyStreetType: 'Calle',
                companyStreetName: 'Test',
                companyExteriorNumber: '456',
                companyInteriorNumber: 'B',
                companyPostalCode: '29000',
                companyWebsite: 'https://testcorp.com',
                companyLinkedin: 'https://linkedin.com/company/testcorp',
                contactName: 'Test Contact',
                contactPosition: 'Test Position',
                contactEmail: 'test.contact@testcorp.com',
                contactPhone: '9619999999',
                contactArea: 'Test Area',
                supervisorName: 'Test Supervisor',
                supervisorArea: 'Test Development',
                supervisorEmail: 'test.supervisor@testcorp.com',
                supervisorPhone: '9618888888',
                projectName: 'Test Project for Comments',
                projectStartDate: '2025-11-01',
                projectEndDate: '2026-02-01',
                projectProblemContext: 'Test problem context for comment testing.',
                projectProblemDescription: 'Test problem description for comment testing.',
                projectGeneralObjective: 'Test general objective for comment testing.',
                projectSpecificObjectives: 'Test specific objectives for comment testing.',
                projectMainActivities: 'Test main activities for comment testing.',
                projectPlannedDeliverables: 'Test deliverables for comment testing.',
                projectTechnologies: 'Test technologies for comment testing.'
            };
            
            const response = await this.makeAuthenticatedRequest('alumno', 'POST', '/propuestas/', proposalData);
            
            if (response.status === 201) {
                console.log('✅ Test proposal created successfully');
                return response.data.data.id;
            } else {
                console.log('⚠️ Could not create new proposal (might already exist)');
                return null;
            }
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.errors?.[0]?.detail?.includes('Ya tienes una propuesta')) {
                console.log('⚠️ Student already has a proposal (this is expected)');
                return 'existing';
            } else {
                console.error('❌ Error creating test proposal:', error.response?.data || error.message);
                return null;
            }
        }
    }

    async getExistingProposalId() {
        console.log('🔍 Getting existing proposal ID...');
        
        try {
            await this.login('alumno');
            const response = await this.makeAuthenticatedRequest('alumno', 'GET', '/propuestas/mis-propuestas');
            
            if (response.status === 200 && response.data.data && response.data.data.length > 0) {
                const proposalId = response.data.data[0].id;
                console.log(`✅ Found existing proposal: ${proposalId}`);
                return proposalId;
            }
        } catch (error) {
            console.error('❌ Error getting existing proposal:', error.response?.data || error.message);
        }
        
        return null;
    }

    async setupTestData() {
        console.log('🚀 Setting up test data for comment testing...');
        console.log('================================================');
        
        // Clean up existing data
        await this.cleanupExistingProposals();
        
        // Try to create new proposal or get existing one
        const proposalId = await this.createTestProposal();
        
        if (proposalId === 'existing') {
            const existingId = await this.getExistingProposalId();
            if (existingId) {
                console.log(`✅ Using existing proposal: ${existingId}`);
                return existingId;
            }
        } else if (proposalId) {
            console.log(`✅ Using new proposal: ${proposalId}`);
            return proposalId;
        }
        
        console.log('❌ Could not setup test data');
        return null;
    }
}

// Run setup
async function runSetup() {
    const setup = new TestDataSetup();
    const proposalId = await setup.setupTestData();
    
    if (proposalId) {
        console.log('\n🎯 Test data setup complete!');
        console.log(`📋 Proposal ID for testing: ${proposalId}`);
        console.log('\n📝 Next steps:');
        console.log('1. Run comment tests');
        console.log('2. Test proposal evaluation workflows');
        console.log('3. Test status calculation logic');
    } else {
        console.log('\n❌ Test data setup failed');
        console.log('Please check the system and try again');
    }
}

runSetup();
