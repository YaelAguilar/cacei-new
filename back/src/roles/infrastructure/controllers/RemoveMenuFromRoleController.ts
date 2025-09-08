import { Request, Response } from 'express';
import { RemoveMenuFromRoleUseCase } from '../../application/RemoveMenuFromRoleUseCase';

export class RemoveMenuFromRoleController {
    constructor(private readonly removeMenuFromRoleUseCase: RemoveMenuFromRoleUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            const { roleId, menuId } = req.params;
            
    
            const success = await this.removeMenuFromRoleUseCase.execute(roleId, menuId);
            
            if (!success) {
                throw new Error(`Error removing menu ${menuId} from role ${roleId}`);
            }
            
            res.status(200).send({ message: "Operación exitosa" });
        } catch (error) {
            console.error("Error removing menu from role:", error);
            res.status(500).json({ 
                errors: [{
                    status: "500",
                    title: "Error removing Menu from Role",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    }
}