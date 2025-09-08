import { Request, Response } from 'express';
import { ToggleSubmenuStatusUseCase } from '../../application/toggleSubmenuStatusUseCase';

export class ToggleSubmenuStatusController {
    constructor(private readonly toggleSubmenuStatusUseCase: ToggleSubmenuStatusUseCase) { }

    run = async (req: Request, res: Response): Promise<void> => {
        const { uuid } = req.params;
        const { active } = req.body;

        // Validación de datos
        if (active === undefined) {
            res.status(400).send({
                status: 'error',
                message: 'Se requiere el campo "active" en el cuerpo de la petición'
            });
            return;
        }

        try {
            const success = await this.toggleSubmenuStatusUseCase.execute(uuid, active);

            if (success) {
                res.status(200).send({
                    status: 'success',
                    message: `Submenú ${active ? 'activado' : 'desactivado'} correctamente`
                });
            } else {
                res.status(404).send({
                    status: 'error',
                    message: 'Submenú no encontrado'
                });
            }
        } catch (error) {
            res.status(500).send({
                status: 'error',
                message: 'Error al cambiar el estado del submenú',
                error
            });
        }
    };
}