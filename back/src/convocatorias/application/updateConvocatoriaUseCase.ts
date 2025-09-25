import { ConvocatoriaRepository } from "../domain/interfaces/convocatoriaRepository";
import { Convocatoria } from "../domain/models/convocatoria";

export class UpdateConvocatoriaUseCase {
    constructor(private readonly convocatoriaRepository: ConvocatoriaRepository) {}

    async run(
        uuid: string,
        nombre?: string,
        descripcion?: string | null,
        fechaLimite?: string, // Formato YYYY-MM-DD
        pasantiasSeleccionadas?: string[],
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
                // Validar formato YYYY-MM-DD
                const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!fechaRegex.test(fechaLimite)) {
                    throw new Error("La fecha debe tener el formato YYYY-MM-DD");
                }

                // Convertir fecha a último segundo del día
                const fechaConvertida = this.convertToEndOfDay(fechaLimite);
                
                // Validar que la fecha sea al menos hoy (para actualizaciones)
                const hoy = new Date();
                const hoyFecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

                if (fechaConvertida < hoyFecha) {
                    throw new Error("La fecha límite no puede ser anterior a hoy");
                }

                updatedData.fechaLimite = fechaConvertida;
            }

            if (pasantiasSeleccionadas !== undefined) {
                if (!Array.isArray(pasantiasSeleccionadas) || pasantiasSeleccionadas.length === 0) {
                    throw new Error("Debe seleccionar al menos una pasantía");
                }

                if (pasantiasSeleccionadas.length > 5) {
                    throw new Error("No se pueden seleccionar más de 5 pasantías");
                }

                // Validar que las pasantías seleccionadas sean válidas
                const pasantiasValidas = ["Estancia I", "Estancia II", "Estadía", "Estadía 1", "Estadía 2"];
                const pasantiasInvalidas = pasantiasSeleccionadas.filter(p => !pasantiasValidas.includes(p));
                if (pasantiasInvalidas.length > 0) {
                    throw new Error(`Pasantías no válidas: ${pasantiasInvalidas.join(", ")}`);
                }

                // Eliminar duplicados
                updatedData.pasantiasDisponibles = [...new Set(pasantiasSeleccionadas)];
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

    // Convierte fecha YYYY-MM-DD a Date con 23:59:59
    private convertToEndOfDay(fechaString: string): Date {
        try {
            // Crear fecha desde el string (formato YYYY-MM-DD)
            const fecha = new Date(fechaString + 'T00:00:00.000Z');
            
            // Establecer al último segundo del día (23:59:59.999)
            fecha.setUTCHours(23, 59, 59, 999);
            
            return fecha;
        } catch (error) {
            throw new Error("Formato de fecha inválido. Use YYYY-MM-DD");
        }
    }
}