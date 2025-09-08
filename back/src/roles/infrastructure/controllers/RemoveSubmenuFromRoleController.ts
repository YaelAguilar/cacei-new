import { Request, Response } from 'express';
import { RemoveSubmenuFromRoleUseCase } from '../../application/RemoveSubmenuFromRoleUseCase';

export class RemoveSubmenuFromRoleController {
    constructor(private readonly removeSubmenuFromRoleUseCase: RemoveSubmenuFromRoleUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            const { roleId, submenuId } = req.params;
                     
            const success = await this.removeSubmenuFromRoleUseCase.execute(roleId, submenuId);
            
            if (!success) {
                throw new Error(`Error removing submenu ${submenuId} from role ${roleId}`);
            }
            
            res.status(200).send({ message: "Operación exitosa" });
        } catch (error) {
            console.error("Error removing submenu from role:", error);
            res.status(500).json({ 
                errors: [{
                    status: "500",
                    title: "Error removing Submenu from Role",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    }
}