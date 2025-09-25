// front/src/features/alumnos-propuestas/data/repository/PropuestaRepository.ts
import ApiClient from "../../../../core/API/ApiClient";
import { 
  CreatePropuestaRequest,
  UpdatePropuestaRequest,
  UpdateProposalStatusRequest,
  JsonApiPropuestaCompletaResponse,
  JsonApiPropuestasCompletasListResponse,
  JsonApiConvocatoriaActivaResponse
} from "../models/PropuestaDTO";
import { 
  PropuestaCompleta,
  TutorAcademico,
  DireccionEmpresa,
  EmpresaCompleta,
  Contacto,
  Supervisor,
  ProyectoCompleto,
  ConvocatoriaActiva,
  InformacionEstudiante, // NUEVO
  ProposalStatus
} from "../models/Propuesta";

export class PropuestaRepository {
  
  async getConvocatoriaActiva(): Promise<ConvocatoriaActiva | null> {
    try {
      const response = await ApiClient.get<JsonApiConvocatoriaActivaResponse>('/propuestas/convocatoria-activa');
      
      if (response.status === 200 && response.data.data) {
        const data = response.data.data.attributes;
        
        const profesores = data.profesoresDisponibles.map(p => 
          new TutorAcademico(p.id, p.nombre, p.email)
        );
        
        return new ConvocatoriaActiva(
          response.data.data.id,
          data.nombre,
          data.pasantiasDisponibles,
          profesores
        );
      }
      
      return null;
    } catch (error) {
      console.error("Error en getConvocatoriaActiva:", error);
      throw error;
    }
  }

  async createPropuesta(request: CreatePropuestaRequest): Promise<PropuestaCompleta | null> {
    try {
      const response = await ApiClient.post<JsonApiPropuestaCompletaResponse>('/propuestas', request);
      
      if (response.status === 200 || response.status === 201) {
        return this.mapResponseToPropuesta(response.data.data);
      }
      
      return null;
    } catch (error) {
      console.error("Error en createPropuesta:", error);
      throw error;
    }
  }

  async getPropuestasByAlumno(): Promise<PropuestaCompleta[]> {
    try {
      const response = await ApiClient.get<JsonApiPropuestasCompletasListResponse>('/propuestas/mis-propuestas');
      
      if (response.status === 200 && response.data.data) {
        return response.data.data.map(item => this.mapResponseToPropuesta(item));
      }
      
      return [];
    } catch (error) {
      console.error("Error en getPropuestasByAlumno:", error);
      throw error;
    }
  }

  async getPropuesta(uuid: string): Promise<PropuestaCompleta | null> {
    try {
      const response = await ApiClient.get<JsonApiPropuestaCompletaResponse>(`/propuestas/${uuid}`);
      
      if (response.status === 200 && response.data.data) {
        return this.mapResponseToPropuesta(response.data.data);
      }
      
      return null;
    } catch (error) {
      console.error("Error en getPropuesta:", error);
      throw error;
    }
  }

  async updatePropuesta(uuid: string, request: UpdatePropuestaRequest): Promise<PropuestaCompleta | null> {
    try {
      const response = await ApiClient.put<JsonApiPropuestaCompletaResponse>(`/propuestas/${uuid}`, request);
      
      if (response.status === 200 && response.data.data) {
        return this.mapResponseToPropuesta(response.data.data);
      }
      
      return null;
    } catch (error) {
      console.error("Error en updatePropuesta:", error);
      throw error;
    }
  }

  // Nuevo método para actualizar estatus de propuesta
  async updateProposalStatus(uuid: string, status: ProposalStatus): Promise<PropuestaCompleta | null> {
    try {
      const request: UpdateProposalStatusRequest = { status };
      const response = await ApiClient.patch<JsonApiPropuestaCompletaResponse>(`/propuestas/${uuid}/estatus`, request);
      
      if (response.status === 200 && response.data.data) {
        return this.mapResponseToPropuesta(response.data.data);
      }
      
      return null;
    } catch (error) {
      console.error("Error en updateProposalStatus:", error);
      throw error;
    }
  }

  // Nuevo método para obtener propuestas por estatus
  async getPropuestasByStatus(status: ProposalStatus): Promise<PropuestaCompleta[]> {
    try {
      const response = await ApiClient.get<JsonApiPropuestasCompletasListResponse>(`/propuestas/estatus/${status}`);
      
      if (response.status === 200 && response.data.data) {
        return response.data.data.map(item => this.mapResponseToPropuesta(item));
      }
      
      return [];
    } catch (error) {
      console.error("Error en getPropuestasByStatus:", error);
      throw error;
    }
  }

  private mapResponseToPropuesta(data: any): PropuestaCompleta {
    const attrs = data.attributes;
    
    // Manejar ambas estructuras de respuesta (nueva estructura por secciones y estructura de compatibilidad)
    let estudiante: InformacionEstudiante; // NUEVO