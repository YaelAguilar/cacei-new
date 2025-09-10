import { Request, Response } from 'express';
import { GetConvocatoriaUseCase } from '../../application/getConvocatoriaUseCase';

export class GetConvocatoriaController {
    constructor(private readonly getConvocatoriaUseCase: GetConvocatoriaUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        const { uuid } = req.params;

        try {
            const convocatoria = await this.getConvocatoriaUseCase.run(uuid);

            if (convocatoria) {
                // Formato JSON:API
                const formattedConvocatoria = {
                    type: "convocatoria",
                    id: convocatoria.getUuid(),
                    attributes: {
                        nombre: convocatoria.getNombre(),
                        descripcion: convocatoria.getDescripcion(),
                        fechaLimite: convocatoria.getFechaLimite(),
                        pasantiasDisponibles: convocatoria.getPasantiasDisponibles(),
                        profesoresDisponibles: convocatoria.getProfesoresDisponibles(),
                        active: convocatoria.isActive(),
                        createdAt: convocatoria.getCreatedAt(),
                        updatedAt: convocatoria.getUpdatedAt()
                    }
                };

                res.status(200).json({ data: formattedConvocatoria });
            } else {
                res.status(404).json({
                    errors: [{
                        status: "404",
                        title: "Convocatoria not found",
                        detail: "No se encontró la convocatoria con el UUID proporcionado"
                    }]
                });
            }
        } catch (error) {
            console.error("Error in GetConvocatoriaController:", error);
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