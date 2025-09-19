// src/features/alumnos-propuestas/domain/CreatePropuestaUseCase.ts
import { PropuestaRepository } from "../data/repository/PropuestaRepository";
import { CreatePropuestaRequest } from "../data/models/PropuestaDTO";
import { Propuesta } from "../data/models/Propuesta";

export interface CreatePropuestaParams {
  academicTutorId: number;
  internshipType: string;
  
  // Información de la empresa
  companyShortName: string;
  companyLegalName: string;
  companyTaxId: string;
  
  // Dirección de la empresa
  companyState: string;
  companyMunicipality: string;
  companySettlementType: string;
  companySettlementName: string;
  companyStreetType: string;
  companyStreetName: string;
  companyExteriorNumber: string;
  companyInteriorNumber?: string | null;
  companyPostalCode: string;
  companyWebsite?: string | null;
  companyLinkedin?: string | null;
  
  // Información de contacto
  contactName: string;
  contactPosition: string;
  contactEmail: string;
  contactPhone: string;
  contactArea: string;
  
  // Supervisor del proyecto
  supervisorName: string;
  supervisorArea: string;
  supervisorEmail: string;
  supervisorPhone: string;
  
  // Datos del proyecto
  projectName: string;
  projectStartDate: Date;
  projectEndDate: Date;
  projectProblemContext: string;
  projectProblemDescription: string;
  projectGeneralObjective: string;
  projectSpecificObjectives: string;
  projectMainActivities: string;
  projectPlannedDeliverables: string;
  projectTechnologies: string;
}

export class CreatePropuestaUseCase {
  constructor(private repository: PropuestaRepository) {}

  async execute(params: CreatePropuestaParams): Promise<Propuesta> {
    // Validaciones de negocio
    this.validateParams(params);

    // Crear la solicitud
    const request: CreatePropuestaRequest = {
      academicTutorId: params.academicTutorId,
      internshipType: params.internshipType,
      
      // Información de la empresa
      companyShortName: params.companyShortName.trim(),
      companyLegalName: params.companyLegalName.trim(),
      companyTaxId: params.companyTaxId.trim(),
      
      // Dirección de la empresa
      companyState: params.companyState.trim(),
      companyMunicipality: params.companyMunicipality.trim(),
      companySettlementType: params.companySettlementType.trim(),
      companySettlementName: params.companySettlementName.trim(),
      companyStreetType: params.companyStreetType.trim(),
      companyStreetName: params.companyStreetName.trim(),
      companyExteriorNumber: params.companyExteriorNumber.trim(),
      companyInteriorNumber: params.companyInteriorNumber?.trim() || null,
      companyPostalCode: params.companyPostalCode.trim(),
      companyWebsite: params.companyWebsite?.trim() || null,
      companyLinkedin: params.companyLinkedin?.trim() || null,
      
      // Información de contacto
      contactName: params.contactName.trim(),
      contactPosition: params.contactPosition.trim(),
      contactEmail: params.contactEmail.trim(),
      contactPhone: params.contactPhone.trim(),
      contactArea: params.contactArea.trim(),
      
      // Supervisor del proyecto
      supervisorName: params.supervisorName.trim(),
      supervisorArea: params.supervisorArea.trim(),
      supervisorEmail: params.supervisorEmail.trim(),
      supervisorPhone: params.supervisorPhone.trim(),
      
      // Datos del proyecto
      projectName: params.projectName.trim(),
      projectStartDate: params.projectStartDate.toISOString().split('T')[0],
      projectEndDate: params.projectEndDate.toISOString().split('T')[0],
      projectProblemContext: params.projectProblemContext.trim(),
      projectProblemDescription: params.projectProblemDescription.trim(),
      projectGeneralObjective: params.projectGeneralObjective.trim(),
      projectSpecificObjectives: params.projectSpecificObjectives.trim(),
      projectMainActivities: params.projectMainActivities.trim(),
      projectPlannedDeliverables: params.projectPlannedDeliverables.trim(),
      projectTechnologies: params.projectTechnologies.trim()
    };

    const propuesta = await this.repository.createPropuesta(request);
    
    if (!propuesta) {
      throw new Error("Error al crear la propuesta");
    }

    return propuesta;
  }

  private validateParams(params: CreatePropuestaParams): void {
    // Validaciones básicas
    if (!params.academicTutorId) {
      throw new Error("Debe seleccionar un tutor académico");
    }

    if (!params.internshipType || params.internshipType.trim() === "") {
      throw new Error("Debe seleccionar un tipo de pasantía");
    }

    // Validaciones de empresa
    if (!params.companyShortName || params.companyShortName.trim() === "") {
      throw new Error("El nombre corto de la empresa es obligatorio");
    }

    if (!params.companyLegalName || params.companyLegalName.trim() === "") {
      throw new Error("El nombre legal de la empresa es obligatorio");
    }

    if (!params.companyTaxId || params.companyTaxId.trim() === "") {
      throw new Error("El RFC de la empresa es obligatorio");
    }

    // Validaciones de dirección
    if (!params.companyState || params.companyState.trim() === "") {
      throw new Error("El estado es obligatorio");
    }

    if (!params.companyMunicipality || params.companyMunicipality.trim() === "") {
      throw new Error("El municipio es obligatorio");
    }

    if (!params.companySettlementType || params.companySettlementType.trim() === "") {
      throw new Error("El tipo de asentamiento es obligatorio");
    }

    if (!params.companySettlementName || params.companySettlementName.trim() === "") {
      throw new Error("El nombre del asentamiento es obligatorio");
    }

    if (!params.companyStreetType || params.companyStreetType.trim() === "") {
      throw new Error("El tipo de vialidad es obligatorio");
    }

    if (!params.companyStreetName || params.companyStreetName.trim() === "") {
      throw new Error("El nombre de la vialidad es obligatorio");
    }

    if (!params.companyExteriorNumber || params.companyExteriorNumber.trim() === "") {
      throw new Error("El número exterior es obligatorio");
    }

    if (!params.companyPostalCode || params.companyPostalCode.trim() === "") {
      throw new Error("El código postal es obligatorio");
    }

    // Validaciones de contacto
    if (!params.contactName || params.contactName.trim() === "") {
      throw new Error("El nombre de la persona de contacto es obligatorio");
    }

    if (!params.contactPosition || params.contactPosition.trim() === "") {
      throw new Error("El puesto de la persona de contacto es obligatorio");
    }

    if (!params.contactEmail || params.contactEmail.trim() === "") {
      throw new Error("El email de contacto es obligatorio");
    }

    if (!params.contactPhone || params.contactPhone.trim() === "") {
      throw new Error("El teléfono de contacto es obligatorio");
    }

    if (!params.contactArea || params.contactArea.trim() === "") {
      throw new Error("El área de contacto es obligatorio");
    }

    // Validaciones de supervisor
    if (!params.supervisorName || params.supervisorName.trim() === "") {
      throw new Error("El nombre del supervisor es obligatorio");
    }

    if (!params.supervisorArea || params.supervisorArea.trim() === "") {
      throw new Error("El área del supervisor es obligatorio");
    }

    if (!params.supervisorEmail || params.supervisorEmail.trim() === "") {
      throw new Error("El email del supervisor es obligatorio");
    }

    if (!params.supervisorPhone || params.supervisorPhone.trim() === "") {
      throw new Error("El teléfono del supervisor es obligatorio");
    }

    // Validaciones de proyecto
    if (!params.projectName || params.projectName.trim() === "") {
      throw new Error("El nombre del proyecto es obligatorio");
    }

    if (!params.projectProblemContext || params.projectProblemContext.trim() === "") {
      throw new Error("El contexto del problema es obligatorio");
    }

    if (!params.projectProblemDescription || params.projectProblemDescription.trim() === "") {
      throw new Error("La descripción del problema es obligatorio");
    }

    if (!params.projectGeneralObjective || params.projectGeneralObjective.trim() === "") {
      throw new Error("El objetivo general es obligatorio");
    }

    if (!params.projectSpecificObjectives || params.projectSpecificObjectives.trim() === "") {
      throw new Error("Los objetivos específicos son obligatorios");
    }

    if (!params.projectMainActivities || params.projectMainActivities.trim() === "") {
      throw new Error("Las actividades principales son obligatorias");
    }

    if (!params.projectPlannedDeliverables || params.projectPlannedDeliverables.trim() === "") {
      throw new Error("Los entregables planeados son obligatorios");
    }

    if (!params.projectTechnologies || params.projectTechnologies.trim() === "") {
      throw new Error("Las tecnologías son obligatorias");
    }

    // Validar fechas
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (params.projectStartDate < hoy) {
      throw new Error("La fecha de inicio no puede ser anterior a hoy");
    }

    if (params.projectEndDate <= params.projectStartDate) {
      throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
    }

    // Validar duración mínima
    const diffTime = Math.abs(params.projectEndDate.getTime() - params.projectStartDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 30) {
      throw new Error("El proyecto debe tener una duración mínima de 30 días");
    }
  }
}