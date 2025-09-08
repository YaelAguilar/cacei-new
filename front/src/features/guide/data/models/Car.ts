/**
 * Modelo de dominio para representar un carro en la aplicación
 * Este modelo se usa para operaciones dentro de la aplicación
 */
export class Car {
    make: string;         // Marca del carro
    model: string;        // Modelo del carro
    year: number;         // Año del carro
    color?: string;       // Color (opcional)
    licensePlate?: string; // Placa (opcional)

    constructor(
        make: string,
        model: string,
        year: number,
        color?: string,
        licensePlate?: string
    ) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.color = color;
        this.licensePlate = licensePlate;
    }
}