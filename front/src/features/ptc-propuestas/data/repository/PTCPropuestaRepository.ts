import ApiClient from "../../../../core/API/ApiClient";
import { 
  JsonApiPropuestasCompletasListResponse,
  JsonApiPropuestaCompletaResponse 
} from "../../../alumnos-propuestas/data/models/PropuestaDTO";
import { 
  PropuestaCompleta,
  TutorAcademico,
  InformacionEstudiante,
  DireccionEmpresa,
  EmpresaCompleta,
  Contacto,
  Supervisor,
  ProyectoCompleto
} from "../../../alumnos-propuestas/data/models/Propuesta";

export class PTCPropuestaRepository {
  
  async getAllPropuestas(): Promise<PropuestaCompleta[]> {
    try {
      const response = await ApiClient.get<JsonApiPropuestasCompletasListResponse>('/propuestas');
      
      if (response.status === 200 && response.data.data) {
        return response.data.data.map(item => this.mapResponseToPropuesta(item));
      }
      
      return [];
    } catch (error) {
      console.error("Error en getAllPropuestas:", error);
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

  private mapResponseToPropuesta(data: any): PropuestaCompleta {
    const attrs = data.attributes;
    
    const tutorAcademico = new TutorAcademico(
      attrs.tutorAcademico.id,
      attrs.tutorAcademico.nombre,
      attrs.tutorAcademico.email
    );

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

    const empresa = new EmpresaCompleta(
      attrs.empresa.nombreCorto,
      attrs.empresa.razonSocial,
      attrs.empresa.rfc,
      direccion,
      attrs.empresa.paginaWeb,
      attrs.empresa.linkedin,
      attrs.empresa.sector
    );

    const contacto = new Contacto(
      attrs.contacto.nombre,
      attrs.contacto.puesto,
      attrs.contacto.email,
      attrs.contacto.telefono,
      attrs.contacto.area
    );

    const supervisor = new Supervisor(
      attrs.supervisor.nombre,
      attrs.supervisor.area,
      attrs.supervisor.email,
      attrs.supervisor.telefono
    );

    const proyecto = new ProyectoCompleto(
      attrs.proyecto?.nombre || 'Proyecto sin nombre',
      attrs.proyecto?.fechaInicio ? new Date(attrs.proyecto.fechaInicio) : new Date(),
      attrs.proyecto?.fechaFin ? new Date(attrs.proyecto.fechaFin) : new Date(),
      attrs.proyecto?.contextoProblema || '',
      attrs.proyecto?.descripcionProblema || '',
      attrs.proyecto?.objetivoGeneral || '',
      attrs.proyecto?.objetivosEspecificos || '',
      attrs.proyecto?.actividadesPrincipales || '',
      attrs.proyecto?.entregablesPlaneados || '',
      attrs.proyecto?.tecnologias || ''
    );

    // Crear información del estudiante (necesario para el constructor)
    const estudiante = new InformacionEstudiante(
      attrs.estudiante?.nombre || 'Estudiante',
      attrs.estudiante?.email || 'estudiante@email.com'
    );

    return new PropuestaCompleta(
      data.id,
      parseInt(data.id), // numericId
      attrs.idConvocatoria,
      estudiante,
      tutorAcademico,
      typeof attrs.tipoPasantia === 'string' ? attrs.tipoPasantia : String(attrs.tipoPasantia),
      empresa,
      contacto,
      supervisor,
      proyecto,
      attrs.estatus || 'PENDIENTE',
      attrs.active,
      new Date(attrs.createdAt),
      new Date(attrs.updatedAt)
    );
  }
}