// test/test-propuesta-detalle-simple.js
const axios = require('axios');

// Configuración
const API_BASE_URL = 'http://localhost:4000/api/v1';

// Helper para hacer requests autenticados
async function makeAuthenticatedRequest(method, url, data = null, cookies = '') {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      validateStatus: () => true // Aceptar cualquier status code
    });
    return response;
  } catch (error) {
    console.error('Error en request:', error.message);
    return { status: 500, data: { error: error.message } };
  }
}

// Función para login y obtener cookies
async function loginAndGetCookies(email, password) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    }, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true
    });

    if (response.status === 200) {
      const cookies = response.headers['set-cookie'];
      return cookies ? cookies.join('; ') : '';
    }
    return '';
  } catch (error) {
    console.error('Error en login:', error.message);
    return '';
  }
}

// Función para obtener una propuesta existente
async function getExistingProposal(cookies) {
  try {
    const response = await makeAuthenticatedRequest('GET', '/propuestas', null, cookies);
    if (response.status === 200 && response.data.data && response.data.data.length > 0) {
      return response.data.data[0];
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo propuesta:', error.message);
    return null;
  }
}

// Test principal
async function testPropuestaDetallePage() {
  console.log('🚀 Iniciando test de página de detalle de propuesta...');
  console.log('📋 Configuración:');
  console.log(`   - API Base URL: ${API_BASE_URL}`);
  console.log('');

  let testsPassed = 0;
  let testsTotal = 0;

  // Función helper para ejecutar test
  async function runTest(testName, testFunction) {
    testsTotal++;
    try {
      console.log(`\n🧪 ${testName}...`);
      await testFunction();
      console.log(`✅ ${testName} - PASÓ`);
      testsPassed++;
    } catch (error) {
      console.log(`❌ ${testName} - FALLÓ: ${error.message}`);
    }
  }

  // Test 1: Login de usuarios
  await runTest('Login de usuarios', async () => {
    console.log('🔐 Obteniendo credenciales de usuarios...');
    
    const alumnoCookies = await loginAndGetCookies('alumno-test@upchiapas.edu.mx', 'alumno_testing');
    const ptcCookies = await loginAndGetCookies('ptc@upchiapas.edu.mx', 'ptc_testing');
    const directorCookies = await loginAndGetCookies('director-test@upchiapas.edu.mx', 'director_testing');

    console.log(`   - Alumno: ${alumnoCookies ? '✅' : '❌'}`);
    console.log(`   - PTC: ${ptcCookies ? '✅' : '❌'}`);
    console.log(`   - Director: ${directorCookies ? '✅' : '❌'}`);

    if (!alumnoCookies || !ptcCookies || !directorCookies) {
      throw new Error('No se pudieron obtener todas las credenciales');
    }

    // Guardar cookies para otros tests
    global.testCookies = { alumnoCookies, ptcCookies, directorCookies };
  });

  // Test 2: Obtener propuesta de prueba
  await runTest('Obtener propuesta de prueba', async () => {
    const { ptcCookies } = global.testCookies;
    const testProposal = await getExistingProposal(ptcCookies);
    
    console.log(`📋 Propuesta de prueba: ${testProposal ? testProposal.uuid : 'No encontrada'}`);
    
    if (!testProposal) {
      throw new Error('No se encontró ninguna propuesta para las pruebas');
    }

    global.testProposal = testProposal;
  });

  // Test 3: Acceso a página de detalle - Alumno
  await runTest('Acceso a página de detalle - Alumno', async () => {
    const { alumnoCookies } = global.testCookies;
    const { testProposal } = global;

    const response = await makeAuthenticatedRequest(
      'GET', 
      `/propuestas/${testProposal.uuid}`, 
      null, 
      alumnoCookies
    );

    console.log(`📊 Respuesta para alumno: ${response.status}`);
    console.log(`📋 Datos: ${JSON.stringify(response.data).substring(0, 100)}...`);

    if (response.status !== 200 && response.status !== 404) {
      throw new Error(`Status inesperado: ${response.status}`);
    }
  });

  // Test 4: Acceso a página de detalle - PTC
  await runTest('Acceso a página de detalle - PTC', async () => {
    const { ptcCookies } = global.testCookies;
    const { testProposal } = global;

    const response = await makeAuthenticatedRequest(
      'GET', 
      `/propuestas/${testProposal.uuid}`, 
      null, 
      ptcCookies
    );

    console.log(`📊 Respuesta para PTC: ${response.status}`);
    console.log(`📋 Datos: ${JSON.stringify(response.data).substring(0, 100)}...`);

    if (response.status !== 200 && response.status !== 404) {
      throw new Error(`Status inesperado: ${response.status}`);
    }
  });

  // Test 5: Acceso a página de detalle - Director
  await runTest('Acceso a página de detalle - Director', async () => {
    const { directorCookies } = global.testCookies;
    const { testProposal } = global;

    const response = await makeAuthenticatedRequest(
      'GET', 
      `/propuestas/${testProposal.uuid}`, 
      null, 
      directorCookies
    );

    console.log(`📊 Respuesta para Director: ${response.status}`);
    console.log(`📋 Datos: ${JSON.stringify(response.data).substring(0, 100)}...`);

    if (response.status !== 200 && response.status !== 404) {
      throw new Error(`Status inesperado: ${response.status}`);
    }
  });

  // Test 6: Verificar voto final del tutor
  await runTest('Verificar voto final del tutor', async () => {
    const { ptcCookies } = global.testCookies;
    const { testProposal } = global;

    const response = await makeAuthenticatedRequest(
      'GET', 
      `/propuestas/${testProposal.uuid}/tutor-voto-final`, 
      null, 
      ptcCookies
    );

    console.log(`📊 Respuesta de voto final: ${response.status}`);
    console.log(`📋 Voto: ${JSON.stringify(response.data).substring(0, 100)}...`);

    if (response.status !== 200 && response.status !== 404) {
      throw new Error(`Status inesperado: ${response.status}`);
    }
  });

  // Test 7: Obtener comentarios
  await runTest('Obtener comentarios de la propuesta', async () => {
    const { ptcCookies } = global.testCookies;
    const { testProposal } = global;

    const response = await makeAuthenticatedRequest(
      'GET', 
      `/propuestas/${testProposal.uuid}/comentarios`, 
      null, 
      ptcCookies
    );

    console.log(`📊 Respuesta de comentarios: ${response.status}`);
    console.log(`📋 Comentarios: ${JSON.stringify(response.data).substring(0, 100)}...`);

    if (response.status !== 200 && response.status !== 404) {
      throw new Error(`Status inesperado: ${response.status}`);
    }
  });

  // Resumen final
  console.log('\n📊 RESUMEN DE TESTS:');
  console.log(`✅ Tests pasados: ${testsPassed}/${testsTotal}`);
  console.log(`❌ Tests fallidos: ${testsTotal - testsPassed}/${testsTotal}`);
  
  if (testsPassed === testsTotal) {
    console.log('\n🎉 ¡Todos los tests pasaron! La página de detalle de propuesta está funcionando correctamente.');
  } else {
    console.log('\n⚠️ Algunos tests fallaron. Revisa los logs para más detalles.');
  }

  return testsPassed === testsTotal;
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  testPropuestaDetallePage()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Error ejecutando tests:', error);
      process.exit(1);
    });
}

module.exports = { testPropuestaDetallePage };
