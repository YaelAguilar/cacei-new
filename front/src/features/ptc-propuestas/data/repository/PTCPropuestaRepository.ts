// src/features/ptc-propuestas/data/repository/PTCPropuestaRepository.ts
import ApiClient from "../../../../core/API/ApiClient";
import { 
  JsonApiPropuestasListResponse,
  JsonApiPropuestaResponse 
} from "../../../alumnos-propuestas/data/models/PropuestaDTO";
import { 
  Propuesta, 
  TutorAcademico, 
  ProyectoInfo, 
  EmpresaInfo 
} from "../../../alumnos-propuestas/data/models/Propuesta";

export class PTCPropuestaRepository {
  
  async getAllPropuestas(): Promise<Propuesta[]> {
    try {
      const response = await ApiClient.get<JsonApiPropuestasListResponse>('/propuestas');
      
      if (response.status === 200 && response.data.data) {
        return response.data.data.map(item => this.mapResponseToPropuesta(item));
      }
      
      return [];
    } catch (error) {
      console.error("Error en getAllPropuestas:", error);
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