// src/propuestas-comentarios/infrastructure/dependencies.ts

// Casos de uso
import { CreateCommentUseCase } from "../application/createCommentUseCase";
import { UpdateCommentUseCase } from "../application/updateCommentUseCase";
import { GetCommentsByProposalUseCase } from "../application/getCommentsByProposalUseCase";
import { GetCommentsByTutorUseCase } from "../application/getCommentsByTutorUseCase";
import { DeleteCommentUseCase } from "../application/deleteCommentUseCase";
import { ApproveProposalUseCase } from "../application/approveProposalUseCase"; // ✅ NUEVO
import { RejectProposalUseCase } from "../application/rejectProposalUseCase"; // ✅ NUEVO
import { UpdateProposalUseCase } from "../application/updateProposalUseCase"; // ✅ NUEVO
import { UpdateProposalStatusAfterCommentUseCase } from "../application/updateProposalStatusAfterCommentUseCase"; // ✅ NUEVO
import { ValidateCommentEditUseCase } from "../application/validateCommentEditUseCase"; // ✅ NUEVO
import { GetVotingHistoryUseCase } from "../application/getVotingHistoryUseCase"; // ✅ NUEVO
import { CheckTutorFinalVoteUseCase } from "../application/checkTutorFinalVoteUseCase"; // ✅ NUEVO

// Controladores
import { CreateCommentController } from "./controllers/createCommentController";
import { UpdateCommentController } from "./controllers/updateCommentController";
import { GetCommentsByProposalController } from "./controllers/getCommentsByProposalController";
import { GetCommentsByTutorController } from "./controllers/getCommentsByTutorController";
import { DeleteCommentController } from "./controllers/deleteCommentController";
import { ApproveProposalController } from "./controllers/approveProposalController"; // ✅ NUEVO
import { RejectProposalController } from "./controllers/rejectProposalController"; // ✅ NUEVO
import { UpdateProposalController } from "./controllers/updateProposalController"; // ✅ NUEVO
import { CheckTutorFinalVoteController } from "./controllers/checkTutorFinalVoteController"; // ✅ NUEVO

// Repositorios
import { MysqlCommentRepository } from "./repositories/MysqlCommentRepository";
import { MysqlPropuestaRepository } from "../../propuestas/infrastructure/repositories/MysqlPropuestaRepository";
import { CalculateProposalStatusUseCase } from "../../propuestas/application/calculateProposalStatusUseCase";

// Instancia del repositorio
const commentRepository = new MysqlCommentRepository();
const propuestaRepository = new MysqlPropuestaRepository();

// Casos de uso
const calculateProposalStatusUseCase = new CalculateProposalStatusUseCase(propuestaRepository, commentRepository);
const updateProposalStatusAfterCommentUseCase = new UpdateProposalStatusAfterCommentUseCase(
    calculateProposalStatusUseCase,
    propuestaRepository,
    commentRepository
);
const validateCommentEditUseCase = new ValidateCommentEditUseCase(commentRepository, propuestaRepository);
const getVotingHistoryUseCase = new GetVotingHistoryUseCase(commentRepository, propuestaRepository);

const createCommentUseCase = new CreateCommentUseCase(commentRepository, updateProposalStatusAfterCommentUseCase);
const updateCommentUseCase = new UpdateCommentUseCase(commentRepository, validateCommentEditUseCase, updateProposalStatusAfterCommentUseCase);
const getCommentsByProposalUseCase = new GetCommentsByProposalUseCase(commentRepository);
const getCommentsByTutorUseCase = new GetCommentsByTutorUseCase(commentRepository);
const deleteCommentUseCase = new DeleteCommentUseCase(commentRepository);
const approveProposalUseCase = new ApproveProposalUseCase(commentRepository); // ✅ NUEVO
const rejectProposalUseCase = new RejectProposalUseCase(commentRepository); // ✅ NUEVO
const updateProposalUseCase = new UpdateProposalUseCase(commentRepository); // ✅ NUEVO
const checkTutorFinalVoteUseCase = new CheckTutorFinalVoteUseCase(commentRepository); // ✅ NUEVO

// Controladores exportados
export const createCommentController = new CreateCommentController(createCommentUseCase);
export const updateCommentController = new UpdateCommentController(updateCommentUseCase);
export const getCommentsByProposalController = new GetCommentsByProposalController(getCommentsByProposalUseCase);
export const getCommentsByTutorController = new GetCommentsByTutorController(getCommentsByTutorUseCase);
export const deleteCommentController = new DeleteCommentController(deleteCommentUseCase);
export const approveProposalController = new ApproveProposalController(approveProposalUseCase); // ✅ NUEVO
export const rejectProposalController = new RejectProposalController(rejectProposalUseCase); // ✅ NUEVO
export const updateProposalController = new UpdateProposalController(updateProposalUseCase); // ✅ NUEVO
export const checkTutorFinalVoteController = new CheckTutorFinalVoteController(checkTutorFinalVoteUseCase); // ✅ NUEVO

// Exportar casos de uso adicionales
export { getVotingHistoryUseCase };
export { calculateProposalStatusUseCase };
export { updateProposalStatusAfterCommentUseCase };
export { validateCommentEditUseCase };