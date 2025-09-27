// Test Configuration
require('dotenv').config();

const config = {
  // API Configuration
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:4000/api/v1',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Test User Credentials
  users: {
    alumno: {
      email: process.env.ALUMNO_EMAIL || 'alumno-test@upchiapas.edu.mx',
      password: process.env.ALUMNO_PASSWORD || 'alumno_testing'
    },
    director: {
      email: process.env.DIRECTOR_EMAIL || 'director-test@upchiapas.edu.mx',
      password: process.env.DIRECTOR_PASSWORD || 'director_testing'
    },
    ptc: {
      email: process.env.PTC_EMAIL || 'ptc@upchiapas.edu.mx',
      password: process.env.PTC_PASSWORD || 'ptc_testing'
    },
    pa: {
      email: process.env.PA_EMAIL || 'pa@upchiapas.edu.mx',
      password: process.env.PA_PASSWORD || 'ptc_testing' // PA users use same password as PTC
    },
    adminUsuarios: {
      email: process.env.ADMIN_USUARIOS_EMAIL || 'admin-usuarios@upchiapas.edu.mx',
      password: process.env.ADMIN_USUARIOS_PASSWORD || 'ptc_testing' // Admin users use same password as PTC
    },
    superAdmin: {
      email: process.env.SUPER_ADMIN_EMAIL || 'yam778123@gmail.com',
      password: process.env.SUPER_ADMIN_PASSWORD || 'ptc_testing' // Super admin uses same password as PTC
    },
    // Additional PTC users (all use same password)
    ptcCarlos: {
      email: process.env.PTC_CARLOS_EMAIL || 'carlos.mendoza@upchiapas.edu.mx',
      password: process.env.PTC_PASSWORD || 'ptc_testing'
    },
    ptcMaria: {
      email: process.env.PTC_MARIA_EMAIL || 'maria.gonzalez@upchiapas.edu.mx',
      password: process.env.PTC_PASSWORD || 'ptc_testing'
    },
    ptcJose: {
      email: process.env.PTC_JOSE_EMAIL || 'jose.hernandez@upchiapas.edu.mx',
      password: process.env.PTC_PASSWORD || 'ptc_testing'
    },
    ptcAna: {
      email: process.env.PTC_ANA_EMAIL || 'ana.perez@upchiapas.edu.mx',
      password: process.env.PTC_PASSWORD || 'ptc_testing'
    },
    ptcRoberto: {
      email: process.env.PTC_ROBERTO_EMAIL || 'roberto.jimenez@upchiapas.edu.mx',
      password: process.env.PTC_PASSWORD || 'ptc_testing'
    }
  },
  
  // Test Data
  testData: {
    validProposal: {
      academicTutorId: 8, // PTC user ID
      internshipType: 'Estancia I',
      companyShortName: 'TechCorp',
      companyLegalName: 'TechCorp Solutions S.A. de C.V.',
      companyTaxId: 'TEC123456789',
      companyState: 'Chiapas',
      companyMunicipality: 'Tuxtla Gutiérrez',
      companySettlementType: 'Colonia',
      companySettlementName: 'Centro',
      companyStreetType: 'Calle',
      companyStreetName: 'Revolución',
      companyExteriorNumber: '123',
      companyInteriorNumber: 'A',
      companyPostalCode: '29000',
      companyWebsite: 'https://techcorp.com',
      companyLinkedin: 'https://linkedin.com/company/techcorp',
      contactName: 'Juan Pérez',
      contactPosition: 'Gerente de Recursos Humanos',
      contactEmail: 'juan.perez@techcorp.com',
      contactPhone: '9611234567',
      contactArea: 'Recursos Humanos',
      supervisorName: 'María García',
      supervisorArea: 'Desarrollo de Software',
      supervisorEmail: 'maria.garcia@techcorp.com',
      supervisorPhone: '9617654321',
      projectName: 'Sistema de Gestión de Inventarios',
      projectStartDate: '2025-10-15',
      projectEndDate: '2026-01-15',
      projectProblemContext: 'La empresa necesita un sistema moderno para gestionar su inventario de manera eficiente.',
      projectProblemDescription: 'Actualmente el inventario se maneja manualmente, lo que genera errores y pérdidas.',
      projectGeneralObjective: 'Desarrollar un sistema web para la gestión automatizada de inventarios.',
      projectSpecificObjectives: '1. Crear módulo de productos\n2. Implementar control de stock\n3. Generar reportes automáticos',
      projectMainActivities: 'Análisis de requerimientos, diseño de base de datos, desarrollo frontend y backend.',
      projectPlannedDeliverables: 'Sistema web funcional, documentación técnica, manual de usuario.',
      projectTechnologies: 'React, Node.js, MySQL, Express'
    },
    
    invalidProposal: {
      academicTutorId: 999, // Invalid tutor ID
      internshipType: 'Invalid Type',
      companyLegalName: '', // Empty required field
      companyTaxId: 'INVALID', // Invalid RFC format
      projectStartDate: '2024-01-01', // Past date
      projectEndDate: '2024-01-15' // End before start
    }
  },
  
  // Test Timeouts
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000
  }
};

module.exports = config;
