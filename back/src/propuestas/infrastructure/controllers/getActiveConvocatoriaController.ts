// src/propuestas/infrastructure/controllers/getActiveConvocatoriaController.ts
import { Request, Response } from 'express';
import { GetActiveConvocatoriaUseCase } from '../../application/getPropuestasUseCase';

export class GetActiveConvocatoriaController {
    constructor(private readonly getActiveConvocatoriaUseCase: GetActiveConvocatoriaUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            const convocatoriaActiva = await this.getActiveConvocatoriaUseCase.run();

            if (convocatoriaActiva) {
                const formattedConvocatoria = {
                    type: "convocatoria-activa",
                    id: convocatoriaActiva.uuid,
                    attributes: {
                        nombre: convocatoriaActiva.nombre,
                        pasantiasDisponibles: convocatoriaActiva.pasantiasDisponibles,
                        profesoresDisponibles: convocatoriaActiva.profesoresDisponibles
                    }
                };

                res.status(200).json({ data: formattedConvocatoria });
            } else {
                res.status(404).json({
                    errors: [{
                        status: "404",
                        title: "No active convocatoria",
                        detail: "No hay una convocatoria activa disponible en este momento"
                    }]
                });
            }
        } catch (error) {
            console.error("Error in GetActiveConvocatoriaController:", error);
            res.status(500).json({
                errors: [{
                    status: "500",
                    title: "Server error",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    }
}