// src/propuestas/application/createPropuestaUseCase.ts
import { PropuestaRepository, PropuestaCreateData } from "../domain/interfaces/propuestaRepository";
import { Propuesta } from "../domain/models/propuesta";

export class CreatePropuestaUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(
        studentId: number,
        studentName: string, // NUEVO: Nombre completo del estudiante
        studentEmail: string, // NUEVO: Email del estudiante
        academicTutorId: number,
        internshipType: string,
        
        // Información de la empresa (sección)
        companyShortName: string | null, // OPCIONAL
        companyLegalName: string,
        companyTaxId: string,
        
        // Dirección física y en la web de la empresa (sección)
        companyState: string,
        companyMunicipality: string,
        companySettlementType: string,
        companySettlementName: string,
        companyStreetType: string,
        companyStreetName: string,
        companyExteriorNumber: string,
        companyInteriorNumber: string | null, // OPCIONAL
        companyPostalCode: string,
        companyWebsite: string | null, // OPCIONAL
        companyLinkedin: string | null, // OPCIONAL
        
        // Información de contacto en la empresa (sección)
        contactName: string,
        contactPosition: string,
        contactEmail: string,
        contactPhone: string,
        contactArea: string,
        
        // Supervisor del proyecto (sección)
        supervisorName: string,
        supervisorArea: string,
        supervisorEmail: string,
        supervisorPhone: string,
        
        // Datos del proyecto (sección)
        projectName: string,
        projectStartDate: Date,
        projectEndDate: Date,
        projectProblemContext: string,
        projectProblemDescription: string,
        projectGeneralObjective: string,
        projectSpecificObjectives: string,
        projectMainActivities: string,
        projectPlannedDeliverables: string,
        projectTechnologies: string,
        
        userCreation?: number | null
    ): Promise<Propuesta | null> {
        try {
            // Verificar que existe una convocatoria activa
            const convocatoriaActiva = await this.propuestaRepository.getActiveConvocatoria();
            if (!convocatoriaActiva) {
                throw new Error("No hay una convocatoria activa disponible");
            }

            // Verificar que el estudiante no tenga ya una propuesta en esta convocatoria
            const existePropuesta = await this.propuestaRepository.checkExistingPropuesta(
                studentId, 
                convocatoriaActiva.id
            );
            if (existePropuesta) {
                throw new Error("Ya tienes una propuesta registrada en la convocatoria actual");
            }

            // Validaciones de negocio con campos opcionales
            this.validateBusinessRules(
                studentName, studentEmail, // NUEVAS VALIDACIONES
                companyLegalName, companyTaxId,
                companyState, companyMunicipality, companySettlementType, companySettlementName,
                companyStreetType, companyStreetName, companyExteriorNumber, companyPostalCode,
                contactName, contactPosition, contactEmail, contactPhone, contactArea,
                supervisorName, supervisorArea, supervisorEmail, supervisorPhone,
                projectName, projectStartDate, projectEndDate, projectProblemContext,
                projectProblemDescription, projectGeneralObjective, projectSpecificObjectives,
                projectMainActivities, projectPlannedDeliverables, projectTechnologies
            );

            // Validar fechas
            this.validateDates(projectStartDate, projectEndDate);

            // Verificar que el tipo de pasantía esté disponible en la convocatoria
            console.log('🔍 Tipo de pasantía seleccionado:', internshipType);
            console.log('🔍 Pasantías disponibles en convocatoria:', convocatoriaActiva.pasantiasDisponibles);
            if (!convocatoriaActiva.pasantiasDisponibles.includes(internshipType)) {
                throw new Error(`El tipo de pasantía seleccionado "${internshipType}" no está disponible en la convocatoria actual. Pasantías disponibles: ${convocatoriaActiva.pasantiasDisponibles.join(', ')}`);
            }

            // Verificar que el tutor académico esté disponible en la convocatoria
            console.log('🔍 Buscando tutor académico con ID:', academicTutorId);
            console.log('🔍 Profesores disponibles:', convocatoriaActiva.profesoresDisponibles);
            const tutorDisponible = convocatoriaActiva.profesoresDisponibles.find(
                profesor => profesor.id === academicTutorId
            );
            console.log('🔍 Tutor encontrado:', tutorDisponible);
            if (!tutorDisponible) {
                throw new Error("El tutor académico seleccionado no está disponible en la convocatoria actual");
            }

            // Crear los datos para la propuesta
            const propuestaData: PropuestaCreateData = {
                convocatoriaId: convocatoriaActiva.id,
                studentId,
                studentName: studentName.trim(), // NUEVO
                studentEmail: studentEmail.trim(), // NUEVO
                academicTutorId,
                academicTutorName: tutorDisponible.nombre,
                academicTutorEmail: tutorDisponible.email,
                internshipType,
                
                // Información de la empresa (sección) - manejo de campos opcionales
                companyShortName: companyShortName ? companyShortName.trim() : null,
                companyLegalName: companyLegalName.trim(),
                companyTaxId: companyTaxId.trim(),
                
                // Dirección física y en la web de la empresa (sección)
                companyState: companyState.trim(),
                companyMunicipality: companyMunicipality.trim(),
                companySettlementType: companySettlementType.trim(),
                companySettlementName: companySettlementName.trim(),
                companyStreetType: companyStreetType.trim(),
                companyStreetName: companyStreetName.trim(),
                companyExteriorNumber: companyExteriorNumber.trim(),
                companyInteriorNumber: companyInteriorNumber ? companyInteriorNumber.trim() : null,
                companyPostalCode: companyPostalCode.trim(),
                companyWebsite: companyWebsite ? companyWebsite.trim() : null,
                companyLinkedin: companyLinkedin ? companyLinkedin.trim() : null,
                
                // Información de contacto en la empresa (sección)
                contactName: contactName.trim(),
                contactPosition: contactPosition.trim(),
                contactEmail: contactEmail.trim(),
                contactPhone: contactPhone.trim(),
                contactArea: contactArea.trim(),
                
                // Supervisor del proyecto (sección)
                supervisorName: supervisorName.trim(),
                supervisorArea: supervisorArea.trim(),
                supervisorEmail: supervisorEmail.trim(),
                supervisorPhone: supervisorPhone.trim(),
                
                // Datos del proyecto (sección)
                projectName: projectName.trim(),
                projectStartDate,
                projectEndDate,
                projectProblemContext: projectProblemContext.trim(),
                projectProblemDescription: projectProblemDescription.trim(),
                projectGeneralObjective: projectGeneralObjective.trim(),
                projectSpecificObjectives: projectSpecificObjectives.trim(),
                projectMainActivities: projectMainActivities.trim(),
                projectPlannedDeliverables: projectPlannedDeliverables.trim(),
                projectTechnologies: projectTechnologies.trim(),
                
                userCreation
            };

            return await this.propuestaRepository.createPropuesta(propuestaData);
        } catch (error) {
            console.error("Error in CreatePropuestaUseCase:", error);
            throw error;
        }
    }

    private validateBusinessRules(
        studentName: string, studentEmail: string, // NUEVOS PARÁMETROS
        companyLegalName: string, companyTaxId: string,
        companyState: string, companyMunicipality: string, companySettlementType: string,
        companySettlementName: string, companyStreetType: string, companyStreetName: string,
        companyExteriorNumber: string, companyPostalCode: string,
        contactName: string, contactPosition: string, contactEmail: string,
        contactPhone: string, contactArea: string,
        supervisorName: string, supervisorArea: string, supervisorEmail: string,
        supervisorPhone: string,
        projectName: string, projectStartDate: Date, projectEndDate: Date,
        projectProblemContext: string, projectProblemDescription: string,
        projectGeneralObjective: string, projectSpecificObjectives: string,
        projectMainActivities: string, projectPlannedDeliverables: string,
        projectTechnologies: string
    ): void {
        // NUEVAS VALIDACIONES PARA INFORMACIÓN DEL ESTUDIANTE
        if (!studentName || !studentName.trim()) {
            throw new Error("El nombre del estudiante es obligatorio");
        }
        if (!studentEmail || !studentEmail.trim()) {
            throw new Error("El email del estudiante es obligatorio");
        }
        
        // Validar formato de email del estudiante
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(studentEmail.trim())) {
            throw new Error("El formato del email del estudiante es inválido");
        }

        // Validar campos obligatorios de empresa (companyShortName es opcional)
        if (!companyLegalName || !companyLegalName.trim()) {
            throw new Error("El nombre legal de la empresa es obligatorio");
        }
        if (!companyTaxId || !companyTaxId.trim()) {
            throw new Error("El RFC de la empresa es obligatorio");
        }

        // Validar dirección (todos obligatorios, companyInteriorNumber es opcional)
        if (!companyState || !companyState.trim()) {
            throw new Error("La entidad federativa es obligatoria");
        }
        if (!companyMunicipality || !companyMunicipality.trim()) {
            throw new Error("La demarcación territorial es obligatoria");
        }
        if (!companySettlementType || !companySettlementType.trim()) {
            throw new Error("El tipo de asentamiento humano es obligatorio");
        }
        if (!companySettlementName || !companySettlementName.trim()) {
            throw new Error("El nombre del asentamiento humano es obligatorio");
        }
        if (!companyStreetType || !companyStreetType.trim()) {
            throw new Error("El tipo de vialidad es obligatorio");
        }
        if (!companyStreetName || !companyStreetName.trim()) {
            throw new Error("El nombre de la vía es obligatorio");
        }
        if (!companyExteriorNumber || !companyExteriorNumber.trim()) {
            throw new Error("El número exterior es obligatorio");
        }
        if (!companyPostalCode || !companyPostalCode.trim()) {
            throw new Error("El código postal es obligatorio");
        }

        // Validar información de contacto (todos obligatorios)
        if (!contactName || !contactName.trim()) {
            throw new Error("El nombre de la persona de contacto es obligatorio");
        }
        if (!contactPosition || !contactPosition.trim()) {
            throw new Error("El puesto de la persona de contacto es obligatorio");
        }
        if (!contactEmail || !contactEmail.trim()) {
            throw new Error("El email de contacto es obligatorio");
        }
        if (!contactPhone || !contactPhone.trim()) {
            throw new Error("El teléfono de contacto es obligatorio");
        }
        if (!contactArea || !contactArea.trim()) {
            throw new Error("El área de contacto es obligatoria");
        }

        // Validar supervisor (todos obligatorios)
        if (!supervisorName || !supervisorName.trim()) {
            throw new Error("El nombre del supervisor es obligatorio");
        }
        if (!supervisorArea || !supervisorArea.trim()) {
            throw new Error("El área del supervisor es obligatoria");
        }
        if (!supervisorEmail || !supervisorEmail.trim()) {
            throw new Error("El email del supervisor es obligatorio");
        }
        if (!supervisorPhone || !supervisorPhone.trim()) {
            throw new Error("El teléfono del supervisor es obligatorio");
        }

        // Validar proyecto (todos obligatorios)
        if (!projectName || !projectName.trim()) {
            throw new Error("El nombre del proyecto es obligatorio");
        }
        if (!projectProblemContext || !projectProblemContext.trim()) {
            throw new Error("El contexto de la problemática es obligatorio");
        }
        if (!projectProblemDescription || !projectProblemDescription.trim()) {
            throw new Error("La descripción de la problemática es obligatoria");
        }
        if (!projectGeneralObjective || !projectGeneralObjective.trim()) {
            throw new Error("El objetivo general es obligatorio");
        }
        if (!projectSpecificObjectives || !projectSpecificObjectives.trim()) {
            throw new Error("Los objetivos específicos son obligatorios");
        }
        if (!projectMainActivities || !projectMainActivities.trim()) {
            throw new Error("Las actividades principales son obligatorias");
        }
        if (!projectPlannedDeliverables || !projectPlannedDeliverables.trim()) {
            throw new Error("Los entregables planeados son obligatorios");
        }
        if (!projectTechnologies || !projectTechnologies.trim()) {
            throw new Error("Las tecnologías son obligatorias");
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