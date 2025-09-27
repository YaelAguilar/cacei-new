// Comment and Voting Tests
const TestHelpers = require('../utils/test-helpers');
const config = require('../config');

class CommentTests {
  constructor() {
    this.helpers = new TestHelpers();
    this.createdProposals = [];
    this.createdComments = [];
    this.existingProposalId = null;
  }

  async runAllTests() {
    // First, get existing proposal ID
    await this.getExistingProposalId();
    
    const tests = {
      'Create comment on proposal': () => this.testCreateComment(),
      'Create comment with invalid data': () => this.testCreateInvalidComment(),
      'Create duplicate comment in same section': () => this.testCreateDuplicateComment(),
      'Update comment (ACTUALIZA only)': () => this.testUpdateComment(),
      'Get comments by proposal': () => this.testGetCommentsByProposal(),
      'Get comments by tutor': () => this.testGetCommentsByTutor(),
      'Approve proposal completely': () => this.testApproveProposal(),
      'Reject proposal completely': () => this.testRejectProposal(),
      'Request proposal update': () => this.testRequestProposalUpdate(),
      'Test voting business rules': () => this.testVotingBusinessRules(),
      'Test proposal status calculation': () => this.testProposalStatusCalculation(),
      'Test tutor final vote check': () => this.testTutorFinalVoteCheck()
    };

    return await this.helpers.runTestSuite('Comment Tests', tests);
  }

  async getExistingProposalId() {
    try {
      await this.helpers.login('alumno');
      const response = await this.helpers.makeRequest('GET', '/propuestas/mis-propuestas', null, 'alumno');
      
      if (response.status === 200 && response.data.data && response.data.data.length > 0) {
        this.existingProposalId = response.data.data[0].id;
        console.log(`📋 Using existing proposal: ${this.existingProposalId}`);
        return this.existingProposalId;
      }
    } catch (error) {
      console.error('Error getting existing proposal:', error.message);
    }
    
    throw new Error('No existing proposal found for testing');
  }

  async testCreateComment() {
    // Use existing proposal
    if (!this.existingProposalId) {
      throw new Error('No existing proposal available for testing');
    }
    
    const commentData = {
      proposalId: this.existingProposalId,
      sectionName: 'Datos del Proyecto',
      subsectionName: 'Objetivo General',
      commentText: 'El objetivo general está bien definido y es alcanzable.',
      voteStatus: 'ACEPTADO'
    };
    
    const response = await this.helpers.makeRequest('POST', '/comentarios', commentData, 'ptc');
    
    this.helpers.assertSuccess(response, 201);
    this.helpers.assertHasProperty(response.data, 'data');
    this.helpers.assertHasProperty(response.data.data, 'id');
    this.helpers.assertHasProperty(response.data.data, 'attributes');
    
    const attrs = response.data.data.attributes;
    this.helpers.assertHasProperty(attrs, 'voteStatus');
    this.helpers.assertHasProperty(attrs, 'commentText');
    this.helpers.assertHasProperty(attrs, 'sectionName');
    this.helpers.assertHasProperty(attrs, 'subsectionName');
    
    this.createdComments.push(response.data.data.id);
  }

  async testCreateInvalidComment() {
    const invalidCommentData = {
      proposalId: '00000000-0000-0000-0000-000000000000', // Valid UUID format but non-existent
      sectionName: '',
      subsectionName: '',
      commentText: 'Too short',
      voteStatus: 'INVALID'
    };
    
    const response = await this.helpers.makeRequest('POST', '/comentarios', invalidCommentData, 'ptc');
    
    // The system returns 404 for non-existent proposals, which is correct
    this.helpers.assertError(response, 404);
    this.helpers.assertHasProperty(response.data, 'errors');
  }

  async testCreateDuplicateComment() {
    // Use existing proposal
    if (!this.existingProposalId) {
      throw new Error('No existing proposal available for testing');
    }
    
    const commentData = {
      proposalId: this.existingProposalId,
      sectionName: 'Datos del Proyecto',
      subsectionName: 'Objetivo General',
      commentText: 'Primer comentario en esta sección.',
      voteStatus: 'ACEPTADO'
    };
    
    // Create first comment
    const firstResponse = await this.helpers.makeRequest('POST', '/comentarios', commentData, 'ptc');
    this.helpers.assertSuccess(firstResponse, 201);
    this.createdComments.push(firstResponse.data.data.id);
    
    // Try to create second comment in same section (should fail)
    const secondCommentData = {
      ...commentData,
      subsectionName: 'Objetivos Específicos',
      commentText: 'Segundo comentario en la misma sección.'
    };
    
    const secondResponse = await this.helpers.makeRequest('POST', '/comentarios', secondCommentData, 'ptc');
    this.helpers.assertError(secondResponse, 400);
    
    // Verify error message mentions duplicate
    const errorMessage = secondResponse.data.errors[0].detail;
    if (!errorMessage.includes('Ya existe un comentario') && !errorMessage.includes('duplicate')) {
      throw new Error(`Expected duplicate comment error, got: ${errorMessage}`);
    }
  }

  async testUpdateComment() {
    // First create a proposal and comment
    const proposalId = await this.createTestProposal();
    const commentId = await this.createTestComment(proposalId, 'ACTUALIZA');
    
    const updateData = {
      commentText: 'Comentario actualizado con más detalles.',
      voteStatus: 'ACEPTADO'
    };
    
    const response = await this.helpers.makeRequest('PUT', `/comentarios/${commentId}`, updateData, 'ptc');
    
    this.helpers.assertSuccess(response, 200);
    this.helpers.assertHasProperty(response.data, 'data');
    
    // Verify the update
    const attrs = response.data.data.attributes;
    if (attrs.comment_text !== updateData.commentText) {
      throw new Error('Comment text was not updated correctly');
    }
    if (attrs.vote_status !== updateData.voteStatus) {
      throw new Error('Vote status was not updated correctly');
    }
  }

  async testGetCommentsByProposal() {
    // First create a proposal and some comments
    const proposalId = await this.createTestProposal();
    await this.createTestComment(proposalId, 'ACEPTADO');
    await this.createTestComment(proposalId, 'RECHAZADO');
    
    const response = await this.helpers.makeRequest('GET', `/propuestas/${proposalId}/comentarios`, null, 'ptc');
    
    this.helpers.assertSuccess(response, 200);
    this.helpers.assertHasProperty(response.data, 'data');
    
    // Should be an array with at least 2 comments
    if (!Array.isArray(response.data.data)) {
      throw new Error('Expected array of comments');
    }
    if (response.data.data.length < 2) {
      throw new Error(`Expected at least 2 comments, got ${response.data.data.length}`);
    }
  }

  async testGetCommentsByTutor() {
    // Create some comments first
    const proposalId = await this.createTestProposal();
    await this.createTestComment(proposalId, 'ACEPTADO');
    
    const response = await this.helpers.makeRequest('GET', '/mis-comentarios', null, 'ptc');
    
    this.helpers.assertSuccess(response, 200);
    this.helpers.assertHasProperty(response.data, 'data');
    
    // Should be an array
    if (!Array.isArray(response.data.data)) {
      throw new Error('Expected array of comments');
    }
  }

  async testApproveProposal() {
    // First create a proposal
    const proposalId = await this.createTestProposal();
    
    const approveData = {
      proposalId: proposalId
    };
    
    const response = await this.helpers.makeRequest('POST', '/aprobar-propuesta', approveData, 'ptc');
    
    this.helpers.assertSuccess(response, 200);
    this.helpers.assertHasProperty(response.data, 'data');
    
    // Verify proposal status was updated
    const proposalResponse = await this.helpers.makeRequest('GET', `/propuestas/${proposalId}`, null, 'alumno');
    this.helpers.assertSuccess(proposalResponse, 200);
    
    const attrs = proposalResponse.data.data.attributes;
    if (attrs.estatus !== 'APROBADO') {
      throw new Error(`Expected status APROBADO, got ${attrs.estatus}`);
    }
  }

  async testRejectProposal() {
    // First create a proposal
    const proposalId = await this.createTestProposal();
    
    const rejectData = {
      proposalId: proposalId
    };
    
    const response = await this.helpers.makeRequest('POST', '/rechazar-propuesta', rejectData, 'director');
    
    this.helpers.assertSuccess(response, 200);
    this.helpers.assertHasProperty(response.data, 'data');
    
    // Verify proposal status was updated
    const proposalResponse = await this.helpers.makeRequest('GET', `/propuestas/${proposalId}`, null, 'alumno');
    this.helpers.assertSuccess(proposalResponse, 200);
    
    const attrs = proposalResponse.data.data.attributes;
    if (attrs.estatus !== 'RECHAZADO') {
      throw new Error(`Expected status RECHAZADO, got ${attrs.estatus}`);
    }
  }

  async testRequestProposalUpdate() {
    // First create a proposal
    const proposalId = await this.createTestProposal();
    
    const updateData = {
      proposalId: proposalId
    };
    
    const response = await this.helpers.makeRequest('POST', '/actualizar-propuesta', updateData, 'ptc');
    
    this.helpers.assertSuccess(response, 200);
    this.helpers.assertHasProperty(response.data, 'data');
    
    // Verify proposal status was updated
    const proposalResponse = await this.helpers.makeRequest('GET', `/propuestas/${proposalId}`, null, 'alumno');
    this.helpers.assertSuccess(proposalResponse, 200);
    
    const attrs = proposalResponse.data.data.attributes;
    if (attrs.estatus !== 'ACTUALIZAR') {
      throw new Error(`Expected status ACTUALIZAR, got ${attrs.estatus}`);
    }
  }

  async testVotingBusinessRules() {
    // Test comment text length validation
    const proposalId = await this.createTestProposal();
    
    const shortCommentData = {
      proposalId: proposalId,
      sectionName: 'Datos del Proyecto',
      subsectionName: 'Objetivo General',
      commentText: 'Short', // Less than 10 characters
      voteStatus: 'ACEPTADO'
    };
    
    const response = await this.helpers.makeRequest('POST', '/comentarios', shortCommentData, 'ptc');
    this.helpers.assertError(response, 400);
    
    // Test invalid vote status
    const invalidVoteData = {
      proposalId: proposalId,
      sectionName: 'Datos del Proyecto',
      subsectionName: 'Objetivo General',
      commentText: 'This is a valid comment with enough characters.',
      voteStatus: 'INVALID_STATUS'
    };
    
    const voteResponse = await this.helpers.makeRequest('POST', '/comentarios', invalidVoteData, 'ptc');
    this.helpers.assertError(voteResponse, 400);
  }

  async testProposalStatusCalculation() {
    // Create a proposal
    const proposalId = await this.createTestProposal();
    
    // Add 3 ACCEPTED votes
    for (let i = 0; i < 3; i++) {
      await this.createTestComment(proposalId, 'ACEPTADO', `Sección ${i + 1}`);
    }
    
    // Wait a bit for status calculation
    await this.helpers.wait(2000);
    
    // Check proposal status
    const response = await this.helpers.makeRequest('GET', `/propuestas/${proposalId}`, null, 'alumno');
    this.helpers.assertSuccess(response, 200);
    
    const attrs = response.data.data.attributes;
    if (attrs.estatus !== 'APROBADO') {
      throw new Error(`Expected status APROBADO after 3 accepted votes, got ${attrs.estatus}`);
    }
  }

  async testTutorFinalVoteCheck() {
    // Create a proposal and add a final vote
    const proposalId = await this.createTestProposal();
    await this.createTestComment(proposalId, 'ACEPTADO');
    
    // Check if tutor has final vote
    const response = await this.helpers.makeRequest('GET', `/propuestas/${proposalId}/tutor-voto-final`, null, 'ptc');
    
    this.helpers.assertSuccess(response, 200);
    this.helpers.assertHasProperty(response.data, 'data');
    this.helpers.assertHasProperty(response.data.data, 'hasFinalVote');
  }

  // Helper methods
  async createTestProposal() {
    const proposalData = this.helpers.generateValidProposal();
    const response = await this.helpers.makeRequest('POST', '/propuestas', proposalData, 'alumno');
    
    if (response.status !== 201) {
      throw new Error('Failed to create test proposal');
    }
    
    const proposalId = response.data.data.id;
    this.createdProposals.push(proposalId);
    return proposalId;
  }

  async createTestComment(proposalId, voteStatus, sectionName = 'Datos del Proyecto') {
    const commentData = {
      proposalId: proposalId,
      sectionName: sectionName,
      subsectionName: 'Objetivo General',
      commentText: `This is a test comment for ${voteStatus} vote.`,
      voteStatus: voteStatus
    };
    
    const response = await this.helpers.makeRequest('POST', '/comentarios', commentData, 'ptc');
    
    if (response.status !== 201) {
      throw new Error(`Failed to create test comment: ${response.data?.errors?.[0]?.detail || 'Unknown error'}`);
    }
    
    const commentId = response.data.data.id;
    this.createdComments.push(commentId);
    return commentId;
  }

  async cleanup() {
    console.log(`Created ${this.createdProposals.length} test proposals`);
    console.log(`Created ${this.createdComments.length} test comments`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const commentTests = new CommentTests();
  commentTests.runAllTests()
    .then(async results => {
      await commentTests.cleanup();
      
      const failed = results.filter(r => !r.passed);
      if (failed.length > 0) {
        console.log('\n❌ Some comment tests failed:');
        failed.forEach(f => console.log(`   - ${f.name}: ${f.error}`));
        process.exit(1);
      } else {
        console.log('\n✅ All comment tests passed!');
        process.exit(0);
      }
    })
    .catch(error => {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = CommentTests;
