// src/features/alumnos-propuestas/domain/CreatePropuestaUseCase.ts
import { PropuestaRepository } from "../data/repository/PropuestaRepository";
import { CreatePropuestaRequest } from "../data/models/PropuestaDTO";
import { Propuesta } from "../data/models/Propuesta";

export interface CreatePropuestaParams {
  tutorAcademicoId: number;
  tipoPasantia: string;
  nombreProyecto: string;
  descripcionProyecto: string;
  entregables: string;
  tecnologias: string;
  supervisorProyecto: string;
  actividades: string;
  fechaInicio: Date;
  fechaFin: Date;
  nombreEmpresa: string;
  sectorEmpresa: string;
  personaContacto: string;
  paginaWebEmpresa?: string | null;
}

export class CreatePropuestaUseCase {
  constructor(private repository: PropuestaRepository) {}

  async execute(params: CreatePropuestaParams): Promise<Propuesta> {
    // Validaciones de negocio
    this.validateParams(params);

    // Crear la solicitud
    const request: CreatePropuestaRequest = {
      tutorAcademicoId: params.tutorAcademicoId,
      tipoPasantia: params.tipoPasantia,
      nombreProyecto: params.nombreProyecto.trim(),
      descripcionProyecto: params.descripcionProyecto.trim(),
      entregables: params.entregables.trim(),
      tecnologias: params.tecnologias.trim(),
      supervisorProyecto: params.supervisorProyecto.trim(),
      actividades: params.actividades.trim(),
      fechaInicio: params.fechaInicio.toISOString().split('T')[0],
      fechaFin: params.fechaFin.toISOString().split('T')[0],
      nombreEmpresa: params.nombreEmpresa.trim(),
      sectorEmpresa: params.sectorEmpresa.trim(),
      personaContacto: params.personaContacto.trim(),
      paginaWebEmpresa: params.paginaWebEmpresa?.trim() || null
    };

    const propuesta = await this.repository.createPropuesta(request);
    
    if (!propuesta) {
      throw new Error("Error al crear la propuesta");
    }

    return propuesta;
  }

  private validateParams(params: CreatePropuestaParams): void {
    if (!params.tutorAcademicoId) {
      throw new Error("Debe seleccionar un tutor académico");
    }

    if (!params.tipoPasantia || params.tipoPasantia.trim() === "") {
      throw new Error("Debe seleccionar un tipo de pasantía");
    }

    if (!params.nombreProyecto || params.nombreProyecto.trim() === "") {
      throw new Error("El nombre del proyecto es obligatorio");
    }

    if (!params.descripcionProyecto || params.descripcionProyecto.trim() === "") {
      throw new Error("La descripción del proyecto es obligatoria");
    }

    if (!params.entregables || params.entregables.trim() === "") {
      throw new Error("Los entregables son obligatorios");
    }

    if (!params.tecnologias || params.tecnologias.trim() === "") {
      throw new Error("Las tecnologías son obligatorias");
    }

    if (!params.supervisorProyecto || params.supervisorProyecto.trim() === "") {
      throw new Error("El supervisor del proyecto es obligatorio");
    }

    if (!params.actividades || params.actividades.trim() === "") {
      throw new Error("Las actividades son obligatorias");
    }

    if (!params.nombreEmpresa || params.nombreEmpresa.trim() === "") {
      throw new Error("El nombre de la empresa es obligatorio");
    }

    if (!params.sectorEmpresa || params.sectorEmpresa.trim() === "") {
      throw new Error("El sector de la empresa es obligatorio");
    }

    if (!params.personaContacto || params.personaContacto.trim() === "") {
      throw new Error("La persona de contacto es obligatoria");
    }

    // Validar fechas
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (params.fechaInicio < hoy) {
      throw new Error("La fecha de inicio no puede ser anterior a hoy");
    }

    if (params.fechaFin <= params.fechaInicio) {
      throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
    }
  }
}