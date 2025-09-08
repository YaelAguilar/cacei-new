import { Request, Response } from "express";
import { GetMenuSubmenusUseCase } from "../../application/getMenuSubmenusUseCase";

export class GetMenuSubmenusController {
    constructor(private readonly getMenuSubmenusUseCase: GetMenuSubmenusUseCase) { }

    async run(req: Request, res: Response) {
        const { uuid } = req.params; // UUID del menú

        try {
            const submenus = await this.getMenuSubmenusUseCase.execute(uuid);

            // Formatear la respuesta según JSON:API
            const formattedSubmenus = submenus.map(submenu => ({
                type: "submenu",
                id: submenu.getUuid(),
                attributes: {
                    name: submenu.getName(),
                    description: submenu.getDescription(),
                    icon: submenu.getIcon(),
                    path: submenu.getPath(),
                    orden: submenu.getOrder(),
                    active: submenu.getActive()
                }
            }));

            res.status(200).json({
                data: formattedSubmenus
            });
        } catch (error) {
            console.error("Error getting submenus for menu:", error);
            res.status(500).json({
                errors: [{
                    status: "500",
                    title: "Error retrieving submenus",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    }
}