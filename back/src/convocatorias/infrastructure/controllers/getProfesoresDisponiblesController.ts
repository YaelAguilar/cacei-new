import { Request, Response } from 'express';
import { GetProfesoresDisponiblesUseCase } from '../../application/getProfesoresDisponiblesUseCase';

export class GetProfesoresDisponiblesController {
    constructor(private readonly getProfesoresDisponiblesUseCase: GetProfesoresDisponiblesUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            const profesores = await this.getProfesoresDisponiblesUseCase.run();

            // Transformar al formato JSON:API
            const formattedProfesores = profesores ? profesores.map(profesor => ({
                type: "profesor",
                id: profesor.getId(),
                attributes: {
                    nombre: profesor.getNombre(),
                    email: profesor.getEmail()
                }
            })) : [];

            res.status(200).json({
                data: formattedProfesores
            });
        } catch (error) {
            console.error("Error in GetProfesoresDisponiblesController:", error);
            res.status(500).json({
                errors: [{
                    status: "500",
                    title: "Error retrieving profesores",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    }
}