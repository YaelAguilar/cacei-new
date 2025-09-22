// src/propuestas-comentarios/infrastructure/dependencies.ts

// Casos de uso
import { CreateCommentUseCase } from "../application/createCommentUseCase";
import { UpdateCommentUseCase } from "../application/updateCommentUseCase";
import { GetCommentsByProposalUseCase } from "../application/getCommentsByProposalUseCase";
import { GetCommentsByTutorUseCase } from "../application/getCommentsByTutorUseCase";
import { DeleteCommentUseCase } from "../application/deleteCommentUseCase";
import { ApproveProposalUseCase } from "../application/approveProposalUseCase"; // ✅ NUEVO

// Controladores
import { CreateCommentController } from "./controllers/createCommentController";
import { UpdateCommentController } from "./controllers/updateCommentController";
import { GetCommentsByProposalController } from "./controllers/getCommentsByProposalController";
import { GetCommentsByTutorController } from "./controllers/getCommentsByTutorController";
import { DeleteCommentController } from "./controllers/deleteCommentController";
import { ApproveProposalController } from "./controllers/approveProposalController"; // ✅ NUEVO

// Repositorio
import { MysqlCommentRepository } from "./repositories/MysqlCommentRepository";

// Instancia del repositorio
const commentRepository = new MysqlCommentRepository();

// Casos de uso
const createCommentUseCase = new CreateCommentUseCase(commentRepository);
const updateCommentUseCase = new UpdateCommentUseCase(commentRepository);
const getCommentsByProposalUseCase = new GetCommentsByProposalUseCase(commentRepository);
const getCommentsByTutorUseCase = new GetCommentsByTutorUseCase(commentRepository);
const deleteCommentUseCase = new DeleteCommentUseCase(commentRepository);
const approveProposalUseCase = new ApproveProposalUseCase(commentRepository); // ✅ NUEVO

// Controladores exportados
export const createCommentController = new CreateCommentController(createCommentUseCase);
export const updateCommentController = new UpdateCommentController(updateCommentUseCase);
export const getCommentsByProposalController = new GetCommentsByProposalController(getCommentsByProposalUseCase);
export const getCommentsByTutorController = new GetCommentsByTutorController(getCommentsByTutorUseCase);
export const deleteCommentController = new DeleteCommentController(deleteCommentUseCase);
export const approveProposalController = new ApproveProposalController(approveProposalUseCase); // ✅ NUEVO