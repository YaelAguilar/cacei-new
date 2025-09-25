// src/features/alumnos-propuestas/domain/UpdatePropuestaUseCase.ts
import { PropuestaRepository } from "../data/repository/PropuestaRepository";
import { UpdatePropuestaRequest } from "../data/models/PropuestaDTO";
import { PropuestaCompleta } from "../data/models/Propuesta";

export interface UpdatePropuestaParams {
  // Relaciones
  academicTutorId?: number;
  internshipType?: string;
  
  // Información de la empresa
  companyShortName?: string;
  companyLegalName?: string;
  companyTaxId?: string;
  
  // Dirección de la empresa
  companyState?: string;
  companyMunicipality?: string;
  companySettlementType?: string;
  companySettlementName?: string;
  companyStreetType?: string;
  companyStreetName?: string;
  companyExteriorNumber?: string;
  companyInteriorNumber?: string | null;
  companyPostalCode?: string;
  companyWebsite?: string | null;
  companyLinkedin?: string | null;
  
  // Información de contacto
  contactName?: string;
  contactPosition?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactArea?: string;
  
  // Supervisor del proyecto
  supervisorName?: string;
  supervisorArea?: string;
  supervisorEmail?: string;
  supervisorPhone?: string;
  
  // Datos del proyecto
  projectName?: string;
  projectStartDate?: Date;
  projectEndDate?: Date;
  projectProblemContext?: string;
  projectProblemDescription?: string;
  projectGeneralObjective?: string;
  projectSpecificObjectives?: string;
  projectMainActivities?: string;
  projectPlannedDeliverables?: string;
  projectTechnologies?: string;
}

export class UpdatePropuestaUseCase {
  constructor(private repository: PropuestaRepository) {}

  async execute(uuid: string, params: UpdatePropuestaParams): Promise<PropuestaCompleta | null> {
    try {
      // Validaciones básicas
      if (!uuid || uuid.trim() === '') {
        throw new Error('El UUID de la propuesta es obligatorio');
      }

      // Verificar que hay al menos un campo para actualizar
      if (Object.keys(params).length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      // Validar fechas si se proporcionan
      if (params.projectStartDate && params.projectEndDate) {
        this.validateDates(params.projectStartDate, params.projectEndDate);
      }

      // Crear la solicitud de actualización
      const request: UpdatePropuestaRequest = {};

      // Mapear todos los campos opcionales
      if (params.academicTutorId !== undefined) {
        request.academicTutorId = params.academicTutorId;
      }
      if (params.internshipType !== undefined) {
        request.internshipType = params.internshipType;
      }

      // Información de empresa
      if (params.companyShortName !== undefined) {
        request.companyShortName = params.companyShortName || null;
      }
      if (params.companyLegalName !== undefined) {
        request.companyLegalName = params.companyLegalName;
      }
      if (params.companyTaxId !== undefined) {
        request.companyTaxId = params.companyTaxId;
      }

      // Dirección
      if (params.companyState !== undefined) {
        request.companyState = params.companyState;
      }
      if (params.companyMunicipality !== undefined) {
        request.companyMunicipality = params.companyMunicipality;
      }
      if (params.companySettlementType !== undefined) {
        request.companySettlementType = params.companySettlementType;
      }
      if (params.companySettlementName !== undefined) {
        request.companySettlementName = params.companySettlementName;
      }
      if (params.companyStreetType !== undefined) {
        request.companyStreetType = params.companyStreetType;
      }
      if (params.companyStreetName !== undefined) {
        request.companyStreetName = params.companyStreetName;
      }
      if (params.companyExteriorNumber !== undefined) {
        request.companyExteriorNumber = params.companyExteriorNumber;
      }
      if (params.companyInteriorNumber !== undefined) {
        request.companyInteriorNumber = params.companyInteriorNumber;
      }
      if (params.companyPostalCode !== undefined) {
        request.companyPostalCode = params.companyPostalCode;
      }
      if (params.companyWebsite !== undefined) {
        request.companyWebsite = params.companyWebsite;
      }
      if (params.companyLinkedin !== undefined) {
        request.companyLinkedin = params.companyLinkedin;
      }

      // Contacto
      if (params.contactName !== undefined) {
        request.contactName = params.contactName;
      }
      if (params.contactPosition !== undefined) {
        request.contactPosition = params.contactPosition;
      }
      if (params.contactEmail !== undefined) {
        request.contactEmail = params.contactEmail;
      }
      if (params.contactPhone !== undefined) {
        request.contactPhone = params.contactPhone;
      }
      if (params.contactArea !== undefined) {
        request.contactArea = params.contactArea;
      }

      // Supervisor
      if (params.supervisorName !== undefined) {
        request.supervisorName = params.supervisorName;
      }
      if (params.supervisorArea !== undefined) {
        request.supervisorArea = params.supervisorArea;
      }
      if (params.supervisorEmail !== undefined) {
        request.supervisorEmail = params.supervisorEmail;
      }
      if (params.supervisorPhone !== undefined) {
        request.supervisorPhone = params.supervisorPhone;
      }

      // Proyecto
      if (params.projectName !== undefined) {
        request.projectName = params.projectName;
      }
      if (params.projectStartDate !== undefined) {
        request.projectStartDate = params.projectStartDate.toISOString().split('T')[0];
      }
      if (params.projectEndDate !== undefined) {
        request.projectEndDate = params.projectEndDate.toISOString().split('T')[0];
      }
      if (params.projectProblemContext !== undefined) {
        request.projectProblemContext = params.projectProblemContext;
      }
      if (params.projectProblemDescription !== undefined) {
        request.projectProblemDescription = params.projectProblemDescription;
      }
      if (params.projectGeneralObjective !== undefined) {
        request.projectGeneralObjective = params.projectGeneralObjective;
      }
      if (params.projectSpecificObjectives !== undefined) {
        request.projectSpecificObjectives = params.projectSpecificObjectives;
      }
      if (params.projectMainActivities !== undefined) {
        request.projectMainActivities = params.projectMainActivities;
      }
      if (params.projectPlannedDeliverables !== undefined) {
        request.projectPlannedDeliverables = params.projectPlannedDeliverables;
      }
      if (params.projectTechnologies !== undefined) {
        request.projectTechnologies = params.projectTechnologies;
      }

      const updatedPropuesta = await this.repository.updatePropuesta(uuid.trim(), request);
      
      if (!updatedPropuesta) {
        throw new Error("No se pudo actualizar la propuesta. Verifique que la propuesta exista y esté activa.");
      }

      return updatedPropuesta;
    } catch (error) {
      console.error("Error en UpdatePropuestaUseCase:", error);
      throw error;
    }
  }

  private validateDates(projectStartDate: Date, projectEndDate: Date): void {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (projectStartDate < hoy) {
      throw new Error("La fecha de inicio no puede ser anterior a hoy");
    }

    if (projectEndDate <= projectStartDate) {
      throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
    }

    // Validar duración mínima
    const diffTime = Math.abs(projectEndDate.getTime() - projectStartDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 30) {
      throw new Error("El proyecto debe tener una duración mínima de 30 días");
    }
  }
}