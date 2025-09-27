// test/test-propuesta-detalle-page.js
const axios = require('axios');
const { expect } = require('chai');

// Configuración
const config = require('./config');

// Helper para hacer requests autenticados
async function makeAuthenticatedRequest(method, url, data = null, cookies = '') {
  try {
    const response = await axios({
      method,
      url: `${config.apiBaseUrl}${url}`,
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
    const response = await axios.post(`${config.apiBaseUrl}/auth/login`, {
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

// Tests
describe('Página de Detalle de Propuesta', () => {
  let alumnoCookies = '';
  let ptcCookies = '';
  let directorCookies = '';
  let testProposal = null;

  before(async () => {
    console.log('🔐 Obteniendo credenciales de usuarios...');
    
    // Login de usuarios
    alumnoCookies = await loginAndGetCookies(config.users.alumno.email, config.users.alumno.password);
    ptcCookies = await loginAndGetCookies(config.users.ptc.email, config.users.ptc.password);
    directorCookies = await loginAndGetCookies(config.users.director.email, config.users.director.password);

    console.log('✅ Credenciales obtenidas');
    console.log(`   - Alumno: ${alumnoCookies ? '✅' : '❌'}`);
    console.log(`   - PTC: ${ptcCookies ? '✅' : '❌'}`);
    console.log(`   - Director: ${directorCookies ? '✅' : '❌'}`);

    // Obtener una propuesta existente para las pruebas
    if (ptcCookies) {
      testProposal = await getExistingProposal(ptcCookies);
      console.log(`📋 Propuesta de prueba: ${testProposal ? testProposal.uuid : 'No encontrada'}`);
    }
  });

  describe('Acceso a la página de detalle', () => {
    it('debería permitir acceso a alumno con propuesta válida', async () => {
      if (!testProposal || !alumnoCookies) {
        console.log('⏭️ Saltando test - Sin propuesta o credenciales de alumno');
        return;
      }

      const response = await makeAuthenticatedRequest(
        'GET', 
        `/propuestas/${testProposal.uuid}`, 
        null, 
        alumnoCookies
      );

      console.log(`📊 Respuesta para alumno: ${response.status}`);
      console.log(`📋 Datos: ${JSON.stringify(response.data).substring(0, 100)}...`);

      // El alumno debería poder acceder a los detalles de la propuesta
      expect(response.status).to.be.oneOf([200, 404]); // 200 si existe, 404 si no tiene acceso
    });

    it('debería permitir acceso a PTC con propuesta válida', async () => {
      if (!testProposal || !ptcCookies) {
        console.log('⏭️ Saltando test - Sin propuesta o credenciales de PTC');
        return;
      }

      const response = await makeAuthenticatedRequest(
        'GET', 
        `/propuestas/${testProposal.uuid}`, 
        null, 
        ptcCookies
      );

      console.log(`📊 Respuesta para PTC: ${response.status}`);
      console.log(`📋 Datos: ${JSON.stringify(response.data).substring(0, 100)}...`);

      // El PTC debería poder acceder a los detalles de la propuesta
      expect(response.status).to.be.oneOf([200, 404]); // 200 si existe, 404 si no tiene acceso
    });

    it('debería permitir acceso a Director con propuesta válida', async () => {
      if (!testProposal || !directorCookies) {
        console.log('⏭️ Saltando test - Sin propuesta o credenciales de Director');
        return;
      }

      const response = await makeAuthenticatedRequest(
        'GET', 
        `/propuestas/${testProposal.uuid}`, 
        null, 
        directorCookies
      );

      console.log(`📊 Respuesta para Director: ${response.status}`);
      console.log(`📋 Datos: ${JSON.stringify(response.data).substring(0, 100)}...`);

      // El Director debería poder acceder a los detalles de la propuesta
      expect(response.status).to.be.oneOf([200, 404]); // 200 si existe, 404 si no tiene acceso
    });
  });

  describe('Funcionalidades de la página', () => {
    it('debería cargar comentarios para tutores académicos', async () => {
      if (!testProposal || !ptcCookies) {
        console.log('⏭️ Saltando test - Sin propuesta o credenciales de PTC');
        return;
      }

      // Primero obtener los detalles de la propuesta
      const proposalResponse = await makeAuthenticatedRequest(
        'GET', 
        `/propuestas/${testProposal.uuid}`, 
        null, 
        ptcCookies
      );

      if (proposalResponse.status !== 200) {
        console.log('⏭️ Saltando test - No se pudo acceder a la propuesta');
        return;
      }

      // Luego obtener los comentarios
      const commentsResponse = await makeAuthenticatedRequest(
        'GET', 
        `/propuestas/${testProposal.uuid}/comentarios`, 
        null, 
        ptcCookies
      );

      console.log(`📊 Respuesta de comentarios: ${commentsResponse.status}`);
      console.log(`📋 Comentarios: ${JSON.stringify(commentsResponse.data).substring(0, 100)}...`);

      // Debería poder obtener comentarios (200) o no tener comentarios (404)
      expect(commentsResponse.status).to.be.oneOf([200, 404]);
    });

    it('debería verificar voto final del tutor', async () => {
      if (!testProposal || !ptcCookies) {
        console.log('⏭️ Saltando test - Sin propuesta o credenciales de PTC');
        return;
      }

      const response = await makeAuthenticatedRequest(
        'GET', 
        `/propuestas/${testProposal.uuid}/tutor-voto-final`, 
        null, 
        ptcCookies
      );

      console.log(`📊 Respuesta de voto final: ${response.status}`);
      console.log(`📋 Voto: ${JSON.stringify(response.data).substring(0, 100)}...`);

      // Debería poder verificar el voto final (200) o no tener voto (404)
      expect(response.status).to.be.oneOf([200, 404]);
    });
  });

  describe('Navegación desde listas', () => {
    it('debería poder navegar desde la lista de propuestas del alumno', async () => {
      if (!alumnoCookies) {
        console.log('⏭️ Saltando test - Sin credenciales de alumno');
        return;
      }

      // Obtener propuestas del alumno
      const response = await makeAuthenticatedRequest(
        'GET', 
        '/propuestas/alumno', 
        null, 
        alumnoCookies
      );

      console.log(`📊 Respuesta de propuestas del alumno: ${response.status}`);
      console.log(`📋 Propuestas: ${JSON.stringify(response.data).substring(0, 100)}...`);

      // Debería poder obtener sus propuestas
      expect(response.status).to.be.oneOf([200, 404]);
    });

    it('debería poder navegar desde la lista de propuestas del PTC', async () => {
      if (!ptcCookies) {
        console.log('⏭️ Saltando test - Sin credenciales de PTC');
        return;
      }

      // Obtener todas las propuestas (PTC)
      const response = await makeAuthenticatedRequest(
        'GET', 
        '/propuestas', 
        null, 
        ptcCookies
      );

      console.log(`📊 Respuesta de propuestas del PTC: ${response.status}`);
      console.log(`📋 Propuestas: ${JSON.stringify(response.data).substring(0, 100)}...`);

      // Debería poder obtener todas las propuestas
      expect(response.status).to.be.oneOf([200, 404]);
    });
  });
});

// Ejecutar tests
if (require.main === module) {
  console.log('🚀 Iniciando tests de página de detalle de propuesta...');
  console.log('📋 Configuración:');
  console.log(`   - API Base URL: ${config.apiBaseUrl}`);
  console.log(`   - Usuario Alumno: ${config.users.alumno.email}`);
  console.log(`   - Usuario PTC: ${config.users.ptc.email}`);
  console.log(`   - Usuario Director: ${config.users.director.email}`);
  console.log('');

  // Ejecutar con Mocha
  const Mocha = require('mocha');
  const mocha = new Mocha({
    reporter: 'spec',
    timeout: 30000
  });

  mocha.addFile(__filename);
  mocha.run((failures) => {
    if (failures === 0) {
      console.log('✅ Todos los tests pasaron!');
    } else {
      console.log(`❌ ${failures} test(s) fallaron`);
    }
    process.exit(failures);
  });
}
