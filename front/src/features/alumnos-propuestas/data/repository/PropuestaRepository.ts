// front/src/features/alumnos-propuestas/data/repository/PropuestaRepository.ts
import ApiClient from "../../../../core/API/ApiClient";
import { 
  CreatePropuestaRequest,
  UpdatePropuestaRequest,
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

  private mapResponseToPropuesta(data: any): PropuestaCompleta {
    const attrs = data.attributes;
    
    // Mapear Tutor Académico
    const tutorAcademico = new TutorAcademico(
      attrs.tutorAcademico.id,
      attrs.tutorAcademico.nombre,
      attrs.tutorAcademico.email
    );

    // Mapear Dirección de Empresa
    const direccion = new DireccionEmpresa(
      attrs.empresa.direccion.estado,
      attrs.empresa.direccion.municipio,
      attrs.empresa.direccion.tipoAsentamiento,
      attrs.empresa.direccion.nombreAsentamiento,
      attrs.empresa.direccion.tipoVialidad,
      attrs.empresa.direccion.nombreVia,
      attrs.empresa.direccion.numeroExterior,
      attrs.empresa.direccion.numeroInterior,
      attrs.empresa.direccion.codigoPostal
    );

    // Mapear Empresa Completa
    const empresa = new EmpresaCompleta(
      attrs.empresa.nombreCorto,
      attrs.empresa.razonSocial,
      attrs.empresa.rfc,
      direccion,
      attrs.empresa.paginaWeb,
      attrs.empresa.linkedin,
      attrs.empresa.sector
    );

    // Mapear Contacto
    const contacto = new Contacto(
      attrs.contacto.nombre,
      attrs.contacto.puesto,
      attrs.contacto.email,
      attrs.contacto.telefono,
      attrs.contacto.area
    );

    // Mapear Supervisor
    const supervisor = new Supervisor(
      attrs.supervisor.nombre,
      attrs.supervisor.area,
      attrs.supervisor.email,
      attrs.supervisor.telefono
    );

    // Mapear Proyecto Completo
    const proyecto = new ProyectoCompleto(
      attrs.proyecto.nombre,
      new Date(attrs.proyecto.fechaInicio),
      new Date(attrs.proyecto.fechaFin),
      attrs.proyecto.contextoProblema,
      attrs.proyecto.descripcionProblema,
      attrs.proyecto.objetivoGeneral,
      attrs.proyecto.objetivosEspecificos,
      attrs.proyecto.actividadesPrincipales,
      attrs.proyecto.entregablesPlaneados,
      attrs.proyecto.tecnologias
    );

    // Crear Propuesta Completa
    return new PropuestaCompleta(
      data.id,
      attrs.idConvocatoria,
      tutorAcademico,
      attrs.tipoPasantia,
      empresa,
      contacto,
      supervisor,
      proyecto,
      attrs.active,
      new Date(attrs.createdAt),
      new Date(attrs.updatedAt)
    );
  }
}