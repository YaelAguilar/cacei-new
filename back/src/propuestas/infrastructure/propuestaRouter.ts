import express from 'express';
import { 
    createPropuestaController,
    getPropuestasController,
    getPropuestaController,
    updatePropuestaController,
    getActiveConvocatoriaController,
    getPropuestasByStudentController,
    updateProposalStatusController,
    getPropuestasByStatusController
} from './dependencies';

export const propuestaRouter = express.Router();

propuestaRouter.use((req, res, next) => {
    console.log(`🔀 Propuesta Router: ${req.method} ${req.path}`);
    next();
});

// Ruta para obtener la convocatoria activa
propuestaRouter.get('/convocatoria-activa', (req, res) => {
    console.log('📋 Accediendo a convocatoria-activa');
    getActiveConvocatoriaController.run(req, res);
});

// Ruta para obtener propuestas del estudiante logueado
propuestaRouter.get('/mis-propuestas', (req, res) => {
    console.log('📄 Accediendo a mis-propuestas');
    getPropuestasByStudentController.run(req, res);
});

// Ruta para obtener propuestas por estatus
propuestaRouter.get('/estatus/:status', (req, res) => {
    console.log(`📊 Obteniendo propuestas con estatus ${req.params.status}`);
    getPropuestasByStatusController.run(req, res);
});

// Ruta para crear nueva propuesta
propuestaRouter.post('/', (req, res) => {
    console.log('➕ Creando propuesta');
    createPropuestaController.run(req, res);
});

// Ruta para obtener todas las propuestas
propuestaRouter.get('/', (req, res) => {
    console.log('📋 Obteniendo todas las propuestas');
    getPropuestasController.run(req, res);
});

// Ruta para obtener propuesta específica
propuestaRouter.get('/:uuid', (req, res) => {
    console.log(`📄 Obteniendo propuesta ${req.params.uuid}`);
    getPropuestaController.run(req, res);
});

// Ruta para actualizar propuesta completa
propuestaRouter.put('/:uuid', (req, res) => {
    console.log(`✏️ Actualizando propuesta ${req.params.uuid}`);
    updatePropuestaController.run(req, res);
});

// Ruta para actualizar solo el estatus de una propuesta
propuestaRouter.patch('/:uuid/estatus', (req, res) => {
    console.log(`📊 Actualizando estatus de propuesta ${req.params.uuid}`);
    updateProposalStatusController.run(req, res);
});

// Ruta de prueba
propuestaRouter.get('/test', (req, res) => {
    res.json({ 
        message: 'Propuesta router funcionando correctamente',
        endpoints: [
            'GET /convocatoria-activa',
            'GET /mis-propuestas', 
            'GET /estatus/:status',
            'POST /',
            'GET /',
            'GET /:uuid',
            'PUT /:uuid',
            'PATCH /:uuid/estatus'
        ]
    });
});