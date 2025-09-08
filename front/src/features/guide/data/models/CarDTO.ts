/**
 * Data Transfer Object para Carro
 * Se utiliza para la transferencia de datos entre la API y la aplicación
 * Incluye el ID y otros campos que vienen de la respuesta del servidor
 */
export class CarDTO {
    id: number;           // ID único del carro (generado por el servidor)
    make: string;         // Marca del carro
    model: string;        // Modelo del carro
    year: number;         // Año del carro
    color?: string;       // Color (opcional)
    licensePlate?: string; // Placa (opcional)
    createdAt: string;    // Fecha de creación (viene del servidor)
    updatedAt: string;    // Fecha de actualización (viene del servidor)

    constructor(
        id: number,
        make: string,
        model: string,
        year: number,
        createdAt: string,
        updatedAt: string,
        color?: string,
        licensePlate?: string
    ) {
        this.id = id;
        this.make = make;
        this.model = model;
        this.year = year;
        this.color = color;
        this.licensePlate = licensePlate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Método para convertir un DTO a un modelo de dominio
     * Útil para trabajar con el objeto dentro de la aplicación
     */
    toDomain(): Car {
        return new Car(
            this.make,
            this.model,
            this.year,
            this.color,
            this.licensePlate
        );
    }
}

// Importamos el modelo de dominio para la función de conversión
import { Car } from './Car';