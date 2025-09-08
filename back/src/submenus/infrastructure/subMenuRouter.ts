import { Router } from "express";
import { createSubMenuController, getSubMenuController, updateSubMenuController, deleteSubMenuController, toggleSubmenuStatusController } from "./dependencies"; 

export const subMenuRouter = Router();

subMenuRouter.post("/", createSubMenuController.run.bind(createSubMenuController));
// menuRouter.get("/", getMenuController.run.bind(getMenuController));
subMenuRouter.get("/:uuid", getSubMenuController.run.bind(getSubMenuController));
subMenuRouter.put("/:uuid", updateSubMenuController.run.bind(updateSubMenuController));
subMenuRouter.delete("/:uuid", deleteSubMenuController.run.bind(deleteSubMenuController));
subMenuRouter.patch("/:uuid/status", toggleSubmenuStatusController.run.bind(toggleSubmenuStatusController));
