// Proposal Tests
const TestHelpers = require('../utils/test-helpers');
const config = require('../config');

class ProposalTests {
  constructor() {
    this.helpers = new TestHelpers();
    this.createdProposals = []; // Track created proposals for cleanup
  }

  async runAllTests() {
    const tests = {
      'Get active convocatoria': () => this.testGetActiveConvocatoria(),
      'Create valid proposal': () => this.testCreateValidProposal(),
      'Create proposal with invalid data': () => this.testCreateInvalidProposal(),
      'Create proposal without active convocatoria': () => this.testCreateProposalWithoutConvocatoria(),
      'Create duplicate proposal': () => this.testCreateDuplicateProposal(),
      'Get student proposals': () => this.testGetStudentProposals(),
      'Get specific proposal': () => this.testGetSpecificProposal(),
      'Update proposal': () => this.testUpdateProposal(),
      'Update proposal status': () => this.testUpdateProposalStatus(),
      'Get proposals by status': () => this.testGetProposalsByStatus(),
      'Validate proposal fields': () => this.testValidateProposalFields(),
      'Test proposal business rules': () => this.testProposalBusinessRules()
    };

    return await this.helpers.runTestSuite('Proposal Tests', tests);
  }

  async testGetActiveConvocatoria() {
    const response = await this.helpers.makeRequest('GET', '/propuestas/convocatoria-activa', null, 'alumno');
    
    this.helpers.assertSuccess(response, 200);
    this.helpers.assertHasProperty(response.data, 'data');
    this.helpers.assertHasProperty(response.data.data, 'attributes');
    
    const attrs = response.data.data.attributes;
    this.helpers.assertHasProperty(attrs, 'nombre');
    this.helpers.assertHasProperty(attrs, 'pasantiasDisponibles');
    this.helpers.assertHasProperty(attrs, 'profesoresDisponibles');
    
    this.helpers.assertArrayLength(attrs.pasantiasDisponibles, 3); // Based on DB data
    this.helpers.assertArrayLength(attrs.profesoresDisponibles, 7); // Based on DB data
  }

  async testCreateValidProposal() {
    const proposalData = this.helpers.generateValidProposal();
    
    const response = await this.helpers.makeRequest('POST', '/propuestas', proposalData, 'alumno');
    
    this.helpers.assertSuccess(response, 201);
    this.helpers.assertHasProperty(response.data, 'data');
    this.helpers.assertHasProperty(response.data.data, 'id');
    this.helpers.assertHasProperty(response.data.data, 'attributes');
    
    const attrs = response.data.data.attributes;
    this.helpers.assertHasProperty(attrs, 'estatus');
    this.helpers.assertHasProperty(attrs, 'informacionDelAlumno');
    this.helpers.assertHasProperty(attrs, 'datosDelProyecto');
    
    // Verify status is PENDIENTE
    if (attrs.estatus !== 'PENDIENTE') {
      throw new Error(`Expected status PENDIENTE, got ${attrs.estatus}`);
    }
    
    // Store for cleanup
    this.createdProposals.push(response.data.data.id);
  }

  async testCreateInvalidProposal() {
    const invalidData = this.helpers.generateInvalidProposal();
    
    const response = await this.helpers.makeRequest('POST', '/propuestas', invalidData, 'alumno');
    
    this.helpers.assertError(response, 400);
    this.helpers.assertHasProperty(response.data, 'errors');
  }

  async testCreateProposalWithoutConvocatoria() {
    // This test would require deactivating the current convocatoria
    // For now, we'll test the validation logic
    const proposalData = this.helpers.generateValidProposal();
    
    // Try to create proposal with invalid convocatoria
    const response = await this.helpers.makeRequest('POST', '/propuestas', {
      ...proposalData,
      convocatoriaId: 999 // Non-existent convocatoria
    }, 'alumno');
    
    // Should fail due to foreign key constraint or business logic
    this.helpers.assertError(response, 400);
  }

  async testCreateDuplicateProposal() {
    // First, create a proposal
    const proposalData = this.helpers.generateValidProposal();
    const firstResponse = await this.helpers.makeRequest('POST', '/propuestas', proposalData, 'alumno');
    
    if (firstResponse.status !== 201) {
      throw new Error('Failed to create first proposal for duplicate test');
    }
    
    this.createdProposals.push(firstResponse.data.data.id);
    
    // Try to create another proposal (should fail due to unique constraint)
    const secondResponse = await this.helpers.makeRequest('POST', '/propuestas', proposalData, 'alumno');
    
    this.helpers.assertError(secondResponse, 400);
    this.helpers.assertHasProperty(secondResponse.data, 'errors');
    
    // Verify error message mentions duplicate proposal
    const errorMessage = secondResponse.data.errors[0].detail;
    if (!errorMessage.includes('propuesta registrada') && !errorMessage.includes('duplicate')) {
      throw new Error(`Expected duplicate proposal error, got: ${errorMessage}`);
    }
  }

  async testGetStudentProposals() {
    const response = await this.helpers.makeRequest('GET', '/propuestas/mis-propuestas', null, 'alumno');
    
    this.helpers.assertSuccess(response, 200);
    this.helpers.assertHasProperty(response.data, 'data');
    
    // Should be an array (even if empty)
    if (!Array.isArray(response.data.data)) {
      throw new Error('Expected array of proposals');
    }
  }

  async testGetSpecificProposal() {
    // First create a proposal
    const proposalData = this.helpers.generateValidProposal();
    const createResponse = await this.helpers.makeRequest('POST', '/propuestas', proposalData, 'alumno');
    
    if (createResponse.status !== 201) {
      throw new Error('Failed to create proposal for get test');
    }
    
    const proposalId = createResponse.data.data.id;
    this.createdProposals.push(proposalId);
    
    // Get the specific proposal
    const response = await this.helpers.makeRequest('GET', `/propuestas/${proposalId}`, null, 'alumno');
    
    this.helpers.assertSuccess(response, 200);
    this.helpers.assertHasProperty(response.data, 'data');
    this.helpers.assertHasProperty(response.data.data, 'id');
    
    if (response.data.data.id !== proposalId) {
      throw new Error(`Expected proposal ID ${proposalId}, got ${response.data.data.id}`);
    }
  }

  async testUpdateProposal() {
    // First create a proposal
    const proposalData = this.helpers.generateValidProposal();
    const createResponse = await this.helpers.makeRequest('POST', '/propuestas', proposalData, 'alumno');
    
    if (createResponse.status !== 201) {
      throw new Error('Failed to create proposal for update test');
    }
    
    const proposalId = createResponse.data.data.id;
    this.createdProposals.push(proposalId);
    
    // Update the proposal
    const updateData = {
      projectName: 'Updated Project Name',
      projectProblemDescription: 'Updated problem description'
    };
    
    const response = await this.helpers.makeRequest('PUT', `/propuestas/${proposalId}`, updateData, 'alumno');
    
    this.helpers.assertSuccess(response, 200);
    this.helpers.assertHasProperty(response.data, 'data');
    
    // Verify the update
    const attrs = response.data.data.attributes;
    if (attrs.datosDelProyecto?.nombreDelProyecto !== updateData.projectName) {
      throw new Error('Project name was not updated correctly');
    }
  }

  async testUpdateProposalStatus() {
    // First create a proposal
    const proposalData = this.helpers.generateValidProposal();
    const createResponse = await this.helpers.makeRequest('POST', '/propuestas', proposalData, 'alumno');
    
    if (createResponse.status !== 201) {
      throw new Error('Failed to create proposal for status update test');
    }
    
    const proposalId = createResponse.data.data.id;
    this.createdProposals.push(proposalId);
    
    // Update status to APROBADO
    const statusData = { status: 'APROBADO' };
    const response = await this.helpers.makeRequest('PATCH', `/propuestas/${proposalId}/estatus`, statusData, 'director');
    
    this.helpers.assertSuccess(response, 200);
    this.helpers.assertHasProperty(response.data, 'data');
    
    // Verify status was updated
    const attrs = response.data.data.attributes;
    if (attrs.estatus !== 'APROBADO') {
      throw new Error(`Expected status APROBADO, got ${attrs.estatus}`);
    }
  }

  async testGetProposalsByStatus() {
    const statuses = ['PENDIENTE', 'APROBADO', 'RECHAZADO', 'ACTUALIZAR'];
    
    for (const status of statuses) {
      const response = await this.helpers.makeRequest('GET', `/propuestas/estatus/${status}`, null, 'director');
      
      this.helpers.assertSuccess(response, 200);
      this.helpers.assertHasProperty(response.data, 'data');
      
      // Should be an array
      if (!Array.isArray(response.data.data)) {
        throw new Error(`Expected array for status ${status}`);
      }
    }
  }

  async testValidateProposalFields() {
    const proposalData = this.helpers.generateValidProposal();
    
    // Test required fields
    const requiredFields = [
      'academicTutorId',
      'internshipType',
      'companyLegalName',
      'companyTaxId',
      'projectName',
      'contactName',
      'supervisorName'
    ];
    
    for (const field of requiredFields) {
      const testData = { ...proposalData };
      delete testData[field];
      
      const response = await this.helpers.makeRequest('POST', '/propuestas', testData, 'alumno');
      this.helpers.assertError(response, 400);
    }
    
    // Test date validation
    const invalidDateData = {
      ...proposalData,
      projectStartDate: '2020-01-01', // Past date
      projectEndDate: '2020-01-15'    // End before start
    };
    
    const dateResponse = await this.helpers.makeRequest('POST', '/propuestas', invalidDateData, 'alumno');
    this.helpers.assertError(dateResponse, 400);
  }

  async testProposalBusinessRules() {
    // Test internship type validation
    const invalidInternshipData = {
      ...this.helpers.generateValidProposal(),
      internshipType: 'Invalid Type'
    };
    
    const response = await this.helpers.makeRequest('POST', '/propuestas', invalidInternshipData, 'alumno');
    this.helpers.assertError(response, 400);
    
    // Test RFC format validation
    const invalidRfcData = {
      ...this.helpers.generateValidProposal(),
      companyTaxId: 'INVALID_RFC'
    };
    
    const rfcResponse = await this.helpers.makeRequest('POST', '/propuestas', invalidRfcData, 'alumno');
    this.helpers.assertError(rfcResponse, 400);
    
    // Test postal code validation
    const invalidPostalData = {
      ...this.helpers.generateValidProposal(),
      companyPostalCode: '123' // Invalid format
    };
    
    const postalResponse = await this.helpers.makeRequest('POST', '/propuestas', invalidPostalData, 'alumno');
    this.helpers.assertError(postalResponse, 400);
  }

  async cleanup() {
    // Clean up created proposals if needed
    // Note: In a real test environment, you might want to delete test data
    console.log(`Created ${this.createdProposals.length} test proposals`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const proposalTests = new ProposalTests();
  proposalTests.runAllTests()
    .then(async results => {
      await proposalTests.cleanup();
      
      const failed = results.filter(r => !r.passed);
      if (failed.length > 0) {
        console.log('\n❌ Some proposal tests failed:');
        failed.forEach(f => console.log(`   - ${f.name}: ${f.error}`));
        process.exit(1);
      } else {
        console.log('\n✅ All proposal tests passed!');
        process.exit(0);
      }
    })
    .catch(error => {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = ProposalTests;
