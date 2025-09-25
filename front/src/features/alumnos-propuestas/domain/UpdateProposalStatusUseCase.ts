// src/features/alumnos-propuestas/domain/UpdateProposalStatusUseCase.ts
import { PropuestaRepository } from "../data/repository/PropuestaRepository";
import { PropuestaCompleta, ProposalStatus } from "../data/models/Propuesta";

export class UpdateProposalStatusUseCase {
  constructor(private repository: PropuestaRepository) {}

  async execute(uuid: string, status: ProposalStatus): Promise<PropuestaCompleta | null> {
    try {
      // Validar que el estatus sea válido
      const validStatuses: ProposalStatus[] = ['PENDIENTE', 'APROBADO', 'RECHAZADO', 'ACTUALIZAR'];
      
      if (!validStatuses.includes(status)) {
        throw new Error(`Estatus inválido: ${status}. Los valores válidos son: ${validStatuses.join(', ')}`);
      }

      if (!uuid || uuid.trim() === '') {
        throw new Error('El UUID de la propuesta es obligatorio');
      }

      // Actualizar el estatus de la propuesta
      const updatedPropuesta = await this.repository.updateProposalStatus(uuid.trim(), status);
      
      if (!updatedPropuesta) {
        throw new Error('No se pudo actualizar el estatus de la propuesta. Verifique que la propuesta exista y esté activa.');
      }

      return updatedPropuesta;
    } catch (error) {
      console.error("Error en UpdateProposalStatusUseCase:", error);
      throw error;
    }
  }
}

export class GetPropuestasByStatusUseCase {
  constructor(private repository: PropuestaRepository) {}

  async execute(status: ProposalStatus): Promise<PropuestaCompleta[]> {
    try {
      // Validar que el estatus sea válido
      const validStatuses: ProposalStatus[] = ['PENDIENTE', 'APROBADO', 'RECHAZADO', 'ACTUALIZAR'];
      
      if (!validStatuses.includes(status)) {
        throw new Error(`Estatus inválido: ${status}. Los valores válidos son: ${validStatuses.join(', ')}`);
      }

      return await this.repository.getPropuestasByStatus(status);
    } catch (error) {
      console.error("Error en GetPropuestasByStatusUseCase:", error);
      throw error;
    }
  }
}