// src/convocatorias/application/validateConvocatoriaExpirationUseCase.ts
import { ConvocatoriaRepository } from "../domain/interfaces/convocatoriaRepository";

export class ValidateConvocatoriaExpirationUseCase {
    constructor(private readonly convocatoriaRepository: ConvocatoriaRepository) {}

    async run(convocatoriaId: number): Promise<boolean> {
        try {
            console.log('🕐 ValidateConvocatoriaExpirationUseCase iniciado:', { convocatoriaId });

            const convocatoria = await this.convocatoriaRepository.getConvocatoria(convocatoriaId);
            if (!convocatoria) {
                throw new Error("Convocatoria no encontrada");
            }

            const now = new Date();
            const fechaLimite = new Date(convocatoria.getFechaLimite());
            
            const isExpired = now > fechaLimite;
            
            console.log(`✅ Convocatoria ${convocatoriaId} expirada: ${isExpired}`);
            
            return isExpired;
        } catch (error) {
            console.error("Error in ValidateConvocatoriaExpirationUseCase:", error);
            throw error;
        }
    }

    async validateProposalCreation(convocatoriaId: number): Promise<void> {
        const isExpired = await this.run(convocatoriaId);
        
        if (isExpired) {
            throw new Error("No se pueden crear propuestas en convocatorias expiradas");
        }
    }

    async validateProposalUpdate(convocatoriaId: number): Promise<void> {
        const isExpired = await this.run(convocatoriaId);
        
        if (isExpired) {
            throw new Error("No se pueden editar propuestas de convocatorias expiradas");
        }
    }
}

