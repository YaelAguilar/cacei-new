// back/src/propuestas/infrastructure/dependencies.ts
// Casos de uso - IMPORTACIONES CORREGIDAS
import { CreatePropuestaUseCase } from "../application/createPropuestaUseCase";
import { GetPropuestasUseCase } from "../application/getPropuestasUseCase";
import { GetPropuestaUseCase } from "../application/getPropuestaUseCase";
import { GetPropuestasByStudentUseCase } from "../application/getPropuestasByStudentUseCase";
import { GetActiveConvocatoriaUseCase } from "../application/getActiveConvocatoriaUseCase";
import { UpdatePropuestaUseCase } from "../application/updatePropuestaUseCase";

// Controladores
import { CreatePropuestaController } from "./controllers/createPropuestaController";
import { GetPropuestasController } from "./controllers/getPropuestasController";
import { GetPropuestaController } from "./controllers/getPropuestaController";
import { UpdatePropuestaController } from "./controllers/updatePropuestaController";
import { GetActiveConvocatoriaController } from "./controllers/getActiveConvocatoriaController";
import { GetPropuestasByStudentController } from "./controllers/getPropuestasByStudentController";

// Repositorio
import { MysqlPropuestaRepository } from "./repositories/MysqlPropuestaRepository";

// Instancia del repositorio
const propuestaRepository = new MysqlPropuestaRepository();

// Casos de uso
const createPropuestaUseCase = new CreatePropuestaUseCase(propuestaRepository);
const getPropuestasUseCase = new GetPropuestasUseCase(propuestaRepository);
const getPropuestaUseCase = new GetPropuestaUseCase(propuestaRepository);
const updatePropuestaUseCase = new UpdatePropuestaUseCase(propuestaRepository);
const getActiveConvocatoriaUseCase = new GetActiveConvocatoriaUseCase(propuestaRepository);
const getPropuestasByStudentUseCase = new GetPropuestasByStudentUseCase(propuestaRepository);

// Controladores exportados
export const createPropuestaController = new CreatePropuestaController(createPropuestaUseCase);
export const getPropuestasController = new GetPropuestasController(getPropuestasUseCase);
export const getPropuestaController = new GetPropuestaController(getPropuestaUseCase);
export const updatePropuestaController = new UpdatePropuestaController(updatePropuestaUseCase);
export const getActiveConvocatoriaController = new GetActiveConvocatoriaController(getActiveConvocatoriaUseCase);
export const getPropuestasByStudentController = new GetPropuestasByStudentController(getPropuestasByStudentUseCase);