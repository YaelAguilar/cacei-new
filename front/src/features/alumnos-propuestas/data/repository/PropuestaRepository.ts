// src/features/alumnos-propuestas/data/repository/PropuestaRepository.ts
import ApiClient from "../../../../core/API/ApiClient";
import { 
  CreatePropuestaRequest,
  UpdatePropuestaRequest,
  JsonApiPropuestaResponse,
  JsonApiPropuestasListResponse,
  JsonApiConvocatoriaActivaResponse
} from "../models/PropuestaDTO";
import { 
  Propuesta, 
  TutorAcademico, 
  ProyectoInfo, 
  EmpresaInfo, 
  ConvocatoriaActiva 
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

  async createPropuesta(request: CreatePropuestaRequest): Promise<Propuesta | null> {
    try {
      const response = await ApiClient.post<JsonApiPropuestaResponse>('/propuestas', request);
      
      if (response.status === 200 || response.status === 201) {
        return this.mapResponseToPropuesta(response.data.data);
      }
      
      return null;
    } catch (error) {
      console.error("Error en createPropuesta:", error);
      throw error;
    }
  }

  async getPropuestasByAlumno(): Promise<Propuesta[]> {
    try {
      const response = await ApiClient.get<JsonApiPropuestasListResponse>('/propuestas/mis-propuestas');
      
      if (response.status === 200 && response.data.data) {
        return response.data.data.map(item => this.mapResponseToPropuesta(item));
      }
      
      return [];
    } catch (error) {
      console.error("Error en getPropuestasByAlumno:", error);
      throw error;
    }
  }

  async getPropuesta(uuid: string): Promise<Propuesta | null> {
    try {
      const response = await ApiClient.get<JsonApiPropuestaResponse>(`/propuestas/${uuid}`);
      
      if (response.status === 200 && response.data.data) {
        return this.mapResponseToPropuesta(response.data.data);
      }
      
      return null;
    } catch (error) {
      console.error("Error en getPropuesta:", error);
      throw error;
    }
  }

  async updatePropuesta(uuid: string, request: UpdatePropuestaRequest): Promise<Propuesta | null> {
    try {
      const response = await ApiClient.put<JsonApiPropuestaResponse>(`/propuestas/${uuid}`, request);
      
      if (response.status === 200 && response.data.data) {
        return this.mapResponseToPropuesta(response.data.data);
      }
      
      return null;
    } catch (error) {
      console.error("Error en updatePropuesta:", error);
      throw error;
    }
  }

  private mapResponseToPropuesta(data: any): Propuesta {
    const attrs = data.attributes;
    
    const tutorAcademico = new TutorAcademico(
      attrs.tutorAcademico.id,
      attrs.tutorAcademico.nombre,
      attrs.tutorAcademico.email
    );

    const proyecto = new ProyectoInfo(
      attrs.proyecto.nombre,
      attrs.proyecto.descripcion,
      attrs.proyecto.entregables,
      attrs.proyecto.tecnologias,
      attrs.proyecto.supervisor,
      attrs.proyecto.actividades,
      new Date(attrs.proyecto.fechaInicio),
      new Date(attrs.proyecto.fechaFin)
    );

    const empresa = new EmpresaInfo(
      attrs.empresa.nombre,
      attrs.empresa.sector,
      attrs.empresa.personaContacto,
      attrs.empresa.paginaWeb
    );

    return new Propuesta(
      data.id,
      attrs.idConvocatoria,
      tutorAcademico,
      attrs.tipoPasantia,
      proyecto,
      empresa,
      attrs.active,
      new Date(attrs.createdAt),
      new Date(attrs.updatedAt)
    );
  }
}