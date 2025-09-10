// Casos de uso
import { CreateConvocatoriaUseCase } from "../application/createConvocatoriaUseCase";
import { GetConvocatoriasUseCase } from "../application/getConvocatoriasUseCase";
import { GetConvocatoriaUseCase } from "../application/getConvocatoriaUseCase";
import { UpdateConvocatoriaUseCase } from "../application/updateConvocatoriaUseCase";
import { GetProfesoresDisponiblesUseCase } from "../application/getProfesoresDisponiblesUseCase";
import { DeactivateExpiredConvocatoriasUseCase } from "../application/deactivateExpiredConvocatoriasUseCase";
import { CheckActiveConvocatoriaUseCase } from "../application/checkActiveConvocatoriaUseCase";

// Controladores
import { CreateConvocatoriaController } from "./controllers/createConvocatoriaController";
import { GetConvocatoriasController } from "./controllers/getConvocatoriasController";
import { GetConvocatoriaController } from "./controllers/getConvocatoriaController";
import { UpdateConvocatoriaController } from "./controllers/updateConvocatoriaController";
import { GetProfesoresDisponiblesController } from "./controllers/getProfesoresDisponiblesController";
import { CheckActiveConvocatoriaController } from "./controllers/checkActiveConvocatoriaController";

// Repositorio y servicios
import { MysqlConvocatoriaRepository } from "./repositories/MysqlConvocatoriaRepository";
import { ConvocatoriaSchedulerService } from "./services/ConvocatoriaSchedulerService";

// Instancia del repositorio
const convocatoriaRepository = new MysqlConvocatoriaRepository();

// Casos de uso
const createConvocatoriaUseCase = new CreateConvocatoriaUseCase(convocatoriaRepository);
const getConvocatoriasUseCase = new GetConvocatoriasUseCase(convocatoriaRepository);
const getConvocatoriaUseCase = new GetConvocatoriaUseCase(convocatoriaRepository);
const updateConvocatoriaUseCase = new UpdateConvocatoriaUseCase(convocatoriaRepository);
const getProfesoresDisponiblesUseCase = new GetProfesoresDisponiblesUseCase(convocatoriaRepository);
const deactivateExpiredConvocatoriasUseCase = new DeactivateExpiredConvocatoriasUseCase(convocatoriaRepository);
const checkActiveConvocatoriaUseCase = new CheckActiveConvocatoriaUseCase(convocatoriaRepository);

// Servicio scheduler
const convocatoriaSchedulerService = new ConvocatoriaSchedulerService(deactivateExpiredConvocatoriasUseCase);

// Controladores exportados
export const createConvocatoriaController = new CreateConvocatoriaController(createConvocatoriaUseCase);
export const getConvocatoriasController = new GetConvocatoriasController(getConvocatoriasUseCase);
export const getConvocatoriaController = new GetConvocatoriaController(getConvocatoriaUseCase);
export const updateConvocatoriaController = new UpdateConvocatoriaController(updateConvocatoriaUseCase);
export const getProfesoresDisponiblesController = new GetProfesoresDisponiblesController(getProfesoresDisponiblesUseCase);
export const checkActiveConvocatoriaController = new CheckActiveConvocatoriaController(checkActiveConvocatoriaUseCase);

// Exportar scheduler para usar en index.ts
export const convocatoriaScheduler = convocatoriaSchedulerService;