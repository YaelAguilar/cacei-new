
// Casos de uso
import { CreatePropuestaUseCase } from "../application/createPropuestaUseCase";
import { GetPropuestasUseCase, GetPropuestaUseCase, GetPropuestasByAlumnoUseCase, GetActiveConvocatoriaUseCase } from "../application/getPropuestasUseCase";
import { UpdatePropuestaUseCase } from "../application/updatePropuestaUseCase";

// Controladores
import { CreatePropuestaController } from "./controllers/createPropuestaController";
import { GetPropuestasController } from "./controllers/getPropuestasController";
import { GetPropuestaController } from "./controllers/getPropuestaController";
import { UpdatePropuestaController } from "./controllers/updatePropuestaController";
import { GetActiveConvocatoriaController } from "./controllers/getActiveConvocatoriaController";
import { GetPropuestasByAlumnoController } from "./controllers/getPropuestasByAlumnoController";

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
const getPropuestasByAlumnoUseCase = new GetPropuestasByAlumnoUseCase(propuestaRepository);

// Controladores exportados
export const createPropuestaController = new CreatePropuestaController(createPropuestaUseCase);
export const getPropuestasController = new GetPropuestasController(getPropuestasUseCase);
export const getPropuestaController = new GetPropuestaController(getPropuestaUseCase);
export const updatePropuestaController = new UpdatePropuestaController(updatePropuestaUseCase);
export const getActiveConvocatoriaController = new GetActiveConvocatoriaController(getActiveConvocatoriaUseCase);
export const getPropuestasByAlumnoController = new GetPropuestasByAlumnoController(getPropuestasByAlumnoUseCase);