import { Request, Response } from 'express';
import { GetRolePermissionsUseCase } from '../../application/getRolePermissionsUseCase';

export class GetRolePermissionsController {
    constructor(private readonly getRolePermissionsUseCase: GetRolePermissionsUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const { roleId } = req.params;
            
            const rolePermissions = await this.getRolePermissionsUseCase.execute(roleId);
            
            if (!rolePermissions) {
                throw new Error(`Error getting permissions for role ${roleId}`);
            }
            
            // Transformar a formato JSON:API
            const formattedResponse = {
                data: {
                    type: "role",
                    id: rolePermissions.uuid,
                    attributes: {
                        name: rolePermissions.name,
                        description: rolePermissions.description,
                        active: rolePermissions.active
                    },
                    relationships: {
                        availablePermissions: {
                            menus: rolePermissions.availablePermissions.menus.map(menu => ({
                                type: "menu",
                                id: menu.uuid,
                                attributes: {
                                    name: menu.name,
                                    description: menu.description,
                                    icon: menu.icon,
                                    path: menu.path,
                                    orden: menu.orden,
                                    active: menu.active,
                                    assigned: menu.assigned,
                                    is_navegable: menu.is_navegable,
                                    component_name: menu.component_name,
                                    feature_name: menu.feature_name
                                    },
                                relationships: {
                                    submenus: {
                                        data: menu.submenus.map(submenu => ({
                                            type: "submenu",
                                            id: submenu.uuid,
                                            attributes: {
                                                name: submenu.name,
                                                description: submenu.description,
                                                icon: submenu.icon,
                                                path: submenu.path,
                                                orden: submenu.orden,
                                                active: submenu.active,
                                                assigned: submenu.assigned,
                                                component_name: submenu.component_name,
                                            }
                                        }))
                                    }
                                }
                            }))
                        }
                    }
                }
            };
            
            res.status(200).json(formattedResponse);
        } catch (error) {
            console.error("Error getting role permissions:", error);
            res.status(500).json({ 
                errors: [{
                    status: "500",
                    title: "Error retrieving Role Permissions",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    }
}