// src/propuestas-comentarios/infrastructure/commentRouter.ts
import express from 'express';
import { 
    createCommentController,
    updateCommentController,
    getCommentsByProposalController,
    getCommentsByTutorController,
    approveProposalController,
    rejectProposalController,
    updateProposalController,
    checkTutorFinalVoteController
} from './dependencies';

export const commentRouter = express.Router();

// Middleware de logging
commentRouter.use((req, res, next) => {
    console.log(`🔀 Comment Router: ${req.method} ${req.path}`);
    next();
});

// ============================================================
// RUTAS DE COMENTARIOS
// ============================================================

/**
 * GET /propuestas/:proposalId/comentarios
 * Obtener todos los comentarios de una propuesta específica
 */
commentRouter.get('/propuestas/:proposalId/comentarios', (req, res) => {
    console.log('📋 Obteniendo comentarios de propuesta:', req.params.proposalId);
    getCommentsByProposalController.run(req, res);
});

/**
 * GET /mis-comentarios
 * Obtener todos los comentarios realizados por el tutor autenticado
 */
commentRouter.get('/mis-comentarios', (req, res) => {
    console.log('📋 Obteniendo mis comentarios como tutor');
    getCommentsByTutorController.run(req, res);
});

/**
 * POST /comentarios
 * Crear un nuevo comentario
 * Body: {
 *   proposalId: string,
 *   sectionName: string,
 *   subsectionName: string,
 *   commentText: string,
 *   voteStatus: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA'
 * }
 */
commentRouter.post('/comentarios', (req, res) => {
    console.log('➕ Creando nuevo comentario');
    createCommentController.run(req, res);
});

/**
 * PUT /comentarios/:uuid
 * Actualizar un comentario existente (solo si es ACTUALIZA)
 * Body: {
 *   commentText?: string,
 *   voteStatus?: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA'
 * }
 */
commentRouter.put('/comentarios/:uuid', (req, res) => {
    console.log(`✏️ Actualizando comentario ${req.params.uuid}`);
    updateCommentController.run(req, res);
});

/**
 * ✅ NUEVA RUTA: POST /aprobar-propuesta
 * Aprobar toda la propuesta sin necesidad de comentarios específicos
 * Body: {
 *   proposalId: string
 * }
 */
commentRouter.post('/aprobar-propuesta', (req, res) => {
    console.log('✅ Aprobando propuesta completa');
    approveProposalController.run(req, res);
});

/**
 * ✅ NUEVA RUTA: POST /rechazar-propuesta
 * Rechazar toda la propuesta sin necesidad de comentarios específicos
 * Body: {
 *   proposalId: string
 * }
 */
commentRouter.post('/rechazar-propuesta', (req, res) => {
    console.log('❌ Rechazando propuesta completa');
    rejectProposalController.run(req, res);
});

/**
 * ✅ NUEVA RUTA: POST /actualizar-propuesta
 * Solicitar actualización de toda la propuesta sin necesidad de comentarios específicos
 * Body: {
 *   proposalId: string
 * }
 */
commentRouter.post('/actualizar-propuesta', (req, res) => {
    console.log('🔄 Solicitando actualización de propuesta completa');
    updateProposalController.run(req, res);
});

/**
 * ✅ NUEVA RUTA: GET /propuestas/:proposalId/tutor-voto-final
 * Verificar si el tutor actual ya votó con voto final (APROBADO o RECHAZADO)
 */
commentRouter.get('/propuestas/:proposalId/tutor-voto-final', (req, res) => {
    console.log('🔍 Verificando voto final del tutor para propuesta:', req.params.proposalId);
    checkTutorFinalVoteController.run(req, res);
});

/**
 * DELETE /comentarios/:uuid
 * ❌ DESHABILITADO - Los comentarios no se pueden eliminar
 */
commentRouter.delete('/comentarios/:uuid', (req, res) => {
    console.log(`🚫 Intento de eliminar comentario ${req.params.uuid} - OPERACIÓN NO PERMITIDA`);
    res.status(403).json({
        errors: [{
            status: "403",
            title: "Operation not allowed",
            detail: "Los comentarios no se pueden eliminar una vez creados"
        }]
    });
});

// Ruta de prueba
commentRouter.get('/test', (req, res) => {
    res.json({ 
        message: 'Comment router funcionando correctamente',
        timestamp: new Date().toISOString(),
        features: [
            'Crear comentarios',
            'Actualizar comentarios (solo ACTUALIZA)',
            'Ver comentarios',
            'Aprobar propuesta completa',
            'Eliminación deshabilitada'
        ]
    });
});