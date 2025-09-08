// Casos de uso
import { CreateSubMenuUseCase } from "../application/createSubMenuUseCase";
import { GetSubMenuUseCase } from "../application/getSubMenuUseCase";
import { UpdateSubMenuUseCase } from "../application/updateSubMenuUseCase";
import { DeleteSubMenuUseCase } from "../application/deleteSubMenuUseCase";
import { ToggleSubmenuStatusUseCase } from "../application/toggleSubmenuStatusUseCase";

// Controladores
import { CreateSubMenuController } from "./controllers/createSubMenuController";
import { DeleteSubMenuController } from "./controllers/deleteSubMenuController";
import { GetSubMenuController } from "./controllers/getSubMenuController";
import { UpdateSubMenuController } from "./controllers/updateSubMenuController";
import { ToggleSubmenuStatusController } from "./controllers/toggleSubmenuStatusController";


import { MysqlSubMenuRepository } from "./repositories/mysqlSubMenuRepository";

const submenuRepository = new MysqlSubMenuRepository();

const createSubMenuUseCase = new CreateSubMenuUseCase(submenuRepository);
export const createSubMenuController = new CreateSubMenuController(createSubMenuUseCase);

const getSubMenuUseCase = new GetSubMenuUseCase(submenuRepository);
export const getSubMenuController = new GetSubMenuController(getSubMenuUseCase);

const updateSubMenuUseCase = new UpdateSubMenuUseCase(submenuRepository);
export const updateSubMenuController = new UpdateSubMenuController(updateSubMenuUseCase);

const deleteSubMenuUseCase = new DeleteSubMenuUseCase(submenuRepository);
export const deleteSubMenuController = new DeleteSubMenuController(deleteSubMenuUseCase);

const toggleSubmenuStatusUseCase = new ToggleSubmenuStatusUseCase(submenuRepository);
export const toggleSubmenuStatusController = new ToggleSubmenuStatusController(toggleSubmenuStatusUseCase);

