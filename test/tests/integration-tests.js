// Integration Tests - End-to-End Workflows
const TestHelpers = require('../utils/test-helpers');
const config = require('../config');

class IntegrationTests {
  constructor() {
    this.helpers = new TestHelpers();
    this.testData = {
      proposals: [],
      comments: []
    };
  }

  async runAllTests() {
    const tests = {
      'Complete student workflow': () => this.testCompleteStudentWorkflow(),
      'Complete tutor evaluation workflow': () => this.testCompleteTutorEvaluationWorkflow(),
      'Proposal approval workflow': () => this.testProposalApprovalWorkflow(),
      'Proposal rejection workflow': () => this.testProposalRejectionWorkflow(),
      'Proposal update workflow': () => this.testProposalUpdateWorkflow(),
      'Multiple tutors evaluation': () => this.testMultipleTutorsEvaluation(),
      'Concurrent proposal creation': () => this.testConcurrentProposalCreation(),
      'Role-based access control': () => this.testRoleBasedAccessControl(),
      'Data consistency across operations': () => this.testDataConsistency(),
      'Error handling and recovery': () => this.testErrorHandlingAndRecovery()
    };

    return await this.helpers.runTestSuite('Integration Tests', tests);
  }

  async testCompleteStudentWorkflow() {
    // 1. Student logs in
    await this.helpers.login('alumno');
    
    // 2. Check for active convocatoria
    const convocatoriaResponse = await this.helpers.makeRequest('GET', '/propuestas/convocatoria-activa', null, 'alumno');
    this.helpers.assertSuccess(convocatoriaResponse, 200);
    
    // 3. Create a proposal
    const proposalData = this.helpers.generateValidProposal();
    const createResponse = await this.helpers.makeRequest('POST', '/propuestas', proposalData, 'alumno');
    this.helpers.assertSuccess(createResponse, 201);
    
    const proposalId = createResponse.data.data.id;
    this.testData.proposals.push(proposalId);
    
    // 4. Verify proposal was created with PENDIENTE status
    const attrs = createResponse.data.data.attributes;
    if (attrs.estatus !== 'PENDIENTE') {
      throw new Error(`Expected PENDIENTE status, got ${attrs.estatus}`);
    }
    
    // 5. Get student's proposals
    const proposalsResponse = await this.helpers.makeRequest('GET', '/propuestas/mis-propuestas', null, 'alumno');
    this.helpers.assertSuccess(proposalsResponse, 200);
    
    // 6. Try to create another proposal (should fail)
    const duplicateResponse = await this.helpers.makeRequest('POST', '/propuestas', proposalData, 'alumno');
    this.helpers.assertError(duplicateResponse, 400);
    
    // 7. Update the proposal
    const updateData = {
      projectName: 'Updated Project Name',
      projectProblemDescription: 'Updated problem description'
    };
    
    const updateResponse = await this.helpers.makeRequest('PUT', `/propuestas/${proposalId}`, updateData, 'alumno');
    this.helpers.assertSuccess(updateResponse, 200);
  }

  async testCompleteTutorEvaluationWorkflow() {
    // 1. Create a proposal first
    const proposalId = await this.createTestProposal();
    
    // 2. Tutor logs in and evaluates proposal
    await this.helpers.login('ptc');
    
    // 3. Get proposal details
    const proposalResponse = await this.helpers.makeRequest('GET', `/propuestas/${proposalId}`, null, 'ptc');
    this.helpers.assertSuccess(proposalResponse, 200);
    
    // 4. Create comment on specific section
    const commentData = {
      proposalId: proposalId,
      sectionName: 'Datos del Proyecto',
      subsectionName: 'Objetivo General',
      commentText: 'El objetivo general está bien definido y es alcanzable para el estudiante.',
      voteStatus: 'ACEPTADO'
    };
    
    const commentResponse = await this.helpers.makeRequest('POST', '/comentarios', commentData, 'ptc');
    this.helpers.assertSuccess(commentResponse, 201);
    
    const commentId = commentResponse.data.data.id;
    this.testData.comments.push(commentId);
    
    // 5. Get comments for the proposal
    const commentsResponse = await this.helpers.makeRequest('GET', `/propuestas/${proposalId}/comentarios`, null, 'ptc');
    this.helpers.assertSuccess(commentsResponse, 200);
    
    // 6. Update comment (if it's ACTUALIZA)
    const updateCommentData = {
      proposalId: proposalId,
      sectionName: 'Datos del Proyecto',
      subsectionName: 'Objetivo General',
      commentText: 'Comentario actualizado con más detalles.',
      voteStatus: 'ACTUALIZA'
    };
    
    const updateCommentResponse = await this.helpers.makeRequest('POST', '/comentarios', updateCommentData, 'ptc');
    this.helpers.assertError(updateCommentResponse, 400); // Should fail due to duplicate section
    
    // 7. Get tutor's comments
    const tutorCommentsResponse = await this.helpers.makeRequest('GET', '/mis-comentarios', null, 'ptc');
    this.helpers.assertSuccess(tutorCommentsResponse, 200);
  }

  async testProposalApprovalWorkflow() {
    // 1. Create a proposal
    const proposalId = await this.createTestProposal();
    
    // 2. Multiple tutors approve the proposal
    const tutors = ['ptc', 'director', 'ptcCarlos'];
    
    for (const tutor of tutors) {
      await this.helpers.login(tutor);
      
      const approveData = { proposalId: proposalId };
      const response = await this.helpers.makeRequest('POST', '/aprobar-propuesta', approveData, tutor);
      this.helpers.assertSuccess(response, 200);
    }
    
    // 3. Verify proposal status is APROBADO
    await this.helpers.login('alumno');
    const proposalResponse = await this.helpers.makeRequest('GET', `/propuestas/${proposalId}`, null, 'alumno');
    this.helpers.assertSuccess(proposalResponse, 200);
    
    const attrs = proposalResponse.data.data.attributes;
    if (attrs.estatus !== 'APROBADO') {
      throw new Error(`Expected APROBADO status, got ${attrs.estatus}`);
    }
    
    // 4. Verify student can no longer edit the proposal
    const updateData = { projectName: 'Trying to update approved proposal' };
    const updateResponse = await this.helpers.makeRequest('PUT', `/propuestas/${proposalId}`, updateData, 'alumno');
    this.helpers.assertError(updateResponse, 400);
  }

  async testProposalRejectionWorkflow() {
    // 1. Create a proposal
    const proposalId = await this.createTestProposal();
    
    // 2. Multiple tutors reject the proposal
    const tutors = ['ptc', 'director', 'ptcMaria'];
    
    for (const tutor of tutors) {
      await this.helpers.login(tutor);
      
      const rejectData = { proposalId: proposalId };
      const response = await this.helpers.makeRequest('POST', '/rechazar-propuesta', rejectData, tutor);
      this.helpers.assertSuccess(response, 200);
    }
    
    // 3. Verify proposal status is RECHAZADO
    await this.helpers.login('alumno');
    const proposalResponse = await this.helpers.makeRequest('GET', `/propuestas/${proposalId}`, null, 'alumno');
    this.helpers.assertSuccess(proposalResponse, 200);
    
    const attrs = proposalResponse.data.data.attributes;
    if (attrs.estatus !== 'RECHAZADO') {
      throw new Error(`Expected RECHAZADO status, got ${attrs.estatus}`);
    }
    
    // 4. Verify student can create a new proposal (rejected proposals allow new ones)
    const newProposalData = this.helpers.generateValidProposal();
    const newProposalResponse = await this.helpers.makeRequest('POST', '/propuestas', newProposalData, 'alumno');
    this.helpers.assertSuccess(newProposalResponse, 201);
    
    this.testData.proposals.push(newProposalResponse.data.data.id);
  }

  async testProposalUpdateWorkflow() {
    // 1. Create a proposal
    const proposalId = await this.createTestProposal();
    
    // 2. Tutor requests update
    await this.helpers.login('ptc');
    const updateData = { proposalId: proposalId };
    const updateResponse = await this.helpers.makeRequest('POST', '/actualizar-propuesta', updateData, 'ptc');
    this.helpers.assertSuccess(updateResponse, 200);
    
    // 3. Verify proposal status is ACTUALIZAR
    await this.helpers.login('alumno');
    const proposalResponse = await this.helpers.makeRequest('GET', `/propuestas/${proposalId}`, null, 'alumno');
    this.helpers.assertSuccess(proposalResponse, 200);
    
    const attrs = proposalResponse.data.data.attributes;
    if (attrs.estatus !== 'ACTUALIZAR') {
      throw new Error(`Expected ACTUALIZAR status, got ${attrs.estatus}`);
    }
    
    // 4. Student can edit the proposal
    const editData = {
      projectName: 'Updated Project Name After Tutor Request',
      projectProblemDescription: 'Updated description based on tutor feedback'
    };
    
    const editResponse = await this.helpers.makeRequest('PUT', `/propuestas/${proposalId}`, editData, 'alumno');
    this.helpers.assertSuccess(editResponse, 200);
    
    // 5. Student cannot create new proposal while one is in ACTUALIZAR status
    const newProposalData = this.helpers.generateValidProposal();
    const newProposalResponse = await this.helpers.makeRequest('POST', '/propuestas', newProposalData, 'alumno');
    this.helpers.assertError(newProposalResponse, 400);
  }

  async testMultipleTutorsEvaluation() {
    // 1. Create a proposal
    const proposalId = await this.createTestProposal();
    
    // 2. Different tutors add comments to different sections
    const tutors = [
      { user: 'ptc', section: 'Datos del Proyecto', vote: 'ACEPTADO' },
      { user: 'director', section: 'Información de la Empresa', vote: 'ACEPTADO' },
      { user: 'ptcCarlos', section: 'Supervisor del Proyecto', vote: 'ACTUALIZA' }
    ];
    
    for (const tutor of tutors) {
      await this.helpers.login(tutor.user);
      
      const commentData = {
        proposalId: proposalId,
        sectionName: tutor.section,
        subsectionName: 'General',
        commentText: `Comentario del tutor ${tutor.user} en la sección ${tutor.section}.`,
        voteStatus: tutor.vote
      };
      
      const response = await this.helpers.makeRequest('POST', '/comentarios', commentData, tutor.user);
      this.helpers.assertSuccess(response, 201);
      
      this.testData.comments.push(response.data.data.id);
    }
    
    // 3. Verify proposal status is ACTUALIZAR (due to one ACTUALIZA vote)
    await this.helpers.login('alumno');
    const proposalResponse = await this.helpers.makeRequest('GET', `/propuestas/${proposalId}`, null, 'alumno');
    this.helpers.assertSuccess(proposalResponse, 200);
    
    const attrs = proposalResponse.data.data.attributes;
    if (attrs.estatus !== 'ACTUALIZAR') {
      throw new Error(`Expected ACTUALIZAR status due to ACTUALIZA vote, got ${attrs.estatus}`);
    }
  }

  async testConcurrentProposalCreation() {
    // Test creating multiple proposals simultaneously
    const promises = [];
    
    for (let i = 0; i < 3; i++) {
      const proposalData = this.helpers.generateValidProposal();
      proposalData.projectName = `Concurrent Test Proposal ${i + 1}`;
      
      promises.push(
        this.helpers.makeRequest('POST', '/propuestas', proposalData, 'alumno')
      );
    }
    
    const responses = await Promise.all(promises);
    
    // Only one should succeed (due to unique constraint)
    const successfulResponses = responses.filter(r => r.status === 201);
    const failedResponses = responses.filter(r => r.status === 400);
    
    if (successfulResponses.length !== 1) {
      throw new Error(`Expected exactly 1 successful proposal creation, got ${successfulResponses.length}`);
    }
    
    if (failedResponses.length !== 2) {
      throw new Error(`Expected exactly 2 failed proposal creations, got ${failedResponses.length}`);
    }
    
    // Store the successful proposal
    this.testData.proposals.push(successfulResponses[0].data.data.id);
  }

  async testRoleBasedAccessControl() {
    // 1. Test student access
    await this.helpers.login('alumno');
    
    // Student can access their own proposals
    const studentProposals = await this.helpers.makeRequest('GET', '/propuestas/mis-propuestas', null, 'alumno');
    this.helpers.assertSuccess(studentProposals, 200);
    
    // Student cannot access all proposals
    const allProposals = await this.helpers.makeRequest('GET', '/propuestas', null, 'alumno');
    this.helpers.assertError(allProposals, 403);
    
    // 2. Test tutor access
    await this.helpers.login('ptc');
    
    // Tutor can access proposals by status
    const pendingProposals = await this.helpers.makeRequest('GET', '/propuestas/estatus/PENDIENTE', null, 'ptc');
    this.helpers.assertSuccess(pendingProposals, 200);
    
    // Tutor can create comments
    const proposalId = await this.createTestProposal();
    const commentData = {
      proposalId: proposalId,
      sectionName: 'Datos del Proyecto',
      subsectionName: 'Objetivo General',
      commentText: 'Test comment for role-based access control.',
      voteStatus: 'ACEPTADO'
    };
    
    const commentResponse = await this.helpers.makeRequest('POST', '/comentarios', commentData, 'ptc');
    this.helpers.assertSuccess(commentResponse, 201);
    
    this.testData.comments.push(commentResponse.data.data.id);
    
    // 3. Test director access
    await this.helpers.login('director');
    
    // Director can approve/reject proposals
    const approveData = { proposalId: proposalId };
    const approveResponse = await this.helpers.makeRequest('POST', '/aprobar-propuesta', approveData, 'director');
    this.helpers.assertSuccess(approveResponse, 200);
  }

  async testDataConsistency() {
    // 1. Create a proposal
    const proposalId = await this.createTestProposal();
    
    // 2. Update proposal
    const updateData = {
      projectName: 'Consistency Test Project',
      projectProblemDescription: 'Updated for consistency test'
    };
    
    const updateResponse = await this.helpers.makeRequest('PUT', `/propuestas/${proposalId}`, updateData, 'alumno');
    this.helpers.assertSuccess(updateResponse, 200);
    
    // 3. Verify data consistency across different endpoints
    const directResponse = await this.helpers.makeRequest('GET', `/propuestas/${proposalId}`, null, 'alumno');
    const listResponse = await this.helpers.makeRequest('GET', '/propuestas/mis-propuestas', null, 'alumno');
    
    this.helpers.assertSuccess(directResponse, 200);
    this.helpers.assertSuccess(listResponse, 200);
    
    // Compare data
    const directAttrs = directResponse.data.data.attributes;
    const listAttrs = listResponse.data.data.find(p => p.id === proposalId)?.attributes;
    
    if (!listAttrs) {
      throw new Error('Proposal not found in list response');
    }
    
    if (directAttrs.datosDelProyecto?.nombreDelProyecto !== listAttrs.datosDelProyecto?.nombreDelProyecto) {
      throw new Error('Data inconsistency between direct and list endpoints');
    }
  }

  async testErrorHandlingAndRecovery() {
    // 1. Test invalid proposal ID
    const invalidResponse = await this.helpers.makeRequest('GET', '/propuestas/invalid-uuid', null, 'alumno');
    this.helpers.assertError(invalidResponse, 404);
    
    // 2. Test invalid comment data
    const invalidCommentData = {
      proposalId: 'invalid-uuid',
      sectionName: '',
      commentText: 'Too short',
      voteStatus: 'INVALID'
    };
    
    const invalidCommentResponse = await this.helpers.makeRequest('POST', '/comentarios', invalidCommentData, 'ptc');
    this.helpers.assertError(invalidCommentResponse, 400);
    
    // 3. Test recovery from network error simulation
    // (In a real test, you might simulate network timeouts or connection issues)
    
    // 4. Test graceful degradation
    const proposalsResponse = await this.helpers.makeRequest('GET', '/propuestas/mis-propuestas', null, 'alumno');
    this.helpers.assertSuccess(proposalsResponse, 200);
    
    // Should return empty array rather than error if no proposals exist
    if (!Array.isArray(proposalsResponse.data.data)) {
      throw new Error('Expected array response even when no proposals exist');
    }
  }

  // Helper method
  async createTestProposal() {
    const proposalData = this.helpers.generateValidProposal();
    const response = await this.helpers.makeRequest('POST', '/propuestas', proposalData, 'alumno');
    
    if (response.status !== 201) {
      throw new Error('Failed to create test proposal');
    }
    
    const proposalId = response.data.data.id;
    this.testData.proposals.push(proposalId);
    return proposalId;
  }

  async cleanup() {
    console.log(`Created ${this.testData.proposals.length} test proposals`);
    console.log(`Created ${this.testData.comments.length} test comments`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const integrationTests = new IntegrationTests();
  integrationTests.runAllTests()
    .then(async results => {
      await integrationTests.cleanup();
      
      const failed = results.filter(r => !r.passed);
      if (failed.length > 0) {
        console.log('\n❌ Some integration tests failed:');
        failed.forEach(f => console.log(`   - ${f.name}: ${f.error}`));
        process.exit(1);
      } else {
        console.log('\n✅ All integration tests passed!');
        process.exit(0);
      }
    })
    .catch(error => {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = IntegrationTests;
