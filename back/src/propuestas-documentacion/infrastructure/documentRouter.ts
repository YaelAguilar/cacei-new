// src/propuestas-documentacion/infrastructure/documentRouter.ts
import { Router } from 'express';
import multer from 'multer';
import { uploadDocumentController, getDocumentsByProposalController, downloadDocumentController } from './dependencies';

const router = Router();

// Configuración de multer para manejo de archivos
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB máximo
        files: 1 // Solo un archivo por vez
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
        // ✅ CAMBIO AQUÍ: La firma de cb es (error, boolean)
            cb(new Error('Solo se permiten archivos PDF')); // No necesita el segundo argumento
        }
    }
});

// Middleware de autenticación (asumiendo que existe)
// const authMiddleware = require('../../utils/middlewares/authMiddleware');

// Rutas
router.post('/upload', upload.single('document'), uploadDocumentController.run.bind(uploadDocumentController));
router.get('/proposal/:proposalId', getDocumentsByProposalController.run.bind(getDocumentsByProposalController));
router.get('/download/:documentUuid', downloadDocumentController.run.bind(downloadDocumentController));

export default router;




