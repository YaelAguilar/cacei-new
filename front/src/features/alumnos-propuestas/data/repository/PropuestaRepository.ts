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
  InformacionEstudiante,
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
    let estudiante: InformacionEstudiante;
    let tutorAcademico: TutorAcademico;
    let direccionEmpresa: DireccionEmpresa;
    let empresaCompleta: EmpresaCompleta;
    let contacto: Contacto;
    let supervisor: Supervisor;
    let proyectoCompleto: ProyectoCompleto;
    let estatus: ProposalStatus = 'PENDIENTE';

    // NUEVO: Mapear información del estudiante desde la nueva estructura
    if (attrs.informacionDelAlumno) {
      // Estructura por secciones (nueva)
      estudiante = new InformacionEstudiante(
        attrs.informacionDelAlumno.nombreCompleto || 'Nombre no disponible',
        attrs.informacionDelAlumno.email || 'Email no disponible'
      );
      
      tutorAcademico = new TutorAcademico(
        attrs.informacionDelAlumno.tutorAcademico.id,
        attrs.informacionDelAlumno.tutorAcademico.nombre,
        attrs.informacionDelAlumno.tutorAcademico.email
      );
    } else if (attrs.tutorAcademico) {
      // Estructura de compatibilidad (antigua)
      estudiante = new InformacionEstudiante(
        attrs.estudiante?.nombreCompleto || 'Estudiante Actual',
        attrs.estudiante?.email || 'estudiante@universidad.edu'
      );
      
      tutorAcademico = new TutorAcademico(
        attrs.tutorAcademico.id,
        attrs.tutorAcademico.nombre,
        attrs.tutorAcademico.email
      );
    } else {
      throw new Error('No se pudo obtener información del tutor académico');
    }

    // Mapear empresa desde estructura por secciones o compatibilidad
    if (attrs.direccionFisicaYEnLaWebDeLaEmpresa) {
      // Nueva estructura por secciones
      direccionEmpresa = new DireccionEmpresa(
        attrs.direccionFisicaYEnLaWebDeLaEmpresa.entidadFederativa,
        attrs.direccionFisicaYEnLaWebDeLaEmpresa.demarcacionTerritorial,
        attrs.direccionFisicaYEnLaWebDeLaEmpresa.tipoDeAsentamientoHumano,
        attrs.direccionFisicaYEnLaWebDeLaEmpresa.nombreDelAsentamientoHumano,
        attrs.direccionFisicaYEnLaWebDeLaEmpresa.vialidad,
        attrs.direccionFisicaYEnLaWebDeLaEmpresa.nombreDeLaVia,
        attrs.direccionFisicaYEnLaWebDeLaEmpresa.numeroExterior,
        attrs.direccionFisicaYEnLaWebDeLaEmpresa.numeroInterior,
        attrs.direccionFisicaYEnLaWebDeLaEmpresa.codigoPostal
      );

      empresaCompleta = new EmpresaCompleta(
        attrs.informacionDeLaEmpresa?.nombreCorto || null,
        attrs.informacionDeLaEmpresa?.nombreLegal || '',
        attrs.informacionDeLaEmpresa?.rfc || '',
        direccionEmpresa,
        attrs.direccionFisicaYEnLaWebDeLaEmpresa.paginaWeb,
        attrs.direccionFisicaYEnLaWebDeLaEmpresa.linkedin,
        attrs.informacionDeContactoEnLaEmpresa?.nombreDelAreaAsociada || ''
      );

      contacto = new Contacto(
        attrs.informacionDeContactoEnLaEmpresa?.nombreDeLaPersonaDeContacto || '',
        attrs.informacionDeContactoEnLaEmpresa?.puestoEnLaEmpresaDeLaPersonaDeContacto || '',
        attrs.informacionDeContactoEnLaEmpresa?.direccionElectronicaDeCorreo || '',
        attrs.informacionDeContactoEnLaEmpresa?.numeroTelefonico || '',
        attrs.informacionDeContactoEnLaEmpresa?.nombreDelAreaAsociada || ''
      );

      supervisor = new Supervisor(
        attrs.supervisorDelProyectoDeEstanciaOEstadia?.nombreDelSupervisor || '',
        attrs.supervisorDelProyectoDeEstanciaOEstadia?.areaDeLaEmpresaEnLaQueSeDesarrollaraElProyecto || '',
        attrs.supervisorDelProyectoDeEstanciaOEstadia?.direccionElectronicaDeCorreo || '',
        attrs.supervisorDelProyectoDeEstanciaOEstadia?.numeroDeTelefono || ''
      );

      proyectoCompleto = new ProyectoCompleto(
        attrs.datosDelProyecto?.nombreDelProyecto || '',
        new Date(attrs.datosDelProyecto?.fechaDeInicioDelProyecto || Date.now()),
        new Date(attrs.datosDelProyecto?.fechaDeCierreDelProyecto || Date.now()),
        attrs.datosDelProyecto?.contextoDeLaProblematica || '',
        attrs.datosDelProyecto?.problematica || '',
        attrs.datosDelProyecto?.objetivoGeneralDelProyectoADesarrollar || '',
        attrs.datosDelProyecto?.objetivosEspecificosDelProyecto || '',
        attrs.datosDelProyecto?.principalesActividadesARealizarEnLaEstanciaOEstadia || '',
        attrs.datosDelProyecto?.entregablesPlaneadosDelProyecto || '',
        attrs.datosDelProyecto?.tecnologiasAAplicarEnElProyecto || ''
      );

      estatus = attrs.estatus || 'PENDIENTE';
    } else if (attrs.empresa) {
      // Estructura de compatibilidad (antigua)
      direccionEmpresa = new DireccionEmpresa(
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

      empresaCompleta = new EmpresaCompleta(
        attrs.empresa.nombreCorto,
        attrs.empresa.razonSocial,
        attrs.empresa.rfc,
        direccionEmpresa,
        attrs.empresa.paginaWeb,
        attrs.empresa.linkedin,
        attrs.empresa.sector
      );

      contacto = new Contacto(
        attrs.contacto.nombre,
        attrs.contacto.puesto,
        attrs.contacto.email,
        attrs.contacto.telefono,
        attrs.contacto.area
      );

      supervisor = new Supervisor(
        attrs.supervisor.nombre,
        attrs.supervisor.area,
        attrs.supervisor.email,
        attrs.supervisor.telefono
      );

      proyectoCompleto = new ProyectoCompleto(
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

      estatus = 'PENDIENTE';
    } else {
      throw new Error('Estructura de datos de propuesta no reconocida');
    }

    // Obtener tipo de pasantía
    const tipoPasantia = attrs.informacionDelAlumno?.pasantiaARealizar || attrs.tipoPasantia || 'No especificado';
    const idConvocatoria = attrs.idConvocatoria || 0;

    return new PropuestaCompleta(
      data.id,                    // UUID
      0,                         // numericId (no disponible desde el frontend)
      idConvocatoria,            // idConvocatoria
      estudiante,                // NUEVO: información del estudiante
      tutorAcademico,            // tutorAcademico
      tipoPasantia,              // tipoPasantia
      empresaCompleta,           // empresa
      contacto,                  // contacto
      supervisor,                // supervisor
      proyectoCompleto,          // proyecto
      estatus,                   // estatus
      attrs.active !== false,    // active (por defecto true)
      new Date(attrs.createdAt || Date.now()),  // createdAt
      new Date(attrs.updatedAt || Date.now())   // updatedAt
    );
  }
}