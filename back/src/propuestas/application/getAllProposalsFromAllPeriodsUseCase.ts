// src/propuestas/application/getAllProposalsFromAllPeriodsUseCase.ts
import { PropuestaRepository } from "../domain/interfaces/propuestaRepository";
import { Propuesta } from "../domain/models/propuesta";

export interface AllPeriodsFilters {
    convocatoriaId?: number;
    status?: string;
    internshipType?: string;
    tutorId?: number;
    dateFrom?: Date;
    dateTo?: Date;
}

export class GetAllProposalsFromAllPeriodsUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(requesterRole: string, filters?: AllPeriodsFilters): Promise<Propuesta[]> {
        try {
            console.log('📊 GetAllProposalsFromAllPeriodsUseCase iniciado:', { 
                requesterRole, 
                filters 
            });

            // Solo los directores pueden acceder a esta funcionalidad
            if (requesterRole !== 'Director' && requesterRole !== 'SUPER-ADMIN') {
                throw new Error("Solo los directores pueden acceder a todas las propuestas de períodos pasados");
            }

            // Obtener todas las propuestas de todos los períodos
            const allProposals = await this.propuestaRepository.getAllProposalsFromAllPeriods(filters);
            
            console.log(`✅ Se encontraron ${allProposals.length} propuestas de todos los períodos`);
            
            return allProposals;
        } catch (error) {
            console.error("Error in GetAllProposalsFromAllPeriodsUseCase:", error);
            throw error;
        }
    }
}




