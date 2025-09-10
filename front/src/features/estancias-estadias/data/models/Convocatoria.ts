export class Convocatoria {
  constructor(
    private readonly id: string,
    private readonly nombre: string,
    private readonly descripcion: string | null,
    private readonly fechaLimite: Date,
    private readonly pasantiasDisponibles: string[],
    private readonly profesoresDisponibles: Profesor[],
    private readonly active: boolean,
    private readonly createdAt: Date,
    private readonly updatedAt: Date
  ) {}

  getId(): string { return this.id; }
  getNombre(): string { return this.nombre; }
  getDescripcion(): string | null { return this.descripcion; }
  getFechaLimite(): Date { return this.fechaLimite; }
  getPasantiasDisponibles(): string[] { return this.pasantiasDisponibles; }
  getProfesoresDisponibles(): Profesor[] { return this.profesoresDisponibles; }
  isActive(): boolean { return this.active; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }

  // Método de utilidad para verificar si la fecha límite es válida
  isFechaLimiteValida(): boolean {
    const now = new Date();
    const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 horas
    return this.fechaLimite > minDate;
  }

  // Método para verificar si las pasantías están en el rango válido
  isPasantiasCountValid(): boolean {
    return this.pasantiasDisponibles.length >= 1 && this.pasantiasDisponibles.length <= 5;
  }
}

export class Profesor {
  constructor(
    private readonly id: number,
    private readonly nombre: string,
    private readonly email: string
  ) {}

  getId(): number { return this.id; }
  getNombre(): string { return this.nombre; }
  getEmail(): string { return this.email; }
}