import { Request, Response } from "express";
import { GetAllMenusWithSubmenusUseCase } from "../../application/getAllMenusWithSubmenusUseCase";
import { MenuWithSubmenus } from "../../domain/models/menuWithSubmenus";

export class GetAllMenusWithSubmenusController {
    constructor(private readonly getAllMenusWithSubmenusUseCase: GetAllMenusWithSubmenusUseCase) { }

    run = async (req: Request, res: Response): Promise<void> => {
        try {
            const menusWithSubmenus: MenuWithSubmenus[] = await this.getAllMenusWithSubmenusUseCase.execute();

            // Formatear la respuesta según JSON:API
            const formattedMenus = menusWithSubmenus.map(menu => ({
                type: "menu",
                id: menu.uuid,
                attributes: {
                    name: menu.name,
                    description: menu.description,
                    icon: menu.icon,
                    active: menu.active
                },
                relationships: {
                    submenus: {
                        data: menu.submenus.map(submenu => ({
                            type: "submenu",
                            id: submenu.getUuid(),
                            attributes: {
                                name: submenu.getName(),
                                description: submenu.getDescription(),
                                icon: submenu.getIcon(),
                                path: submenu.getPath(),
                                sort_order: submenu.getOrder(),
                                active: submenu.getActive(),
                                component_name: submenu.getComponentName()
                            }
                        }))
                    }
                }
            }));

            res.status(200).json({
                data: formattedMenus
            });
        } catch (error) {
            console.error("Error getting menus with submenus:", error);
            res.status(500).json({
                errors: [{
                    status: "500",
                    title: "Error retrieving menus with submenus",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    };
}