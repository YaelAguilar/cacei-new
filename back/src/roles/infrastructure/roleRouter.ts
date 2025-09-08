import express from "express";
import { getRolesController, createRoleController, getRolePermissionsController, assignMenuToRoleController, assignSubmenuToRoleController, removeMenuFromRoleController, removeSubmenuFromRoleController } from "./dependencies";

export const roleRouter = express.Router();

roleRouter.get('/', getRolesController.run.bind(getRolesController));
roleRouter.post('/',createRoleController.run.bind(createRoleController));
roleRouter.get('/:roleId/permissions',getRolePermissionsController.run.bind(getRolePermissionsController));
roleRouter.post('/:roleId/menus', assignMenuToRoleController.run.bind(assignMenuToRoleController));
roleRouter.post('/:roleId/submenus', assignSubmenuToRoleController.run.bind(assignSubmenuToRoleController));
roleRouter.delete('/:roleId/menus/:menuId', removeMenuFromRoleController.run.bind(removeMenuFromRoleController));
roleRouter.delete('/:roleId/submenus/:submenuId', removeSubmenuFromRoleController.run.bind(removeSubmenuFromRoleController));


