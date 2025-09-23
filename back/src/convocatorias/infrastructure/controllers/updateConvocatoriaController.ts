import { Request, Response } from 'express';
import { UpdateConvocatoriaUseCase } from '../../application/updateConvocatoriaUseCase';

export class UpdateConvocatoriaController {
    constructor(private readonly updateConvocatoriaUseCase: UpdateConvocatoriaUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        const { uuid } = req.params;
        const { 
            nombre, 
            descripcion, 
            fechaLimite, 
            pasantiasDisponibles,
            actualizarProfesores
        } = req.body;

        try {
            const convocatoria = await this.updateConvocatoriaUseCase.run(
                uuid,
                nombre,
                descripcion,
                fechaLimite,
                pasantiasDisponibles,
                actualizarProfesores
            );

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
                        detail: "No se encontró la convocatoria para actualizar"
                    }]
                });
            }
        } catch (error) {
            console.error("Error in UpdateConvocatoriaController:", error);
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