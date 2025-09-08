import { Request, Response } from "express";
import { AssignSubmenuToMenuUseCase } from "../../application/assignSubmenuToMenuUseCase";

export class AssignSubmenuToMenuController {
    constructor(private readonly assignSubmenuToMenuUseCase: AssignSubmenuToMenuUseCase) { }

    run = async (req: Request, res: Response): Promise<void> => {
        const { uuid } = req.params; // UUID del menú
        const { submenuUuid } = req.body; // UUID del submenú

        try {
            // Validación básica
            if (!submenuUuid) {
                res.status(400).json({   
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "submenuUuid is required"
                    }]
                });
                return;
            }

            const result = await this.assignSubmenuToMenuUseCase.execute(uuid, submenuUuid);

            if (result) {
                res.status(201).json({
                    data: {
                        type: "menu_submenu",
                        relationships: {
                            menu: {
                                data: { type: "menu", id: uuid }
                            },
                            submenu: {
                                data: { type: "submenu", id: submenuUuid }
                            }
                        }
                    }
                });
            } else {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "Failed to assign submenu to menu"
                    }]
                });
            }
        } catch (error) {
            console.error("Error assigning submenu to menu:", error);
            res.status(500).json({
                errors: [{
                    status: "500",
                    title: "Error assigning submenu",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    };
}