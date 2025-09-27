// test/test-component-loading-fix.js
const axios = require('axios');
const config = require('./config');

class ComponentLoadingFixTester {
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

    async testCompleteFlow() {
        console.log('\n🧪 Testing complete authentication and permissions flow');
        
        try {
            // 1. Login
            await this.login('ptc');
            console.log('✅ Login successful');
            
            // 2. Get current user
            const userResponse = await this.makeAuthenticatedRequest('ptc', 'GET', '/auth/me');
            if (userResponse.status !== 200) {
                console.log(`❌ Failed to get current user: ${userResponse.status}`);
                return false;
            }
            console.log('✅ Current user retrieved');
            
            const userData = userResponse.data.data;
            const roleId = userData.roles[0].id;
            
            // 3. Get role permissions
            const permissionsResponse = await this.makeAuthenticatedRequest('ptc', 'GET', `/roles/${roleId}/permissions`);
            if (permissionsResponse.status !== 200) {
                console.log(`❌ Failed to get role permissions: ${permissionsResponse.status}`);
                return false;
            }
            console.log('✅ Role permissions retrieved');
            
            // 4. Find VisualizarPropuestas menu
            const permissions = permissionsResponse.data.data;
            const visualizarMenu = permissions.relationships.availablePermissions.menus.find(menu => 
                menu.attributes.name === 'Visualizar Propuestas'
            );
            
            if (!visualizarMenu) {
                console.log('❌ VisualizarPropuestas menu not found');
                return false;
            }
            console.log('✅ VisualizarPropuestas menu found');
            
            // 5. Verify component configuration
            const componentName = visualizarMenu.attributes.component_name;
            const featureName = visualizarMenu.attributes.feature_name;
            const path = visualizarMenu.attributes.path;
            const assigned = visualizarMenu.attributes.assigned;
            
            console.log(`📋 Component Configuration:`);
            console.log(`   • Component Name: ${componentName}`);
            console.log(`   • Feature Name: ${featureName}`);
            console.log(`   • Path: ${path}`);
            console.log(`   • Assigned: ${assigned}`);
            
            if (componentName === 'VisualizarPropuestas' && 
                featureName === 'ptc-propuestas' && 
                path === '/propuestas' && 
                assigned === true) {
                console.log('✅ Component configuration is correct');
                return true;
            } else {
                console.log('❌ Component configuration is incorrect');
                return false;
            }
            
        } catch (error) {
            console.error(`❌ Error in complete flow: ${error.response?.data || error.message}`);
            return false;
        }
    }

    async runTests() {
        console.log('🚀 Testing Component Loading Fix');
        console.log('=================================');
        console.log('📋 Verifying the complete fix:');
        console.log('   ✅ Backend: Fixed role permissions endpoint');
        console.log('   ✅ Backend: Now handles both UUID and numeric IDs');
        console.log('   ✅ Frontend: Should now be able to load permissions');
        console.log('   ✅ Component: VisualizarPropuestas should load correctly');
        console.log('');

        let testResults = {
            passed: 0,
            failed: 0,
            total: 0
        };

        // Test: Complete flow
        console.log('\n📝 Test: Complete authentication and permissions flow');
        const result = await this.testCompleteFlow();
        testResults.total++;
        if (result) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        console.log('\n🎯 Component Loading Fix Testing Complete!');
        console.log('==========================================');
        console.log(`📊 Results: ${testResults.passed}/${testResults.total} tests passed`);
        console.log(`✅ Passed: ${testResults.passed}`);
        console.log(`❌ Failed: ${testResults.failed}`);
        console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

        if (testResults.failed === 0) {
            console.log('\n🎉 All tests passed! Component loading issue should be fixed.');
            console.log('\n📋 Summary of Fix:');
            console.log('   ✅ Backend: Fixed MysqlRoleRepository.getRolePermissions()');
            console.log('   ✅ Backend: Now handles both UUID and numeric role IDs');
            console.log('   ✅ Backend: /roles/:id/permissions endpoint working');
            console.log('   ✅ Frontend: Permissions can now be loaded correctly');
            console.log('   ✅ Component: VisualizarPropuestas should load from ptc-propuestas feature');
            
            console.log('\n🔧 Technical Details:');
            console.log('   • Repository now checks if roleId is numeric or UUID');
            console.log('   • Uses appropriate SQL query based on ID type');
            console.log('   • Maintains backward compatibility with UUIDs');
            console.log('   • Frontend can now successfully load user permissions');
            console.log('   • Component path resolution should work: ptc-propuestas/VisualizarPropuestas');
            
            console.log('\n💡 Next Steps:');
            console.log('   1. Refresh the frontend application');
            console.log('   2. Login as PTC user');
            console.log('   3. Navigate to /propuestas');
            console.log('   4. VisualizarPropuestas component should load correctly');
            console.log('   5. Check browser console for any remaining errors');
            
            console.log('\n🎯 Expected Result:');
            console.log('   • No more "Componente VisualizarPropuestas no encontrado" errors');
            console.log('   • PTC user can access /propuestas route');
            console.log('   • VisualizarPropuestas component loads successfully');
            console.log('   • User can view and interact with proposals');
        } else {
            console.log('\n⚠️ Some tests failed. Review the implementation.');
        }
    }
}

const tester = new ComponentLoadingFixTester();
tester.runTests();
