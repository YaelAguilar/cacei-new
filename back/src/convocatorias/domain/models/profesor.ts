export class Profesor {
    constructor(
        private readonly id: number,
        private readonly nombre: string,
        private readonly email: string
    ) {}

    getId(): number {
        return this.id;
    }

    getNombre(): string {
        return this.nombre;
    }

    getEmail(): string {
        return this.email;
    }
}