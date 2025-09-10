export class Convocatoria {
    constructor(
        private readonly id: string | number,
        private readonly nombre: string,
        private readonly descripcion: string | null,
        private readonly fechaLimite: Date,
        private readonly pasantiasDisponibles: string[],
        private readonly profesoresDisponibles: { id: number; nombre: string; email: string }[],
        private readonly uuid?: string,
        private readonly active?: boolean,
        private readonly created_at?: Date,
        private readonly updated_at?: Date,
        private readonly user_creation?: string,
        private readonly user_update?: string
    ) {}

    getId(): string | number {
        return this.id;
    }

    getNombre(): string {
        return this.nombre;
    }

    getDescripcion(): string | null {
        return this.descripcion;
    }

    getFechaLimite(): Date {
        return this.fechaLimite;
    }

    getPasantiasDisponibles(): string[] {
        return this.pasantiasDisponibles;
    }

    getProfesoresDisponibles(): { id: number; nombre: string; email: string }[] {
        return this.profesoresDisponibles;
    }

    getUuid(): string | undefined {
        return this.uuid;
    }

    isActive(): boolean | undefined {
        return this.active;
    }

    getCreatedAt(): Date | undefined {
        return this.created_at;
    }

    getUpdatedAt(): Date | undefined {
        return this.updated_at;
    }

    getUserCreation(): string | undefined {
        return this.user_creation;
    }

    getUserUpdate(): string | undefined {
        return this.user_update;
    }
}