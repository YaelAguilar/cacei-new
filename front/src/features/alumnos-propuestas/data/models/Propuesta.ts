// front/src/features/alumnos-propuestas/data/models/Propuesta.ts

export class DireccionEmpresa {
  constructor(
    private readonly estado: string,
    private readonly municipio: string,
    private readonly tipoAsentamiento: string,
    private readonly nombreAsentamiento: string,
    private readonly tipoVialidad: string,
    private readonly nombreVia: string,
    private readonly numeroExterior: string,
    private readonly numeroInterior: string | null,
    private readonly codigoPostal: string
  ) {}

  getEstado(): string { return this.estado; }
  getMunicipio(): string { return this.municipio; }
  getTipoAsentamiento(): string { return this.tipoAsentamiento; }
  getNombreAsentamiento(): string { return this.nombreAsentamiento; }
  getTipoVialidad(): string { return this.tipoVialidad; }
  getNombreVia(): string { return this.nombreVia; }
  getNumeroExterior(): string { return this.numeroExterior; }
  getNumeroInterior(): string | null { return this.numeroInterior; }
  getCodigoPostal(): string { return this.codigoPostal; }

  getDireccionCompleta(): string {
    const interior = this.numeroInterior ? `, Int. ${this.numeroInterior}` : '';
    return `${this.tipoVialidad} ${this.nombreVia} #${this.numeroExterior}${interior}, ${this.nombreAsentamiento}, ${this.municipio}, ${this.estado}, C.P. ${this.codigoPostal}`;
  }
}

export class EmpresaCompleta {
  constructor(
    private readonly nombreCorto: string,
    private readonly razonSocial: string,
    private readonly rfc: string,
    private readonly direccion: DireccionEmpresa,
    private readonly paginaWeb: string | null,
    private readonly linkedin: string | null,
    private readonly sector: string
  ) {}

  getNombreCorto(): string { return this.nombreCorto; }
  getRazonSocial(): string { return this.razonSocial; }
  getRFC(): string { return this.rfc; }
  getDireccion(): DireccionEmpresa { return this.direccion; }
  getPaginaWeb(): string | null { return this.paginaWeb; }
  getLinkedIn(): string | null { return this.linkedin; }
  getSector(): string { return this.sector; }
}

export class Contacto {
  constructor(
    private readonly nombre: string,
    private readonly puesto: string,
    private readonly email: string,
    private readonly telefono: string,
    private readonly area: string
  ) {}

  getNombre(): string { return this.nombre; }
  getPuesto(): string { return this.puesto; }
  getEmail(): string { return this.email; }
  getTelefono(): string { return this.telefono; }
  getArea(): string { return this.area; }
}

export class Supervisor {
  constructor(
    private readonly nombre: string,
    private readonly area: string,
    private readonly email: string,
    private readonly telefono: string
  ) {}

  getNombre(): string { return this.nombre; }
  getArea(): string { return this.area; }
  getEmail(): string { return this.email; }
  getTelefono(): string { return this.telefono; }
}

export class ProyectoCompleto {
  constructor(
    private readonly nombre: string,
    private readonly fechaInicio: Date,
    private readonly fechaFin: Date,
    private readonly contextoProblema: string,
    private readonly descripcionProblema: string,
    private readonly objetivoGeneral: string,
    private readonly objetivosEspecificos: string,
    private readonly actividadesPrincipales: string,
    private readonly entregablesPlaneados: string,
    private readonly tecnologias: string
  ) {}

  getNombre(): string { return this.nombre; }
  getFechaInicio(): Date { return this.fechaInicio; }
  getFechaFin(): Date { return this.fechaFin; }
  getContextoProblema(): string { return this.contextoProblema; }
  getDescripcionProblema(): string { return this.descripcionProblema; }
  getObjetivoGeneral(): string { return this.objetivoGeneral; }
  getObjetivosEspecificos(): string { return this.objetivosEspecificos; }
  getActividadesPrincipales(): string { return this.actividadesPrincipales; }
  getEntregablesPlaneados(): string { return this.entregablesPlaneados; }
  getTecnologias(): string { return this.tecnologias; }

  getDuracionDias(): number {
    const diff = this.fechaFin.getTime() - this.fechaInicio.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
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

export class PropuestaCompleta {
  constructor(
    private readonly id: string,
    private readonly idConvocatoria: number,
    private readonly tutorAcademico: TutorAcademico,
    private readonly tipoPasantia: string,
    private readonly empresa: EmpresaCompleta,
    private readonly contacto: Contacto,
    private readonly supervisor: Supervisor,
    private readonly proyecto: ProyectoCompleto,
    private readonly active: boolean,
    private readonly createdAt: Date,
    private readonly updatedAt: Date
  ) {}

  // Getters principales
  getId(): string { return this.id; }
  getIdConvocatoria(): number { return this.idConvocatoria; }
  getTutorAcademico(): TutorAcademico { return this.tutorAcademico; }
  getTipoPasantia(): string { return this.tipoPasantia; }
  getEmpresa(): EmpresaCompleta { return this.empresa; }
  getContacto(): Contacto { return this.contacto; }
  getSupervisor(): Supervisor { return this.supervisor; }
  getProyecto(): ProyectoCompleto { return this.proyecto; }
  isActive(): boolean { return this.active; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }

  // Métodos de conveniencia para compatibilidad con código existente
  getProyectoInfo() {
    return {
      getNombre: () => this.proyecto.getNombre(),
      getDescripcion: () => this.proyecto.getDescripcionProblema(),
      getEntregables: () => this.proyecto.getEntregablesPlaneados(),
      getTecnologias: () => this.proyecto.getTecnologias(),
      getSupervisor: () => this.supervisor.getNombre(),
      getActividades: () => this.proyecto.getActividadesPrincipales(),
      getFechaInicio: () => this.proyecto.getFechaInicio(),
      getFechaFin: () => this.proyecto.getFechaFin()
    };
  }

  getEmpresaInfo() {
    return {
      getNombre: () => this.empresa.getNombreCorto(),
      getSector: () => this.empresa.getSector(),
      getPersonaContacto: () => this.contacto.getNombre(),
      getPaginaWeb: () => this.empresa.getPaginaWeb()
    };
  }
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

// Exportar también las clases originales para compatibilidad
export class Propuesta extends PropuestaCompleta {}
export class ProyectoInfo extends ProyectoCompleto {}
export class EmpresaInfo extends EmpresaCompleta {}