import { Request, Response } from "express";
import { UnassignSubmenuFromMenuUseCase } from "../../application/unassignSubmenuFromMenuUseCase";

export class UnassignSubmenuFromMenuController {
    constructor(private readonly unassignSubmenuFromMenuUseCase: UnassignSubmenuFromMenuUseCase) { }

    async run(req: Request, res: Response) {
        const { uuid, submenuUuid } = req.params; // UUIDs del menú y submenú

        try {
            const result = await this.unassignSubmenuFromMenuUseCase.execute(uuid, submenuUuid);

            if (result) {
                res.status(204).send(); // No content, operación exitosa
            } else {
                res.status(404).json({
                    errors: [{
                        status: "404",
                        title: "Not Found",
                        detail: "Menu-submenu relationship not found"
                    }]
                });
            }
        } catch (error) {
            console.error("Error unassigning submenu from menu:", error);
            res.status(500).json({
                errors: [{
                    status: "500",
                    title: "Error unassigning submenu",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    }
}