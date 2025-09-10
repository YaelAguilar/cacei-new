// src/features/alumnos-propuestas/data/models/Propuesta.ts
export class Propuesta {
  constructor(
    private readonly id: string,
    private readonly idConvocatoria: number,
    private readonly tutorAcademico: TutorAcademico,
    private readonly tipoPasantia: string,
    private readonly proyecto: ProyectoInfo,
    private readonly empresa: EmpresaInfo,
    private readonly active: boolean,
    private readonly createdAt: Date,
    private readonly updatedAt: Date
  ) {}

  getId(): string { return this.id; }
  getIdConvocatoria(): number { return this.idConvocatoria; }
  getTutorAcademico(): TutorAcademico { return this.tutorAcademico; }
  getTipoPasantia(): string { return this.tipoPasantia; }
  getProyecto(): ProyectoInfo { return this.proyecto; }
  getEmpresa(): EmpresaInfo { return this.empresa; }
  isActive(): boolean { return this.active; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }
}

export class TutorAcademico {
  constructor(
    private readonly id: number,
    private readonly nombre: string,
    private readonly email: string
  ) {}

  getId(): number { return this.id; }
  getNombre(): string { return this.nombre; }
  getEmail(): string { return this.email; }
}

export class ProyectoInfo {
  constructor(
    private readonly nombre: string,
    private readonly descripcion: string,
    private readonly entregables: string,
    private readonly tecnologias: string,
    private readonly supervisor: string,
    private readonly actividades: string,
    private readonly fechaInicio: Date,
    private readonly fechaFin: Date
  ) {}

  getNombre(): string { return this.nombre; }
  getDescripcion(): string { return this.descripcion; }
  getEntregables(): string { return this.entregables; }
  getTecnologias(): string { return this.tecnologias; }
  getSupervisor(): string { return this.supervisor; }
  getActividades(): string { return this.actividades; }
  getFechaInicio(): Date { return this.fechaInicio; }
  getFechaFin(): Date { return this.fechaFin; }
}

export class EmpresaInfo {
  constructor(
    private readonly nombre: string,
    private readonly sector: string,
    private readonly personaContacto: string,
    private readonly paginaWeb?: string | null
  ) {}

  getNombre(): string { return this.nombre; }
  getSector(): string { return this.sector; }
  getPersonaContacto(): string { return this.personaContacto; }
  getPaginaWeb(): string | null | undefined { return this.paginaWeb; }
}

export class ConvocatoriaActiva {
  constructor(
    private readonly id: string,
    private readonly nombre: string,
    private readonly pasantiasDisponibles: string[],
    private readonly profesoresDisponibles: TutorAcademico[]
  ) {}

  getId(): string { return this.id; }
  getNombre(): string { return this.nombre; }
  getPasantiasDisponibles(): string[] { return this.pasantiasDisponibles; }
  getProfesoresDisponibles(): TutorAcademico[] { return this.profesoresDisponibles; }
}