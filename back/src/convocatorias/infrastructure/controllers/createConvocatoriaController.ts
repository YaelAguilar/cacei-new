import { ConvocatoriaRepository } from "../../domain/interfaces/convocatoriaRepository";
import { Convocatoria } from "../../domain/models/convocatoria";

export class CreateConvocatoriaUseCase {
    constructor(private readonly convocatoriaRepository: ConvocatoriaRepository) {}

    async run(
        nombre: string,
        descripcion: string | null,
        fechaLimite: string, // 👈 CAMBIADO: Ahora recibe formato YYYY-MM-DD
        pasantiasDisponibles: string[],
        profesoresDisponibles: { id: number; nombre: string; email: string }[]
    ): Promise<Convocatoria | null> {
        try {
            // Validaciones básicas
            if (!nombre || !nombre.trim()) {
                throw new Error("El nombre es obligatorio");
            }

            // 🚀 NUEVO: Validar formato YYYY-MM-DD
            const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!fechaRegex.test(fechaLimite)) {
                throw new Error("La fecha debe tener el formato YYYY-MM-DD");
            }

            // 🚀 NUEVO: Convertir fecha a último segundo del día
            const fechaConvertida = this.convertToEndOfDay(fechaLimite);

            // Validar que la fecha límite sea al menos mañana
            const hoy = new Date();
            const manana = new Date(hoy.getTime() + 24 * 60 * 60 * 1000);
            const mananaFecha = new Date(manana.getFullYear(), manana.getMonth(), manana.getDate());

            if (fechaConvertida < mananaFecha) {
                throw new Error("La fecha límite debe ser al menos mañana");
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
            const profesoresDisponiblesFormato = profesores.map(profesor => ({
                id: profesor.getId(),
                nombre: profesor.getNombre(),
                email: profesor.getEmail()
            }));

            return await this.convocatoriaRepository.createConvocatoria(
                nombre.trim(),
                descripcion ? descripcion.trim() : null,
                fechaConvertida, // 👈 CAMBIADO: Usar fecha convertida
                pasantiasUnicas,
                profesoresDisponiblesFormato
            );
        } catch (error) {
            console.error("Error in CreateConvocatoriaUseCase:", error);
            throw error;
        }
    }

    // 🚀 NUEVO MÉTODO: Convierte fecha YYYY-MM-DD a Date con 23:59:59
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