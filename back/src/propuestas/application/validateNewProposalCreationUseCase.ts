// src/propuestas/application/validateNewProposalCreationUseCase.ts
import { PropuestaRepository } from "../domain/interfaces/propuestaRepository";
import { ConvocatoriaRepository } from "../../convocatorias/domain/interfaces/convocatoriaRepository";

export class ValidateNewProposalCreationUseCase {
    constructor(
        private readonly propuestaRepository: PropuestaRepository,
        private readonly convocatoriaRepository: ConvocatoriaRepository
    ) {}

    async run(studentId: number, convocatoriaId: number): Promise<void> {
        try {
            console.log('🔍 ValidateNewProposalCreationUseCase iniciado:', { studentId, convocatoriaId });

            // Verificar que existe una convocatoria activa
            const convocatoriaActiva = await this.propuestaRepository.getActiveConvocatoria();
            if (!convocatoriaActiva) {
                throw new Error("No hay una convocatoria activa disponible");
            }

            // Verificar que el estudiante no tenga ya una propuesta en esta convocatoria
            const existePropuesta = await this.propuestaRepository.checkExistingPropuesta(
                studentId, 
                convocatoriaActiva.id
            );

            if (existePropuesta) {
                // Obtener la propuesta existente para verificar su estado
                const propuestasDelEstudiante = await this.propuestaRepository.getPropuestasByStudent(studentId);
                const propuestaEnConvocatoria = propuestasDelEstudiante?.find(
                    p => p.getConvocatoriaId() === convocatoriaActiva.id
                );

                if (propuestaEnConvocatoria) {
                    const estadoActual = propuestaEnConvocatoria.getProposalStatus();
                    
                    // Solo permitir nueva propuesta si la anterior fue rechazada
                    if (estadoActual === 'RECHAZADO') {
                        console.log('✅ Estudiante puede crear nueva propuesta - la anterior fue rechazada');
                        return;
                    } else {
                        throw new Error(
                            `Ya tienes una propuesta en estado "${estadoActual}" en la convocatoria actual. ` +
                            `Solo puedes crear una nueva propuesta si la anterior fue rechazada.`
                        );
                    }
                }
            }

            console.log('✅ Estudiante puede crear nueva propuesta - no tiene propuestas previas');
        } catch (error) {
            console.error("Error in ValidateNewProposalCreationUseCase:", error);
            throw error;
        }
    }
}






