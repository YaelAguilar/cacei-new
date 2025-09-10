// src/propuestas/application/updatePropuestaUseCase.ts
import { PropuestaRepository, PropuestaUpdateData } from "../domain/interfaces/propuestaRepository";
import { Propuesta } from "../domain/models/propuesta";

export class UpdatePropuestaUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(
        uuid: string,
        tutorAcademicoId?: number,
        tipoPasantia?: string,
        nombreProyecto?: string,
        descripcionProyecto?: string,
        entregables?: string,
        tecnologias?: string,
        supervisorProyecto?: string,
        actividades?: string,
        fechaInicio?: Date,
        fechaFin?: Date,
        nombreEmpresa?: string,
        sectorEmpresa?: string,
        personaContacto?: string,
        paginaWebEmpresa?: string | null
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
            if (propuestaActual.getIdConvocatoria() !== convocatoriaActiva.id) {
                throw new Error("Solo se pueden actualizar propuestas de la convocatoria activa");
            }

            const updatedData: PropuestaUpdateData = {};

            // Validaciones y asignaciones
            if (nombreProyecto !== undefined) {
                if (!nombreProyecto || !nombreProyecto.trim()) {
                    throw new Error("El nombre del proyecto es obligatorio");
                }
                updatedData.nombreProyecto = nombreProyecto.trim();
            }

            if (descripcionProyecto !== undefined) {
                if (!descripcionProyecto || !descripcionProyecto.trim()) {
                    throw new Error("La descripción del proyecto es obligatoria");
                }
                updatedData.descripcionProyecto = descripcionProyecto.trim();
            }

            if (entregables !== undefined) {
                if (!entregables || !entregables.trim()) {
                    throw new Error("Los entregables son obligatorios");
                }
                updatedData.entregables = entregables.trim();
            }

            if (tecnologias !== undefined) {
                if (!tecnologias || !tecnologias.trim()) {
                    throw new Error("Las tecnologías son obligatorias");
                }
                updatedData.tecnologias = tecnologias.trim();
            }

            if (supervisorProyecto !== undefined) {
                if (!supervisorProyecto || !supervisorProyecto.trim()) {
                    throw new Error("El supervisor del proyecto es obligatorio");
                }
                updatedData.supervisorProyecto = supervisorProyecto.trim();
            }

            if (actividades !== undefined) {
                if (!actividades || !actividades.trim()) {
                    throw new Error("Las actividades son obligatorias");
                }
                updatedData.actividades = actividades.trim();
            }

            if (nombreEmpresa !== undefined) {
                if (!nombreEmpresa || !nombreEmpresa.trim()) {
                    throw new Error("El nombre de la empresa es obligatorio");
                }
                updatedData.nombreEmpresa = nombreEmpresa.trim();
            }

            if (sectorEmpresa !== undefined) {
                if (!sectorEmpresa || !sectorEmpresa.trim()) {
                    throw new Error("El sector de la empresa es obligatorio");
                }
                updatedData.sectorEmpresa = sectorEmpresa.trim();
            }

            if (personaContacto !== undefined) {
                if (!personaContacto || !personaContacto.trim()) {
                    throw new Error("La persona de contacto es obligatoria");
                }
                updatedData.personaContacto = personaContacto.trim();
            }

            if (paginaWebEmpresa !== undefined) {
                updatedData.paginaWebEmpresa = paginaWebEmpresa ? paginaWebEmpresa.trim() : null;
            }

            // Validar tipo de pasantía si se proporciona
            if (tipoPasantia !== undefined) {
                if (!convocatoriaActiva.pasantiasDisponibles.includes(tipoPasantia)) {
                    throw new Error("El tipo de pasantía seleccionado no está disponible en la convocatoria actual");
                }
                updatedData.tipoPasantia = tipoPasantia;
            }

            // Validar tutor académico si se proporciona
            if (tutorAcademicoId !== undefined) {
                const tutorDisponible = convocatoriaActiva.profesoresDisponibles.find(
                    profesor => profesor.id === tutorAcademicoId
                );
                if (!tutorDisponible) {
                    throw new Error("El tutor académico seleccionado no está disponible en la convocatoria actual");
                }
                updatedData.tutorAcademicoId = tutorAcademicoId;
            }

            // Validar fechas si se proporcionan
            if (fechaInicio !== undefined || fechaFin !== undefined) {
                const nuevaFechaInicio = fechaInicio || propuestaActual.getFechaInicio();
                const nuevaFechaFin = fechaFin || propuestaActual.getFechaFin();

                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);

                if (nuevaFechaInicio < hoy) {
                    throw new Error("La fecha de inicio no puede ser anterior a hoy");
                }

                if (nuevaFechaFin <= nuevaFechaInicio) {
                    throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
                }

                if (fechaInicio !== undefined) {
                    updatedData.fechaInicio = fechaInicio;
                }
                if (fechaFin !== undefined) {
                    updatedData.fechaFin = fechaFin;
                }
            }

            // Verificar que haya al menos un campo para actualizar
            if (Object.keys(updatedData).length === 0) {
                throw new Error("No hay campos para actualizar");
            }

            return await this.propuestaRepository.updatePropuesta(uuid, updatedData);
        } catch (error) {
            console.error("Error in UpdatePropuestaUseCase:", error);
            throw error;
        }
    }
}