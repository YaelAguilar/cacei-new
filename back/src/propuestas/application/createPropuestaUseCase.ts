// src/propuestas/application/createPropuestaUseCase.ts
import { PropuestaRepository, PropuestaCreateData } from "../domain/interfaces/propuestaRepository";
import { Propuesta } from "../domain/models/propuesta";

export class CreatePropuestaUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(
        idAlumno: number,
        tutorAcademicoId: number,
        tipoPasantia: string,
        nombreProyecto: string,
        descripcionProyecto: string,
        entregables: string,
        tecnologias: string,
        supervisorProyecto: string,
        actividades: string,
        fechaInicio: Date,
        fechaFin: Date,
        nombreEmpresa: string,
        sectorEmpresa: string,
        personaContacto: string,
        paginaWebEmpresa?: string | null
    ): Promise<Propuesta | null> {
        try {
            // Verificar que existe una convocatoria activa
            const convocatoriaActiva = await this.propuestaRepository.getActiveConvocatoria();
            if (!convocatoriaActiva) {
                throw new Error("No hay una convocatoria activa disponible");
            }

            // Verificar que el alumno no tenga ya una propuesta en esta convocatoria
            const existePropuesta = await this.propuestaRepository.checkExistingPropuesta(
                idAlumno, 
                convocatoriaActiva.id
            );
            if (existePropuesta) {
                throw new Error("Ya tienes una propuesta registrada en la convocatoria actual");
            }

            // Validaciones de negocio
            if (!nombreProyecto || !nombreProyecto.trim()) {
                throw new Error("El nombre del proyecto es obligatorio");
            }

            if (!descripcionProyecto || !descripcionProyecto.trim()) {
                throw new Error("La descripción del proyecto es obligatoria");
            }

            if (!entregables || !entregables.trim()) {
                throw new Error("Los entregables son obligatorios");
            }

            if (!tecnologias || !tecnologias.trim()) {
                throw new Error("Las tecnologías son obligatorias");
            }

            if (!supervisorProyecto || !supervisorProyecto.trim()) {
                throw new Error("El supervisor del proyecto es obligatorio");
            }

            if (!actividades || !actividades.trim()) {
                throw new Error("Las actividades son obligatorias");
            }

            if (!nombreEmpresa || !nombreEmpresa.trim()) {
                throw new Error("El nombre de la empresa es obligatorio");
            }

            if (!sectorEmpresa || !sectorEmpresa.trim()) {
                throw new Error("El sector de la empresa es obligatorio");
            }

            if (!personaContacto || !personaContacto.trim()) {
                throw new Error("La persona de contacto es obligatoria");
            }

            // Validar fechas
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            if (fechaInicio < hoy) {
                throw new Error("La fecha de inicio no puede ser anterior a hoy");
            }

            if (fechaFin <= fechaInicio) {
                throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
            }

            // Verificar que el tipo de pasantía esté disponible en la convocatoria
            if (!convocatoriaActiva.pasantiasDisponibles.includes(tipoPasantia)) {
                throw new Error("El tipo de pasantía seleccionado no está disponible en la convocatoria actual");
            }

            // Verificar que el tutor académico esté disponible en la convocatoria
            const tutorDisponible = convocatoriaActiva.profesoresDisponibles.find(
                profesor => profesor.id === tutorAcademicoId
            );
            if (!tutorDisponible) {
                throw new Error("El tutor académico seleccionado no está disponible en la convocatoria actual");
            }

            // Crear los datos para la propuesta
            const propuestaData: PropuestaCreateData = {
                idConvocatoria: convocatoriaActiva.id,
                idAlumno,
                tutorAcademicoId,
                tipoPasantia,
                nombreProyecto: nombreProyecto.trim(),
                descripcionProyecto: descripcionProyecto.trim(),
                entregables: entregables.trim(),
                tecnologias: tecnologias.trim(),
                supervisorProyecto: supervisorProyecto.trim(),
                actividades: actividades.trim(),
                fechaInicio,
                fechaFin,
                nombreEmpresa: nombreEmpresa.trim(),
                sectorEmpresa: sectorEmpresa.trim(),
                personaContacto: personaContacto.trim(),
                paginaWebEmpresa: paginaWebEmpresa ? paginaWebEmpresa.trim() : null
            };

            return await this.propuestaRepository.createPropuesta(propuestaData);
        } catch (error) {
            console.error("Error in CreatePropuestaUseCase:", error);
            throw error;
        }
    }
}