// src/convocatorias/application/validateConvocatoriaExpirationUseCase.ts
import { ConvocatoriaRepository } from "../domain/interfaces/convocatoriaRepository";

export class ValidateConvocatoriaExpirationUseCase {
    constructor(private readonly convocatoriaRepository: ConvocatoriaRepository) {}

    async run(convocatoriaUuid: string): Promise<boolean> {
        try {
            console.log('🕐 ValidateConvocatoriaExpirationUseCase iniciado:', { convocatoriaUuid });

            const convocatoria = await this.convocatoriaRepository.getConvocatoria(convocatoriaUuid);
            if (!convocatoria) {
                throw new Error("Convocatoria no encontrada");
            }

            const now = new Date();
            const fechaLimite = new Date(convocatoria.getFechaLimite());
            
            const isExpired = now > fechaLimite;
            
            console.log(`✅ Convocatoria ${convocatoriaUuid} expirada: ${isExpired}`);
            
            return isExpired;
        } catch (error) {
            console.error("Error in ValidateConvocatoriaExpirationUseCase:", error);
            throw error;
        }
    }

    async validateProposalCreation(convocatoriaUuid: string): Promise<void> {
        const isExpired = await this.run(convocatoriaUuid);
        
        if (isExpired) {
            throw new Error("No se pueden crear propuestas en convocatorias expiradas");
        }
    }

    async validateProposalUpdate(convocatoriaUuid: string): Promise<void> {
        const isExpired = await this.run(convocatoriaUuid);
        
        if (isExpired) {
            throw new Error("No se pueden editar propuestas de convocatorias expiradas");
        }
    }
}


