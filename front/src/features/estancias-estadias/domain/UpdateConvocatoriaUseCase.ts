// src/features/estancias-estadias/domain/UpdateConvocatoriaUseCase.ts

import { ConvocatoriaRepository } from "../data/repository/ConvocatoriaRepository";
import { UpdateConvocatoriaRequest } from "../data/models/ConvocatoriaDTO";
import { Convocatoria } from "../data/models/Convocatoria";

export interface UpdateConvocatoriaParams {
  uuid: string;
  nombre: string;
  descripcion?: string;
  fechaLimite: string; // ← Ya viene en formato YYYY-MM-DD
  pasantiasSeleccionadas: string[];
  actualizarProfesores: boolean;
}

export class UpdateConvocatoriaUseCase {
  constructor(private repository: ConvocatoriaRepository) {}

  async execute(params: UpdateConvocatoriaParams): Promise<Convocatoria> {
    // Validaciones de negocio
    if (!params.nombre || params.nombre.trim() === "") {
      throw new Error("El nombre es obligatorio");
    }

    // 🚀 SIMPLIFICADO: Validar fecha pero sin convertir
    if (!params.fechaLimite) {
      throw new Error("La fecha límite es obligatoria");
    }

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(params.fechaLimite)) {
      throw new Error("La fecha debe tener el formato YYYY-MM-DD");
    }

    // Validar que la fecha sea al menos hoy (más flexible para actualizaciones)
    const fechaLimite = new Date(params.fechaLimite);
    const hoy = new Date();
    const hoyFecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const fechaLimiteFecha = new Date(fechaLimite.getFullYear(), fechaLimite.getMonth(), fechaLimite.getDate());

    if (fechaLimiteFecha < hoyFecha) {
      throw new Error("La fecha límite no puede ser anterior a hoy");
    }

    if (!params.pasantiasSeleccionadas || params.pasantiasSeleccionadas.length === 0) {
      throw new Error("Debe seleccionar al menos una pasantía");
    }

    if (params.pasantiasSeleccionadas.length > 5) {
      throw new Error("No se pueden seleccionar más de 5 pasantías");
    }

    // Construir la solicitud - enviar fecha tal como viene
    const request: UpdateConvocatoriaRequest = {
      nombre: params.nombre.trim(),
      descripcion: params.descripcion?.trim() || null,
      fechaLimite: params.fechaLimite, // ← Enviar directamente sin convertir
      pasantiasSeleccionadas: params.pasantiasSeleccionadas,
      actualizarProfesores: params.actualizarProfesores,
    };

    const convocatoria = await this.repository.updateConvocatoria(params.uuid, request);
    
    if (!convocatoria) {
      throw new Error("Error al actualizar la convocatoria. Es posible que ya no esté activa.");
    }

    return convocatoria;
  }
}