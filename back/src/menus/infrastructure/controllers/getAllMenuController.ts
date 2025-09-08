import { Request, Response } from "express";
import { GetAllMenuUseCase } from "../../application/getAllMenuUseCase";
import { Menu } from "../../domain/models/menu";

export class GetAllMenuController {
    constructor(private readonly getAllMenuUseCase: GetAllMenuUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const menus: Menu[] | null = await this.getAllMenuUseCase.execute(); 
            
            // Transformamos los menús al formato JSON:API
            const formattedMenus = menus ? menus.map(menu => ({
                type: "menu",
                id: menu.getUuid(),
                attributes: {
                    name: menu.getName(),
                    description: menu.getDescription(),
                    icon: menu.getIcon(),
                    path: menu.getPath(),
                    orden: menu.getOrden(),
                    active: menu.getActivo(),
                    is_navegable: menu.getIsNavegable(),
                    component_name: menu.getComponentName(),
                    feature_name: menu.getFeatureName()
                },
                meta: {
                    submenuCount: (menu as any).submenuCount || menu.getSubmenuCount() || 0
                }
            })) : [];
            
            // Respuesta en formato JSON:API
            res.status(200).json({
                data: formattedMenus
            });
        } catch (error) {
            console.log("Error al obtener los menus");
            res.status(500).json({ 
                errors: [{
                    status: "500",
                    title: "Error retriving Menus",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    }
}