import { Router } from "express";
import {
    createMenuController,
    getMenuController,
    getAllMenuController,
    updateMenuController, 
    deleteMenuController, 
    getMenuSubmenusController, 
    assignSubmenuToMenuController, 
    unassignSubmenuFromMenuController,
    getAllMenusWithSubmenusController,
    toggleMenuStatusController
} from "./dependencies";

export const menuRouter = Router();

menuRouter.post("/", createMenuController.run.bind(createMenuController));
menuRouter.get("/", getAllMenuController.run.bind(getAllMenuController));
menuRouter.get("/submenus", getAllMenusWithSubmenusController.run.bind(getAllMenusWithSubmenusController));
menuRouter.get("/:uuid", getMenuController.run.bind(getMenuController));
menuRouter.put("/:uuid", updateMenuController.run.bind(updateMenuController));
menuRouter.delete("/:uuid", deleteMenuController.run.bind(deleteMenuController));
menuRouter.patch("/:uuid/status", toggleMenuStatusController.run.bind(toggleMenuStatusController));
menuRouter.get("/:uuid/submenus", getMenuSubmenusController.run.bind(getMenuSubmenusController));
menuRouter.post("/:uuid/submenus", assignSubmenuToMenuController.run.bind(assignSubmenuToMenuController));
menuRouter.delete("/:uuid/submenus/:submenuUuid", unassignSubmenuFromMenuController.run.bind(unassignSubmenuFromMenuController));

