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

// Ruta para obtener la convocatoria activa (información necesaria para el formulario)
propuestaRouter.get('/convocatoria-activa', (req, res) => getActiveConvocatoriaController.run(req, res));

// Ruta para obtener las propuestas del alumno autenticado
propuestaRouter.get('/mis-propuestas', (req, res) => getPropuestasByAlumnoController.run(req, res));

// Rutas CRUD para propuestas
propuestaRouter.post('/', (req, res) => createPropuestaController.run(req, res));
propuestaRouter.get('/', (req, res) => getPropuestasController.run(req, res));
propuestaRouter.get('/:uuid', (req, res) => getPropuestaController.run(req, res));
propuestaRouter.put('/:uuid', (req, res) => updatePropuestaController.run(req, res));