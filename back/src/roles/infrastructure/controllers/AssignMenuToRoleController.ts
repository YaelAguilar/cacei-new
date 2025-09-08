import { Request, Response } from 'express';
import { AssignMenuToRoleUseCase } from '../../application/AssignMenuToRoleUseCase';

export class AssignMenuToRoleController {
    constructor(private readonly assignMenuToRoleUseCase: AssignMenuToRoleUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            const { roleId } = req.params;
            const { menu_id } = req.body;
            
            if (!menu_id) {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Invalid request format",
                        detail: "Request id_menu"
                    }]
                });
                return;
            }
            
            const success = await this.assignMenuToRoleUseCase.execute(roleId, menu_id);
            
            if (!success) {
                throw new Error(`Error assigning menu ${menu_id} to role ${roleId}`);
            }
            
            res.status(201).json({
                data: {
                    type: "role_menu",
                    attributes: {
                        id_role: roleId,
                        id_menu: menu_id,
                        active: true
                    }
                }
            });
        } catch (error) {
            console.error("Error assigning menu to role:", error);
            res.status(500).json({ 
                errors: [{
                    status: "500",
                    title: "Error assigning Menu to Role",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    }
}