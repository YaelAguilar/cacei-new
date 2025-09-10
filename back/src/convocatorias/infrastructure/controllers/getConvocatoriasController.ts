import { Request, Response } from 'express';
import { GetConvocatoriasUseCase } from '../../application/getConvocatoriasUseCase';

export class GetConvocatoriasController {
    constructor(private readonly getConvocatoriasUseCase: GetConvocatoriasUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            const convocatorias = await this.getConvocatoriasUseCase.run();

            // Transformar al formato JSON:API
            const formattedConvocatorias = convocatorias ? convocatorias.map(convocatoria => ({
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
            })) : [];

            res.status(200).json({
                data: formattedConvocatorias
            });
        } catch (error) {
            console.error("Error in GetConvocatoriasController:", error);
            res.status(500).json({
                errors: [{
                    status: "500",
                    title: "Error retrieving convocatorias",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    }
}