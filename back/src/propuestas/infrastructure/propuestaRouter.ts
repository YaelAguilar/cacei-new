import express from 'express';
import { 
    createPropuestaController,
    getPropuestasController,
    getPropuestaController,
    updatePropuestaController,
    getActiveConvocatoriaController,
    getPropuestasByAlumnoController
} from './dependencies';

export const propuestaRouter = express.Router();

// Agregar logging para debugging
propuestaRouter.use((req, res, next) => {
    console.log(`🔀 Propuesta Router: ${req.method} ${req.path}`);
    next();
});

// Ruta para obtener la convocatoria activa (información necesaria para el formulario)
propuestaRouter.get('/convocatoria-activa', (req, res) => {
    console.log('📋 Accediendo a convocatoria-activa');
    getActiveConvocatoriaController.run(req, res);
});

// Ruta para obtener las propuestas del alumno autenticado
propuestaRouter.get('/mis-propuestas', (req, res) => {
    console.log('📄 Accediendo a mis-propuestas');
    getPropuestasByAlumnoController.run(req, res);
});

// Rutas CRUD para propuestas
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

// Ruta de test para verificar que el router funciona
propuestaRouter.get('/test', (req, res) => {
    res.json({ message: 'Propuesta router funcionando correctamente' });
});