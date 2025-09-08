import { Car } from "../models/Car";
import { CarDTO } from "../models/CarDTO";
import ApiClient from "../../../../core/API/ApiClient";

/**
 * Repositorio para gestionar las operaciones con carros en la API
 * Utiliza el cliente API centralizado para todas las peticiones
 */
export class CarRepository {
    /**
     * Crear un nuevo carro
     * @param car Datos del carro a crear
     * @returns CarDTO con los datos creados o null si hay error
     */
    async create(car: Car): Promise<CarDTO | null> {
        try {
            // Utilizamos el cliente API centralizado
            const response = await ApiClient.post('/cars', {
                make: car.make,
                model: car.model,
                year: car.year,
                color: car.color,
                licensePlate: car.licensePlate
            });

            // Convertimos la respuesta a nuestro DTO
            const data = response.data;
            return new CarDTO(
                data.id,
                data.make,
                data.model,
                data.year,
                data.createdAt,
                data.updatedAt,
                data.color,
                data.licensePlate
            );
        } catch (error) {
            console.error("Error al crear el carro:", error);
            return null;
        }
    }

    /**
     * Obtener todos los carros
     * @returns Array de CarDTO o array vacío si hay error
     */
    async getAll(): Promise<CarDTO[]> {
        try {
            const response = await ApiClient.get('/cars');
            
            // Mapeamos cada objeto a nuestro DTO
            return response.data.map((item: any) => new CarDTO(
                item.id,
                item.make,
                item.model,
                item.year,
                item.createdAt,
                item.updatedAt,
                item.color,
                item.licensePlate
            ));
        } catch (error) {
            console.error("Error al obtener carros:", error);
            return [];
        }
    }

    /**
     * Obtener un carro por ID
     * @param id ID del carro a buscar
     * @returns CarDTO con los datos o null si no se encuentra o hay error
     */
    async getById(id: number): Promise<CarDTO | null> {
        try {
            const response = await ApiClient.get(`/cars/${id}`);
            
            const data = response.data;
            return new CarDTO(
                data.id,
                data.make,
                data.model,
                data.year,
                data.createdAt,
                data.updatedAt,
                data.color,
                data.licensePlate
            );
        } catch (error) {
            console.error(`Error al obtener el carro con ID ${id}:`, error);
            return null;
        }
    }

    /**
     * Actualizar un carro existente
     * @param id ID del carro a actualizar
     * @param car Nuevos datos del carro
     * @returns CarDTO actualizado o null si hay error
     */
    async update(id: number, car: Car): Promise<CarDTO | null> {
        try {
            const response = await ApiClient.put(`/cars/${id}`, {
                make: car.make,
                model: car.model,
                year: car.year,
                color: car.color,
                licensePlate: car.licensePlate
            });
            
            const data = response.data;
            return new CarDTO(
                data.id,
                data.make,
                data.model,
                data.year,
                data.createdAt,
                data.updatedAt,
                data.color,
                data.licensePlate
            );
        } catch (error) {
            console.error(`Error al actualizar el carro con ID ${id}:`, error);
            return null;
        }
    }

    /**
     * Eliminar un carro
     * @param id ID del carro a eliminar
     * @returns true si se eliminó correctamente, false si hubo error
     */
    async delete(id: number): Promise<boolean> {
        try {
            await ApiClient.delete(`/cars/${id}`);
            return true;
        } catch (error) {
            console.error(`Error al eliminar el carro con ID ${id}:`, error);
            return false;
        }
    }
}