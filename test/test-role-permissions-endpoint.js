// test/test-role-permissions-endpoint.js
const axios = require('axios');
const config = require('./config');

class RolePermissionsTester {
    constructor() {
        this.apiClient = axios.create({
            baseURL: config.apiBaseUrl,
            withCredentials: true,
            timeout: config.timeouts.medium
        });
        this.authCookies = {};
        this.userData = null;
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

    async testGetCurrentUser() {
        console.log('\n🧪 Testing /auth/me endpoint');
        
        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'GET', '/auth/me');
            
            if (response.status === 200) {
                console.log(`✅ /auth/me endpoint working`);
                this.userData = response.data.data;
                console.log(`👤 User ID: ${this.userData.id}`);
                console.log(`👤 User UUID: ${this.userData.uuid}`);
                console.log(`👤 User Name: ${this.userData.name} ${this.userData.lastName}`);
                console.log(`👤 User Email: ${this.userData.email}`);
                console.log(`🎭 User Roles: ${JSON.stringify(this.userData.roles)}`);
                
                return this.userData;
            } else {
                console.log(`❌ /auth/me failed: ${response.status}`);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error getting current user: ${error.response?.data || error.message}`);
            return null;
        }
    }

    async testGetRolePermissions(roleId) {
        console.log(`\n🧪 Testing /roles/${roleId}/permissions endpoint`);
        
        try {
            await this.login('ptc');
            const response = await this.makeAuthenticatedRequest('ptc', 'GET', `/roles/${roleId}/permissions`);
            
            if (response.status === 200) {
                console.log(`✅ /roles/${roleId}/permissions endpoint working`);
                
                const permissions = response.data.data;
                console.log(`📋 Role: ${permissions.attributes.name}`);
                console.log(`📋 Description: ${permissions.attributes.description}`);
                console.log(`📋 Active: ${permissions.attributes.active}`);
                
                if (permissions.relationships && permissions.relationships.availablePermissions) {
                    const menus = permissions.relationships.availablePermissions.menus;
                    console.log(`📋 Total Menus: ${menus.length}`);
                    
                    // Buscar el menú de Visualizar Propuestas
                    const visualizarMenu = menus.find(menu => 
                        menu.attributes.name === 'Visualizar Propuestas'
                    );
                    
                    if (visualizarMenu) {
                        console.log(`\n🎯 Visualizar Propuestas Menu Found:`);
                        console.log(`   • ID: ${visualizarMenu.id}`);
                        console.log(`   • Name: ${visualizarMenu.attributes.name}`);
                        console.log(`   • Path: ${visualizarMenu.attributes.path}`);
                        console.log(`   • Component: ${visualizarMenu.attributes.component_name}`);
                        console.log(`   • Feature: ${visualizarMenu.attributes.feature_name}`);
                        console.log(`   • Assigned: ${visualizarMenu.attributes.assigned}`);
                        console.log(`   • Navigable: ${visualizarMenu.attributes.is_navegable}`);
                        
                        return visualizarMenu;
                    } else {
                        console.log(`❌ Visualizar Propuestas menu not found in permissions`);
                        console.log(`📋 Available menus: ${menus.map(m => m.attributes.name).join(', ')}`);
                        return null;
                    }
                } else {
                    console.log(`❌ No permissions structure found in response`);
                    return null;
                }
            } else {
                console.log(`❌ /roles/${roleId}/permissions failed: ${response.status}`);
                if (response.data) {
                    console.log(`❌ Error details: ${JSON.stringify(response.data)}`);
                }
                return null;
            }
        } catch (error) {
            console.error(`❌ Error getting role permissions: ${error.response?.data || error.message}`);
            return null;
        }
    }

    async runTests() {
        console.log('🚀 Testing Role Permissions Endpoint');
        console.log('====================================');
        console.log('📋 Investigating the component loading issue:');
        console.log('   ❌ Error: Componente VisualizarPropuestas no encontrado');
        console.log('   🔍 Checking: /auth/me and /roles/:id/permissions endpoints');
        console.log('   🎯 Goal: Verify permissions are loaded correctly');
        console.log('');

        let testResults = {
            passed: 0,
            failed: 0,
            total: 0
        };

        // Test 1: Get current user
        console.log('\n📝 Test 1: Get current user from /auth/me');
        const userData = await this.testGetCurrentUser();
        testResults.total++;
        if (userData) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }

        // Test 2: Get role permissions
        if (userData && userData.roles && userData.roles.length > 0) {
            console.log('\n📝 Test 2: Get role permissions');
            const roleId = userData.roles[0].id;
            const permissions = await this.testGetRolePermissions(roleId);
            testResults.total++;
            if (permissions) {
                testResults.passed++;
            } else {
                testResults.failed++;
            }
        } else {
            console.log('\n❌ Cannot test role permissions - no user data or roles');
            testResults.total++;
            testResults.failed++;
        }

        console.log('\n🎯 Role Permissions Testing Complete!');
        console.log('======================================');
        console.log(`📊 Results: ${testResults.passed}/${testResults.total} tests passed`);
        console.log(`✅ Passed: ${testResults.passed}`);
        console.log(`❌ Failed: ${testResults.failed}`);
        console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

        if (testResults.failed === 0) {
            console.log('\n🎉 All tests passed! Role permissions are working correctly.');
            console.log('\n📋 Analysis Summary:');
            console.log('   ✅ /auth/me endpoint returns user data correctly');
            console.log('   ✅ /roles/:id/permissions endpoint returns permissions');
            console.log('   ✅ VisualizarPropuestas menu is found in permissions');
            console.log('   ✅ Component path resolution should work');
            
            console.log('\n🔧 Next Steps to Fix Component Loading:');
            console.log('   • Check if frontend is calling /roles/:id/permissions correctly');
            console.log('   • Verify AuthViewModel is loading permissions on login');
            console.log('   • Check if permissions are stored in localStorage');
            console.log('   • Verify component file exists and has default export');
            console.log('   • Check browser console for import errors');
            
            console.log('\n💡 Possible Issues:');
            console.log('   • Frontend not calling permissions endpoint after login');
            console.log('   • Permissions not being stored in AuthViewModel');
            console.log('   • Component file missing or incorrect export');
            console.log('   • Vite dynamic import configuration issue');
        } else {
            console.log('\n⚠️ Some tests failed. Review the permissions system.');
        }
    }
}

const tester = new RolePermissionsTester();
tester.runTests();
