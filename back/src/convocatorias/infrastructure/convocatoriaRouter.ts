import express from 'express';
import { 
    createConvocatoriaController,
    getConvocatoriasController,
    getConvocatoriaController,
    updateConvocatoriaController,
    getProfesoresDisponiblesController,
    checkActiveConvocatoriaController
} from './dependencies';

export const convocatoriaRouter = express.Router();

// Ruta para verificar si hay convocatoria activa
convocatoriaRouter.get('/active/check', checkActiveConvocatoriaController.run.bind(checkActiveConvocatoriaController));

// Ruta para obtener profesores disponibles
convocatoriaRouter.get('/profesores/disponibles', getProfesoresDisponiblesController.run.bind(getProfesoresDisponiblesController));

// Rutas para convocatorias
convocatoriaRouter.post('/', createConvocatoriaController.run.bind(createConvocatoriaController));
convocatoriaRouter.get('/', getConvocatoriasController.run.bind(getConvocatoriasController));
convocatoriaRouter.get('/:uuid', getConvocatoriaController.run.bind(getConvocatoriaController));
convocatoriaRouter.put('/:uuid', updateConvocatoriaController.run.bind(updateConvocatoriaController));