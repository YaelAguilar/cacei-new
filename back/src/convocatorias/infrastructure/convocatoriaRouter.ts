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

// ⚠️ IMPORTANTE: Las rutas específicas DEBEN ir ANTES que las rutas con parámetros

// Ruta para verificar si hay convocatoria activa
convocatoriaRouter.get('/active/check', checkActiveConvocatoriaController.run.bind(checkActiveConvocatoriaController));

// Ruta para obtener profesores disponibles
convocatoriaRouter.get('/profesores/disponibles', getProfesoresDisponiblesController.run.bind(getProfesoresDisponiblesController));

// Rutas CRUD para convocatorias (las rutas con parámetros van AL FINAL)
convocatoriaRouter.post('/', createConvocatoriaController.run.bind(createConvocatoriaController));
convocatoriaRouter.get('/', getConvocatoriasController.run.bind(getConvocatoriasController));

// ✅ Las rutas con parámetros van al final
convocatoriaRouter.get('/:uuid', getConvocatoriaController.run.bind(getConvocatoriaController));
convocatoriaRouter.put('/:uuid', updateConvocatoriaController.run.bind(updateConvocatoriaController));