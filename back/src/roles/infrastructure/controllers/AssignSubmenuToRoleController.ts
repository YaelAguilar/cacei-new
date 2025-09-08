import { Request, Response } from 'express';
import { AssignSubmenuToRoleUseCase } from '../../application/AssignSubmenuToRoleUseCase';

export class AssignSubmenuToRoleController {
    constructor(private readonly assignSubmenuToRoleUseCase: AssignSubmenuToRoleUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            const { roleId } = req.params;
            const { submenu_id } = req.body;
            
            if (!submenu_id) {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Invalid request format",
                        detail: "Request must follow JSON:API format with type 'role_submenu' and attributes containing id_submenu"
                    }]
                });
                return;
            }
            
            const success = await this.assignSubmenuToRoleUseCase.execute(roleId, submenu_id);
            
            if (!success) {
                throw new Error(`Error assigning submenu ${submenu_id} to role ${roleId}`);
            }
            
            res.status(201).json({
                data: {
                    type: "role_submenu",
                    attributes: {
                        id_role: roleId,
                        id_submenu: submenu_id,
                        active: true
                    }
                }
            });
        } catch (error) {
            console.error("Error assigning submenu to role:", error);
            res.status(500).json({ 
                errors: [{
                    status: "500",
                    title: "Error assigning Submenu to Role",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    }
}