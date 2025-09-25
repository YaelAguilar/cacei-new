// src/propuestas-documentacion/infrastructure/dependencies.ts

// Casos de uso
import { UploadDocumentUseCase } from "../application/uploadDocumentUseCase";
import { GetDocumentsByProposalUseCase } from "../application/getDocumentsByProposalUseCase";
import { DownloadDocumentUseCase } from "../application/downloadDocumentUseCase";

// Controladores
import { UploadDocumentController } from "./controllers/uploadDocumentController";
import { GetDocumentsByProposalController } from "./controllers/getDocumentsByProposalController";
import { DownloadDocumentController } from "./controllers/downloadDocumentController";

// Repositorios
import { MysqlDocumentRepository } from "./repositories/MysqlDocumentRepository";
import { MysqlPropuestaRepository } from "../../propuestas/infrastructure/repositories/MysqlPropuestaRepository";

// Instancia del repositorio
const documentRepository = new MysqlDocumentRepository();
const propuestaRepository = new MysqlPropuestaRepository();

// Casos de uso
const uploadDocumentUseCase = new UploadDocumentUseCase(documentRepository, propuestaRepository);
const getDocumentsByProposalUseCase = new GetDocumentsByProposalUseCase(documentRepository, propuestaRepository);
const downloadDocumentUseCase = new DownloadDocumentUseCase(documentRepository, propuestaRepository);

// Controladores exportados
export const uploadDocumentController = new UploadDocumentController(uploadDocumentUseCase);
export const getDocumentsByProposalController = new GetDocumentsByProposalController(getDocumentsByProposalUseCase);
export const downloadDocumentController = new DownloadDocumentController(downloadDocumentUseCase);

