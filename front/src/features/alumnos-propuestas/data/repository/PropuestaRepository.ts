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
    let tutorAcademico: TutorAcademico;
    let tipoPasantia: string;
    let nombreCortoEmpresa: string | null;
    let razonSocial: string;
    let rfc: string;
    let direccionData: any;
    let paginaWeb: string | null;
    let linkedin: string | null;
    let contactoData: any;
    let supervisorData: any;
    let proyectoData: any;
    let estatus: ProposalStatus;
    
    // Determinar estructura de respuesta y mapear campos
    if (attrs.informacionDelAlumno) {
      // Nueva estructura por secciones
      tutorAcademico = new TutorAcademico(
        attrs.informacionDelAlumno.tutorAcademico.id,
        attrs.informacionDelAlumno.tutorAcademico.nombre,
        attrs.informacionDelAlumno.tutorAcademico.email
      );
      tipoPasantia = attrs.informacionDelAlumno.pasantiaARealizar;
      
      nombreCortoEmpresa = attrs.informacionDeLaEmpresa?.nombreCorto || null;
      razonSocial = attrs.informacionDeLaEmpresa?.nombreLegal || '';
      rfc = attrs.informacionDeLaEmpresa?.rfc || '';
      
      const direccionInfo = attrs.direccionFisicaYEnLaWebDeLaEmpresa;
      direccionData = {
        estado: direccionInfo?.entidadFederativa || '',
        municipio: direccionInfo?.demarcacionTerritorial || '',
        tipoAsentamiento: direccionInfo?.tipoDeAsentamientoHumano || '',
        nombreAsentamiento: direccionInfo?.nombreDelAsentamientoHumano || '',
        tipoVialidad: direccionInfo?.vialidad || '',
        nombreVia: direccionInfo?.nombreDeLaVia || '',
        numeroExterior: direccionInfo?.numeroExterior || '',
        numeroInterior: direccionInfo?.numeroInterior || null,
        codigoPostal: direccionInfo?.codigoPostal || ''
      };
      
      paginaWeb = direccionInfo?.paginaWeb || null;
      linkedin = direccionInfo?.linkedin || null;
      
      const contactoInfo = attrs.informacionDeContactoEnLaEmpresa;
      contactoData = {
        nombre: contactoInfo?.nombreDeLaPersonaDeContacto || '',
        puesto: contactoInfo?.puestoEnLaEmpresaDeLaPersonaDeContacto || '',
        email: contactoInfo?.direccionElectronicaDeCorreo || '',
        telefono: contactoInfo?.numeroTelefonico || '',
        area: contactoInfo?.nombreDelAreaAsociada || ''
      };
      
      const supervisorInfo = attrs.supervisorDelProyectoDeEstanciaOEstadia;
      supervisorData = {
        nombre: supervisorInfo?.nombreDelSupervisor || '',
        area: supervisorInfo?.areaDeLaEmpresaEnLaQueSeDesarrollaraElProyecto || '',
        email: supervisorInfo?.direccionElectronicaDeCorreo || '',
        telefono: supervisorInfo?.numeroDeTelefono || ''
      };
      
      const proyectoInfo = attrs.datosDelProyecto;
      proyectoData = {
        nombre: proyectoInfo?.nombreDelProyecto || '',
        fechaInicio: proyectoInfo?.fechaDeInicioDelProyecto || '',
        fechaFin: proyectoInfo?.fechaDeCierreDelProyecto || '',
        contextoProblema: proyectoInfo?.contextoDeLaProblematica || '',
        descripcionProblema: proyectoInfo?.problematica || '',
        objetivoGeneral: proyectoInfo?.objetivoGeneralDelProyectoADesarrollar || '',
        objetivosEspecificos: proyectoInfo?.objetivosEspecificosDelProyecto || '',
        actividadesPrincipales: proyectoInfo?.principalesActividadesARealizarEnLaEstanciaOEstadia || '',
        entregablesPlaneados: proyectoInfo?.entregablesPlaneadosDelProyecto || '',
        tecnologias: proyectoInfo?.tecnologiasAAplicarEnElProyecto || ''
      };
      
      estatus = attrs.estatus || 'PENDIENTE';
      
    } else {
      // Estructura de compatibilidad (formato anterior)
      tutorAcademico = new TutorAcademico(
        attrs.tutorAcademico?.id || 0,
        attrs.tutorAcademico?.nombre || '',
        attrs.tutorAcademico?.email || ''
      );
      tipoPasantia = attrs.tipoPasantia || '';
      
      nombreCortoEmpresa = attrs.empresa?.nombreCorto || null;
      razonSocial = attrs.empresa?.razonSocial || '';
      rfc = attrs.empresa?.rfc || '';
      
      direccionData = {
        estado: attrs.empresa?.direccion?.estado || '',
        municipio: attrs.empresa?.direccion?.municipio || '',
        tipoAsentamiento: attrs.empresa?.direccion?.tipoAsentamiento || '',
        nombreAsentamiento: attrs.empresa?.direccion?.nombreAsentamiento || '',
        tipoVialidad: attrs.empresa?.direccion?.tipoVialidad || '',
        nombreVia: attrs.empresa?.direccion?.nombreVia || '',
        numeroExterior: attrs.empresa?.direccion?.numeroExterior || '',
        numeroInterior: attrs.empresa?.direccion?.numeroInterior || null,
        codigoPostal: attrs.empresa?.direccion?.codigoPostal || ''
      };
      
      paginaWeb = attrs.empresa?.paginaWeb || null;
      linkedin = attrs.empresa?.linkedin || null;
      
      contactoData = {
        nombre: attrs.contacto?.nombre || '',
        puesto: attrs.contacto?.puesto || '',
        email: attrs.contacto?.email || '',
        telefono: attrs.contacto?.telefono || '',
        area: attrs.contacto?.area || ''
      };
      
      supervisorData = {
        nombre: attrs.supervisor?.nombre || '',
        area: attrs.supervisor?.area || '',
        email: attrs.supervisor?.email || '',
        telefono: attrs.supervisor?.telefono || ''
      };
      
      proyectoData = {
        nombre: attrs.proyecto?.nombre || '',
        fechaInicio: attrs.proyecto?.fechaInicio || '',
        fechaFin: attrs.proyecto?.fechaFin || '',
        contextoProblema: attrs.proyecto?.contextoProblema || '',
        descripcionProblema: attrs.proyecto?.descripcionProblema || '',
        objetivoGeneral: attrs.proyecto?.objetivoGeneral || '',
        objetivosEspecificos: attrs.proyecto?.objetivosEspecificos || '',
        actividadesPrincipales: attrs.proyecto?.actividadesPrincipales || '',
        entregablesPlaneados: attrs.proyecto?.entregablesPlaneados || '',
        tecnologias: attrs.proyecto?.tecnologias || ''
      };
      
      estatus = attrs.estatus || 'PENDIENTE';
    }

    // Crear objetos del dominio
    const direccion = new DireccionEmpresa(
      direccionData.estado,
      direccionData.municipio,
      direccionData.tipoAsentamiento,
      direccionData.nombreAsentamiento,
      direccionData.tipoVialidad,
      direccionData.nombreVia,
      direccionData.numeroExterior,
      direccionData.numeroInterior,
      direccionData.codigoPostal
    );

    const empresa = new EmpresaCompleta(
      nombreCortoEmpresa,
      razonSocial,
      rfc,
      direccion,
      paginaWeb,
      linkedin,
      contactoData.area // El sector se toma del área de contacto
    );

    const contacto = new Contacto(
      contactoData.nombre,
      contactoData.puesto,
      contactoData.email,
      contactoData.telefono,
      contactoData.area
    );

    const supervisor = new Supervisor(
      supervisorData.nombre,
      supervisorData.area,
      supervisorData.email,
      supervisorData.telefono
    );

    const proyecto = new ProyectoCompleto(
      proyectoData.nombre,
      new Date(proyectoData.fechaInicio),
      new Date(proyectoData.fechaFin),
      proyectoData.contextoProblema,
      proyectoData.descripcionProblema,
      proyectoData.objetivoGeneral,
      proyectoData.objetivosEspecificos,
      proyectoData.actividadesPrincipales,
      proyectoData.entregablesPlaneados,
      proyectoData.tecnologias
    );

    // Crear Propuesta Completa
    return new PropuestaCompleta(
      data.id,
      parseInt(data.id), // numericId
      attrs.idConvocatoria || 0,
      tutorAcademico,
      tipoPasantia,
      empresa,
      contacto,
      supervisor,
      proyecto,
      estatus,
      attrs.active !== false,
      new Date(attrs.createdAt || new Date()),
      new Date(attrs.updatedAt || new Date())
    );
  }
}