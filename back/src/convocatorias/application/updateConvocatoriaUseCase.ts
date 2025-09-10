import { ConvocatoriaRepository } from "../domain/interfaces/convocatoriaRepository";
import { Convocatoria } from "../domain/models/convocatoria";

export class UpdateConvocatoriaUseCase {
    constructor(private readonly convocatoriaRepository: ConvocatoriaRepository) {}

    async run(
        uuid: string,
        nombre?: string,
        descripcion?: string | null,
        fechaLimite?: Date,
        pasantiasDisponibles?: string[],
        actualizarProfesores?: boolean
    ): Promise<Convocatoria | null> {
        try {
            const updatedData: Partial<{
                nombre: string;
                descripcion: string | null;
                fechaLimite: Date;
                pasantiasDisponibles: string[];
                profesoresDisponibles: { id: number; nombre: string; email: string }[];
            }> = {};

            if (nombre !== undefined) {
                if (!nombre || !nombre.trim()) {
                    throw new Error("El nombre es obligatorio");
                }
                updatedData.nombre = nombre.trim();
            }

            if (descripcion !== undefined) {
                updatedData.descripcion = descripcion ? descripcion.trim() : null;
            }

            if (fechaLimite !== undefined) {
                // Validar que la fecha límite sea al menos 1 hora en el futuro
                const now = new Date();
                const minDate = new Date(now.getTime() + 60 * 60 * 1000); // 1 hora
                
                if (fechaLimite <= now) {
                    throw new Error("La fecha límite debe ser en el futuro");
                }

                if (fechaLimite <= minDate) {
                    throw new Error("La fecha límite debe ser al menos 1 hora en el futuro");
                }

                updatedData.fechaLimite = fechaLimite;
            }

            if (pasantiasDisponibles !== undefined) {
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
                updatedData.pasantiasDisponibles = [...new Set(pasantiasDisponibles)];
            }

            // Si se solicita actualizar la lista de profesores
            if (actualizarProfesores) {
                const profesores = await this.convocatoriaRepository.getProfesoresDisponibles();
                if (profesores && profesores.length > 0) {
                    updatedData.profesoresDisponibles = profesores.map(profesor => ({
                        id: profesor.getId(),
                        nombre: profesor.getNombre(),
                        email: profesor.getEmail()
                    }));
                } else {
                    console.warn("No hay profesores disponibles al actualizar la convocatoria");
                }
            }

            // Verificar que haya al menos un campo para actualizar
            if (Object.keys(updatedData).length === 0) {
                throw new Error("No hay campos para actualizar");
            }

            return await this.convocatoriaRepository.updateConvocatoria(uuid, updatedData);
        } catch (error) {
            console.error("Error in UpdateConvocatoriaUseCase:", error);
            throw error;
        }
    }
}