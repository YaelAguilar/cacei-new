import { Car } from "../data/models/Car";
import { CarDTO } from "../data/models/CarDTO";
import { CarRepository } from "../data/repository/CarRepository";

/**
 * Caso de uso para crear un nuevo carro
 * Implementa la lógica de negocio para la creación de carros
 */
export class CreateCarUseCase {
    private repository: CarRepository;

    constructor(repository: CarRepository) {
        this.repository = repository;
    }

    /**
     * Ejecuta la lógica de negocio para crear un carro
     * @param make Marca del carro
     * @param model Modelo del carro
     * @param year Año del carro
     * @param color Color opcional
     * @param licensePlate Placa opcional
     * @returns CarDTO creado o null si hay error
     */
    async execute(
        make: string,
        model: string,
        year: number,
        color?: string,
        licensePlate?: string
    ): Promise<CarDTO | null> {
        // Validaciones de negocio
        if (!make || make.trim().length === 0) {
            throw new Error("La marca es obligatoria");
        }

        if (!model || model.trim().length === 0) {
            throw new Error("El modelo es obligatorio");
        }

        if (!year || year < 1900 || year > new Date().getFullYear() + 1) {
            throw new Error("El año debe ser válido");
        }

        // Si pasó las validaciones, creamos el objeto de dominio
        const car = new Car(make, model, year, color, licensePlate);
        
        // Delegamos al repositorio para la persistencia
        return this.repository.create(car);
    }
}