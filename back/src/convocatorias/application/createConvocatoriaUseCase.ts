import { ConvocatoriaRepository } from "../domain/interfaces/convocatoriaRepository";
import { Convocatoria } from "../domain/models/convocatoria";

export class CreateConvocatoriaUseCase {
    constructor(private readonly convocatoriaRepository: ConvocatoriaRepository) {}

    async run(
        nombre: string,
        descripcion: string | null,
        fechaLimite: Date,
        pasantiasDisponibles: string[]
    ): Promise<Convocatoria | null> {
        try {
            // Validar que no exista una convocatoria activa
            const hasActiveConvocatoria = await this.convocatoriaRepository.hasActiveConvocatoria();
            if (hasActiveConvocatoria) {
                throw new Error("No se puede crear una nueva convocatoria mientras haya una convocatoria vigente");
            }

            // Validaciones básicas
            if (!nombre || !nombre.trim()) {
                throw new Error("El nombre es obligatorio");
            }

            // Validar que la fecha límite sea al menos 1 día en el futuro
            const now = new Date();
            const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 horas
            
            if (fechaLimite <= now) {
                throw new Error("La fecha límite debe ser en el futuro");
            }

            if (fechaLimite <= minDate) {
                throw new Error("La fecha límite debe ser al menos 24 horas en el futuro");
            }

            if (!Array.isArray(pasantiasDisponibles) || pasantiasDisponibles.length === 0) {
                throw new Error("Debe seleccionar al menos una pasantía");
            }

            if (pasantiasDisponibles.length > 5) {
                throw new Error("No se pueden seleccionar más de 5 pasantías");
            }

            // Validar que las pasantías seleccionadas sean válidas
            const pasantiasValidas = ["Estancia I", "Estancia II", "Estadía", "Estadía 1", "Estadía 2"];
            const pasantiasInvalidas = pasantiasDisponibles.filter(p => !pasantiasValidas.includes(p));
            if (pasantiasInvalidas.length > 0) {
                throw new Error(`Pasantías no válidas: ${pasantiasInvalidas.join(", ")}`);
            }

            // Eliminar duplicados
            const pasantiasUnicas = [...new Set(pasantiasDisponibles)];

            // Obtener la lista actual de profesores disponibles
            const profesores = await this.convocatoriaRepository.getProfesoresDisponibles();
            if (!profesores || profesores.length === 0) {
                throw new Error("No hay profesores disponibles para la convocatoria");
            }

            // Convertir profesores a formato para guardar
            const profesoresDisponibles = profesores.map(profesor => ({
                id: profesor.getId(),
                nombre: profesor.getNombre(),
                email: profesor.getEmail()
            }));

            return await this.convocatoriaRepository.createConvocatoria(
                nombre.trim(),
                descripcion ? descripcion.trim() : null,
                fechaLimite,
                pasantiasUnicas,
                profesoresDisponibles
            );
        } catch (error) {
            console.error("Error in CreateConvocatoriaUseCase:", error);
            throw error;
        }
    }
}