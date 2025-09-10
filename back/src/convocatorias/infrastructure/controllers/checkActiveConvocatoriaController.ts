import { Request, Response } from 'express';
import { CheckActiveConvocatoriaUseCase } from '../../application/checkActiveConvocatoriaUseCase';

export class CheckActiveConvocatoriaController {
    constructor(private readonly checkActiveConvocatoriaUseCase: CheckActiveConvocatoriaUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            const hasActiveConvocatoria = await this.checkActiveConvocatoriaUseCase.run();

            res.status(200).json({
                data: {
                    type: "convocatoria-status",
                    attributes: {
                        hasActiveConvocatoria: hasActiveConvocatoria
                    }
                }
            });
        } catch (error) {
            console.error("Error in CheckActiveConvocatoriaController:", error);
            res.status(500).json({
                errors: [{
                    status: "500",
                    title: "Error checking active convocatoria",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    }
}