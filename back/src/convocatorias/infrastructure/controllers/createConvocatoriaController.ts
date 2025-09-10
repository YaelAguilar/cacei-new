import { Request, Response } from 'express';
import { CreateConvocatoriaUseCase } from '../../application/createConvocatoriaUseCase';

export class CreateConvocatoriaController {
    constructor(private readonly createConvocatoriaUseCase: CreateConvocatoriaUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        const { nombre, descripcion, fechaLimite, pasantiasSeleccionadas } = req.body;

        try {
            // Validar que los campos requeridos estén presentes
            if (!nombre || !fechaLimite || !pasantiasSeleccionadas) {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "Los campos nombre, fechaLimite y pasantiasSeleccionadas son obligatorios"
                    }]
                });
                return;
            }

            // Convertir la fecha límite a objeto Date
            const fechaLimiteDate = new Date(fechaLimite);
            if (isNaN(fechaLimiteDate.getTime())) {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "Formato de fecha inválido"
                    }]
                });
                return;
            }

            const convocatoria = await this.createConvocatoriaUseCase.run(
                nombre,
                descripcion || null,
                fechaLimiteDate,
                pasantiasSeleccionadas
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

                res.status(201).json({ data: formattedConvocatoria });
            } else {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Could not create convocatoria",
                        detail: "No se pudo crear la convocatoria"
                    }]
                });
            }
        } catch (error) {
            console.error("Error in CreateConvocatoriaController:", error);
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