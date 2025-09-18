import { PropuestaRepository, PropuestaUpdateData } from "../domain/interfaces/propuestaRepository";
import { Propuesta } from "../domain/models/propuesta";

export class UpdatePropuestaUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(
        uuid: string,
        updateData: Partial<{
            // Relaciones
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
            companyInteriorNumber: string | null;
            companyPostalCode: string;
            companyWebsite: string | null;
            companyLinkedin: string | null;
            
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
        }>
    ): Promise<Propuesta | null> {
        try {
            // Obtener la propuesta actual para validaciones
            const propuestaActual = await this.propuestaRepository.getPropuesta(uuid);
            if (!propuestaActual) {
                throw new Error("Propuesta no encontrada");
            }

            // Obtener la convocatoria activa para validaciones
            const convocatoriaActiva = await this.propuestaRepository.getActiveConvocatoria();
            if (!convocatoriaActiva) {
                throw new Error("No hay una convocatoria activa disponible");
            }

            // Verificar que la propuesta pertenece a la convocatoria activa
            if (propuestaActual.getConvocatoriaId() !== convocatoriaActiva.id) {
                throw new Error("Solo se pueden actualizar propuestas de la convocatoria activa");
            }

            // Validaciones de negocio
            this.validateUpdateData(updateData, convocatoriaActiva);

            // Validar fechas si se proporcionan
            if (updateData.projectStartDate !== undefined || updateData.projectEndDate !== undefined) {
                const nuevaFechaInicio = updateData.projectStartDate || propuestaActual.getProjectStartDate();
                const nuevaFechaFin = updateData.projectEndDate || propuestaActual.getProjectEndDate();

                this.validateDates(nuevaFechaInicio, nuevaFechaFin);
            }

            // Crear el objeto de actualización con trimming
            const propuestaUpdateData: PropuestaUpdateData = {};
            
            // Mapear todos los campos posibles
            if (updateData.academicTutorId !== undefined) {
                const tutorDisponible = convocatoriaActiva.profesoresDisponibles.find(
                    profesor => profesor.id === updateData.academicTutorId
                );
                if (!tutorDisponible) {
                    throw new Error("El tutor académico seleccionado no está disponible en la convocatoria actual");
                }
                propuestaUpdateData.academicTutorId = updateData.academicTutorId;
                propuestaUpdateData.academicTutorName = tutorDisponible.nombre;
                propuestaUpdateData.academicTutorEmail = tutorDisponible.email;
            }

            if (updateData.internshipType !== undefined) {
                if (!convocatoriaActiva.pasantiasDisponibles.includes(updateData.internshipType)) {
                    throw new Error("El tipo de pasantía seleccionado no está disponible en la convocatoria actual");
                }
                propuestaUpdateData.internshipType = updateData.internshipType;
            }

            // Información de empresa
            if (updateData.companyShortName !== undefined) {
                propuestaUpdateData.companyShortName = updateData.companyShortName.trim();
            }
            if (updateData.companyLegalName !== undefined) {
                propuestaUpdateData.companyLegalName = updateData.companyLegalName.trim();
            }
            if (updateData.companyTaxId !== undefined) {
                propuestaUpdateData.companyTaxId = updateData.companyTaxId.trim();
            }

            // Dirección
            if (updateData.companyState !== undefined) {
                propuestaUpdateData.companyState = updateData.companyState.trim();
            }
            if (updateData.companyMunicipality !== undefined) {
                propuestaUpdateData.companyMunicipality = updateData.companyMunicipality.trim();
            }
            if (updateData.companySettlementType !== undefined) {
                propuestaUpdateData.companySettlementType = updateData.companySettlementType.trim();
            }
            if (updateData.companySettlementName !== undefined) {
                propuestaUpdateData.companySettlementName = updateData.companySettlementName.trim();
            }
            if (updateData.companyStreetType !== undefined) {
                propuestaUpdateData.companyStreetType = updateData.companyStreetType.trim();
            }
            if (updateData.companyStreetName !== undefined) {
                propuestaUpdateData.companyStreetName = updateData.companyStreetName.trim();
            }
            if (updateData.companyExteriorNumber !== undefined) {
                propuestaUpdateData.companyExteriorNumber = updateData.companyExteriorNumber.trim();
            }
            if (updateData.companyInteriorNumber !== undefined) {
                propuestaUpdateData.companyInteriorNumber = updateData.companyInteriorNumber ? updateData.companyInteriorNumber.trim() : null;
            }
            if (updateData.companyPostalCode !== undefined) {
                propuestaUpdateData.companyPostalCode = updateData.companyPostalCode.trim();
            }
            if (updateData.companyWebsite !== undefined) {
                propuestaUpdateData.companyWebsite = updateData.companyWebsite ? updateData.companyWebsite.trim() : null;
            }
            if (updateData.companyLinkedin !== undefined) {
                propuestaUpdateData.companyLinkedin = updateData.companyLinkedin ? updateData.companyLinkedin.trim() : null;
            }

            // Contacto
            if (updateData.contactName !== undefined) {
                propuestaUpdateData.contactName = updateData.contactName.trim();
            }
            if (updateData.contactPosition !== undefined) {
                propuestaUpdateData.contactPosition = updateData.contactPosition.trim();
            }
            if (updateData.contactEmail !== undefined) {
                propuestaUpdateData.contactEmail = updateData.contactEmail.trim();
            }
            if (updateData.contactPhone !== undefined) {
                propuestaUpdateData.contactPhone = updateData.contactPhone.trim();
            }
            if (updateData.contactArea !== undefined) {
                propuestaUpdateData.contactArea = updateData.contactArea.trim();
            }

            // Supervisor
            if (updateData.supervisorName !== undefined) {
                propuestaUpdateData.supervisorName = updateData.supervisorName.trim();
            }
            if (updateData.supervisorArea !== undefined) {
                propuestaUpdateData.supervisorArea = updateData.supervisorArea.trim();
            }
            if (updateData.supervisorEmail !== undefined) {
                propuestaUpdateData.supervisorEmail = updateData.supervisorEmail.trim();
            }
            if (updateData.supervisorPhone !== undefined) {
                propuestaUpdateData.supervisorPhone = updateData.supervisorPhone.trim();
            }

            // Proyecto
            if (updateData.projectName !== undefined) {
                propuestaUpdateData.projectName = updateData.projectName.trim();
            }
            if (updateData.projectStartDate !== undefined) {
                propuestaUpdateData.projectStartDate = updateData.projectStartDate;
            }
            if (updateData.projectEndDate !== undefined) {
                propuestaUpdateData.projectEndDate = updateData.projectEndDate;
            }
            if (updateData.projectProblemContext !== undefined) {
                propuestaUpdateData.projectProblemContext = updateData.projectProblemContext.trim();
            }
            if (updateData.projectProblemDescription !== undefined) {
                propuestaUpdateData.projectProblemDescription = updateData.projectProblemDescription.trim();
            }
            if (updateData.projectGeneralObjective !== undefined) {
                propuestaUpdateData.projectGeneralObjective = updateData.projectGeneralObjective.trim();
            }
            if (updateData.projectSpecificObjectives !== undefined) {
                propuestaUpdateData.projectSpecificObjectives = updateData.projectSpecificObjectives.trim();
            }
            if (updateData.projectMainActivities !== undefined) {
                propuestaUpdateData.projectMainActivities = updateData.projectMainActivities.trim();
            }
            if (updateData.projectPlannedDeliverables !== undefined) {
                propuestaUpdateData.projectPlannedDeliverables = updateData.projectPlannedDeliverables.trim();
            }
            if (updateData.projectTechnologies !== undefined) {
                propuestaUpdateData.projectTechnologies = updateData.projectTechnologies.trim();
            }

            // Verificar que haya al menos un campo para actualizar
            if (Object.keys(propuestaUpdateData).length === 0) {
                throw new Error("No hay campos para actualizar");
            }

            return await this.propuestaRepository.updatePropuesta(uuid, propuestaUpdateData);
        } catch (error) {
            console.error("Error in UpdatePropuestaUseCase:", error);
            throw error;
        }
    }

    private validateUpdateData(updateData: any, convocatoria: any): void {
        // Validar campos obligatorios si se proporcionan
        if (updateData.companyShortName !== undefined && (!updateData.companyShortName || !updateData.companyShortName.trim())) {
            throw new Error("El nombre corto de la empresa es obligatorio");
        }
        if (updateData.companyLegalName !== undefined && (!updateData.companyLegalName || !updateData.companyLegalName.trim())) {
            throw new Error("El nombre legal de la empresa es obligatorio");
        }
        if (updateData.companyTaxId !== undefined && (!updateData.companyTaxId || !updateData.companyTaxId.trim())) {
            throw new Error("El RFC de la empresa es obligatorio");
        }
        if (updateData.projectName !== undefined && (!updateData.projectName || !updateData.projectName.trim())) {
            throw new Error("El nombre del proyecto es obligatorio");
        }
        if (updateData.contactName !== undefined && (!updateData.contactName || !updateData.contactName.trim())) {
            throw new Error("El nombre de la persona de contacto es obligatorio");
        }
        if (updateData.supervisorName !== undefined && (!updateData.supervisorName || !updateData.supervisorName.trim())) {
            throw new Error("El nombre del supervisor es obligatorio");
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

        // Validar que el proyecto tenga una duración mínima (ejemplo: 30 días)
        const diffTime = Math.abs(projectEndDate.getTime() - projectStartDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 30) {
            throw new Error("El proyecto debe tener una duración mínima de 30 días");
        }
    }
}
