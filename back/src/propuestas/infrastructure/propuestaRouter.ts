import express from 'express';
import { 
    createPropuestaController,
    getPropuestasController,
    getPropuestaController,
    updatePropuestaController,
    getActiveConvocatoriaController,
    getPropuestasByStudentController
} from './dependencies';

export const propuestaRouter = express.Router();

propuestaRouter.use((req, res, next) => {
    console.log(`🔀 Propuesta Router: ${req.method} ${req.path}`);
    next();
});

propuestaRouter.get('/convocatoria-activa', (req, res) => {
    console.log('📋 Accediendo a convocatoria-activa');
    getActiveConvocatoriaController.run(req, res);
});

propuestaRouter.get('/mis-propuestas', (req, res) => {
    console.log('📄 Accediendo a mis-propuestas');
    getPropuestasByStudentController.run(req, res);  // CORREGIDO
});

propuestaRouter.post('/', (req, res) => {
    console.log('➕ Creando propuesta');
    createPropuestaController.run(req, res);
});

propuestaRouter.get('/', (req, res) => {
    console.log('📋 Obteniendo todas las propuestas');
    getPropuestasController.run(req, res);
});

propuestaRouter.get('/:uuid', (req, res) => {
    console.log(`📄 Obteniendo propuesta ${req.params.uuid}`);
    getPropuestaController.run(req, res);
});

propuestaRouter.put('/:uuid', (req, res) => {
    console.log(`✏️ Actualizando propuesta ${req.params.uuid}`);
    updatePropuestaController.run(req, res);
});

propuestaRouter.get('/test', (req, res) => {
    res.json({ message: 'Propuesta router funcionando correctamente' });
});