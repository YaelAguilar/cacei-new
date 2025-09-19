// src/propuestas-comentarios/infrastructure/commentRouter.ts
import express from 'express';
import { 
    createCommentController,
    updateCommentController,
    getCommentsByProposalController,
    getCommentsByTutorController,
    deleteCommentController
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
 *   proposalId: number,
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
 * Actualizar un comentario existente
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
 * DELETE /comentarios/:uuid
 * Eliminar (soft delete) un comentario
 */
commentRouter.delete('/comentarios/:uuid', (req, res) => {
    console.log(`🗑️ Eliminando comentario ${req.params.uuid}`);
    deleteCommentController.run(req, res);
});

// Ruta de prueba
commentRouter.get('/test', (req, res) => {
    res.json({ 
        message: 'Comment router funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});