// Casos de uso
import { CreateMenuUseCase } from "../application/createMenuUseCase";
import { GetMenuUseCase } from "../application/getMenuUseCase";
import { UpdateMenuUseCase } from "../application/updateMenuUseCase";
import { DeleteMenuUseCase } from "../application/deleteMenuUseCase";
import { GetAllMenuUseCase } from "../application/getAllMenuUseCase";
import { GetMenuSubmenusUseCase } from "../application/getMenuSubmenusUseCase"; //Veremos si se utiliza
import { AssignSubmenuToMenuUseCase } from "../application/assignSubmenuToMenuUseCase"; //Veremos si se utiliza
import { UnassignSubmenuFromMenuUseCase } from "../application/unassignSubmenuFromMenuUseCase"; //Veremos si se utiliza
import { GetAllMenusWithSubmenusUseCase } from "../application/getAllMenusWithSubmenusUseCase";
import { ToggleMenuStatusUseCase } from "../application/toggleMenuStatusUseCase";

// Controladores
import { CreateMenuController } from "./controllers/createMenuController";
import { DeleteMenuController } from "./controllers/deleteMenuController";
import { GetMenuController } from "./controllers/getMenuController";
import { UpdateMenuController } from "./controllers/updateMenuController";
import { GetAllMenuController } from "./controllers/getAllMenuController";
import { GetMenuSubmenusController } from "./controllers/getMenuSubmenusController"; //Veremos si se utiliza
import { AssignSubmenuToMenuController } from "./controllers/assignSubmenuToMenuController"; //Veremos si se utiliza
import { UnassignSubmenuFromMenuController } from "./controllers/unassignSubmenuFromMenuController"; //Veremos si se utiliza
import { GetAllMenusWithSubmenusController } from "./controllers/getAllMenusWithSubmenusController";
import { ToggleMenuStatusController } from "./controllers/toggleMenuStatusController";

import { MysqlMenuRepository } from "./repositories/mysqlMenuRepository";

const menuRepository = new MysqlMenuRepository();

const createMenuUseCase = new CreateMenuUseCase(menuRepository);
export const createMenuController = new CreateMenuController(createMenuUseCase);

const getMenuUseCase = new GetMenuUseCase(menuRepository);
export const getMenuController = new GetMenuController(getMenuUseCase);

const updateMenuUseCase = new UpdateMenuUseCase(menuRepository);
export const updateMenuController = new UpdateMenuController(updateMenuUseCase);

const deleteMenuUseCase = new DeleteMenuUseCase(menuRepository);
export const deleteMenuController = new DeleteMenuController(deleteMenuUseCase);

const getAllMenuUseCase = new GetAllMenuUseCase(menuRepository);
export const getAllMenuController = new GetAllMenuController(getAllMenuUseCase);

const getMenuSubmenusUseCase =  new GetMenuSubmenusUseCase(menuRepository);
export const getMenuSubmenusController = new GetMenuSubmenusController(getMenuSubmenusUseCase);

const assignSubmenuToMenuUseCase = new AssignSubmenuToMenuUseCase(menuRepository);
export const assignSubmenuToMenuController = new AssignSubmenuToMenuController(assignSubmenuToMenuUseCase);

const unassignSubmenuFromMenuUseCase = new UnassignSubmenuFromMenuUseCase(menuRepository);
export const unassignSubmenuFromMenuController = new UnassignSubmenuFromMenuController(unassignSubmenuFromMenuUseCase);

const getAllMenusWithSubmenusUseCase = new GetAllMenusWithSubmenusUseCase(menuRepository);
export const getAllMenusWithSubmenusController = new GetAllMenusWithSubmenusController(getAllMenusWithSubmenusUseCase);

const toggleMenuStatusUseCase = new ToggleMenuStatusUseCase(menuRepository);
export const toggleMenuStatusController = new ToggleMenuStatusController(toggleMenuStatusUseCase);
