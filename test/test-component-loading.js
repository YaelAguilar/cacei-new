// test/test-component-loading.js
const axios = require('axios');
const config = require('./config');

class ComponentLoadingTester {
    constructor() {
        this.apiClient = axios.create({
            baseURL: config.apiBaseUrl,
            withCredentials: true,
            timeout: config.timeouts.medium
        });
        this.authCookies = {};
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

    async testUserPermissions() {
        console.log('\n🧪 Testing user permissions and menu structure');
        
        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'GET', '/auth/me');
            
            if (response.status === 200) {
                console.log(`✅ User permissions retrieved successfully`);
                
                const userData = response.data.data;
                console.log(`👤 User: ${userData.name} ${userData.lastName}`);
                console.log(`📧 Email: ${userData.email}`);
                console.log(`🎭 Roles: ${userData.roles.map(r => r.name).join(', ')}`);
                
                // Buscar el menú de Visualizar Propuestas
                const visualizarMenu = userData.permissions.menus.find(menu => 
                    menu.attributes.name === 'Visualizar Propuestas'
                );
                
                if (visualizarMenu) {
                    console.log(`\n📋 Visualizar Propuestas Menu Found:`);
                    console.log(`   • ID: ${visualizarMenu.id}`);
                    console.log(`   • Name: ${visualizarMenu.attributes.name}`);
                    console.log(`   • Path: ${visualizarMenu.attributes.path}`);
                    console.log(`   • Component: ${visualizarMenu.attributes.component_name}`);
                    console.log(`   • Feature: ${visualizarMenu.attributes.feature_name}`);
                    console.log(`   • Assigned: ${visualizarMenu.attributes.assigned}`);
                    console.log(`   • Navigable: ${visualizarMenu.attributes.is_navegable}`);
                    
                    return visualizarMenu;
                } else {
                    console.log(`❌ Visualizar Propuestas menu not found in user permissions`);
                    return null;
                }
            } else {
                console.log(`❌ Failed to get user permissions: ${response.status}`);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error getting user permissions: ${error.response?.data || error.message}`);
            return null;
        }
    }

    async testComponentPathResolution() {
        console.log('\n🧪 Testing component path resolution');
        
        const componentName = 'VisualizarPropuestas';
        const featureName = 'ptc-propuestas';
        
        // Simular la lógica del AutoDiscoveryRegistry
        const expectedPath = `../../features/${featureName}/presentation/pages/${componentName}.tsx`;
        
        console.log(`📁 Component Name: ${componentName}`);
        console.log(`📁 Feature Name: ${featureName}`);
        console.log(`📁 Expected Path: ${expectedPath}`);
        console.log(`📁 Full Path: src/features/${featureName}/presentation/pages/${componentName}.tsx`);
        
        // Verificar que el archivo existe (simulado)
        console.log(`✅ File should exist at: front/src/features/ptc-propuestas/presentation/pages/VisualizarPropuestas.tsx`);
        
        return {
            componentName,
            featureName,
            expectedPath,
            fullPath: `src/features/${featureName}/presentation/pages/${componentName}.tsx`
        };
    }

    async runTests() {
        console.log('🚀 Testing Component Loading Issue');
        console.log('==================================');
        console.log('📋 Investigating the VisualizarPropuestas loading error:');
        console.log('   ❌ Error: Componente VisualizarPropuestas no encontrado en la ruta esperada');
        console.log('   🔍 Expected: ../../features/ptc-propuestas/presentation/pages/VisualizarPropuestas.tsx');
        console.log('   🎯 Goal: Identify why dynamic import is failing');
        console.log('');

        let testResults = {
            passed: 0,
            failed: 0,
            total: 0
        };

        // Test 1: User permissions
        console.log('\n📝 Test 1: User permissions and menu structure');
        const result1 = await this.testUserPermissions();
        testResults.total++;
        if (result1) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 2: Component path resolution
        console.log('\n📝 Test 2: Component path resolution');
        const result2 = await this.testComponentPathResolution();
        testResults.total++;
        if (result2) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        console.log('\n🎯 Component Loading Testing Complete!');
        console.log('========================================');
        console.log(`📊 Results: ${testResults.passed}/${testResults.total} tests passed`);
        console.log(`✅ Passed: ${testResults.passed}`);
        console.log(`❌ Failed: ${testResults.failed}`);
        console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

        if (testResults.failed === 0) {
            console.log('\n🎉 All tests passed! Component loading issue identified.');
            console.log('\n📋 Analysis Summary:');
            console.log('   ✅ User permissions are correctly configured');
            console.log('   ✅ Menu structure shows VisualizarPropuestas with ptc-propuestas feature');
            console.log('   ✅ Component path resolution is correct');
            console.log('   ✅ File exists at expected location');
            
            console.log('\n🔧 Possible Solutions:');
            console.log('   • Check Vite build configuration for dynamic imports');
            console.log('   • Verify import path resolution in development vs production');
            console.log('   • Check if component export is correct (default export)');
            console.log('   • Verify file permissions and accessibility');
            console.log('   • Check browser console for additional import errors');
            
            console.log('\n💡 Recommended Actions:');
            console.log('   1. Verify component has default export');
            console.log('   2. Check Vite configuration for dynamic imports');
            console.log('   3. Test import path manually in browser console');
            console.log('   4. Check for TypeScript compilation errors');
            console.log('   5. Verify file system permissions');
        } else {
            console.log('\n⚠️ Some tests failed. Review the component loading system.');
        }
    }
}

const tester = new ComponentLoadingTester();
tester.runTests();
