import { makeAutoObservable, runInAction } from "mobx";
import { Car } from "../../data/models/Car";
import { CarDTO } from "../../data/models/CarDTO";
import { CarRepository } from "../../data/repository/CarRepository";
import { CreateCarUseCase } from "../../domain/CreateCarUseCase";

/**
 * ViewModel para gestionar la lógica de presentación de carros utilizando MobX
 */
export class CarViewModel {
  // Propiedades para la lista de carros
  cars: CarDTO[] = [];
  selectedCar: CarDTO | null = null;
  
  // Propiedades para manejo de UI
  loading: boolean = false;
  error: string | null = null;
  isModalOpen: boolean = false;
  modalTitle: string = "Añadir nuevo carro";
  modalSubtitle: string = "Completa el formulario para añadir un carro al inventario";
  
  // Propiedades para casos de uso
  private repository: CarRepository;
  private createCarUseCase: CreateCarUseCase;

  constructor() {
    // Convierte automáticamente todas las propiedades en observables
    makeAutoObservable(this);
    
    // Inicializa repositorio y casos de uso
    this.repository = new CarRepository();
    this.createCarUseCase = new CreateCarUseCase(this.repository);
    
    // Carga inicial de datos
    this.loadCars();
  }

  /**
   * Carga todos los carros desde el repositorio
   */
  async loadCars() {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const carsData = await this.repository.getAll();
      
      runInAction(() => {
        this.cars = carsData;
      });
    } catch (err: any) {
      this.setError("Error al cargar los carros: " + err.message);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Crea un nuevo carro
   */
  async createCar(carData: {
    make: string;
    model: string;
    year: number;
    color?: string;
    licensePlate?: string;
  }) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const car = new Car(
        carData.make,
        carData.model,
        carData.year,
        carData.color,
        carData.licensePlate
      );
      
      const result = await this.createCarUseCase.execute(
        car.make,
        car.model,
        car.year,
        car.color,
        car.licensePlate
      );
      
      runInAction(() => {
        if (result) {
          // Añadimos el nuevo carro a la lista
          this.cars.push(result);
          this.closeModal();
          return true;
        } else {
          this.setError("No se pudo crear el carro");
          return false;
        }
      });
    } catch (err: any) {
      this.setError(err.message || "Error al crear el carro");
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Actualiza un carro existente
   */
  async updateCar(id: number, carData: {
    make: string;
    model: string;
    year: number;
    color?: string;
    licensePlate?: string;
  }) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const car = new Car(
        carData.make,
        carData.model,
        carData.year,
        carData.color,
        carData.licensePlate
      );
      
      const result = await this.repository.update(id, car);
      
      runInAction(() => {
        if (result) {
          // Actualizamos el carro en la lista
          const index = this.cars.findIndex(c => c.id === id);
          if (index >= 0) {
            this.cars[index] = result;
          }
          this.selectedCar = result;
          this.closeModal();
          return true;
        } else {
          this.setError("No se pudo actualizar el carro");
          return false;
        }
      });
    } catch (err: any) {
      this.setError(err.message || "Error al actualizar el carro");
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Elimina un carro
   */
  async deleteCar(id: number) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const success = await this.repository.delete(id);
      
      runInAction(() => {
        if (success) {
          // Eliminamos el carro de la lista
          this.cars = this.cars.filter(c => c.id !== id);
          
          if (this.selectedCar?.id === id) {
            this.selectedCar = null;
          }
          return true;
        } else {
          this.setError("No se pudo eliminar el carro");
          return false;
        }
      });
    } catch (err: any) {
      this.setError(err.message || "Error al eliminar el carro");
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Selecciona un carro para edición
   */
  selectCarForEdit(car: CarDTO) {
    this.selectedCar = car;
    this.modalTitle = "Editar carro";
    this.modalSubtitle = "Actualiza la información del carro";
    this.openModal();
  }

  /**
   * Prepara para crear un nuevo carro
   */
  prepareForCreate() {
    this.selectedCar = null;
    this.modalTitle = "Añadir nuevo carro";
    this.modalSubtitle = "Completa el formulario para añadir un carro al inventario";
    this.openModal();
  }

  /**
   * Confirma la eliminación de un carro
   */
  confirmDelete(id: number) {
    if (window.confirm("¿Estás seguro de que deseas eliminar este carro?")) {
      this.deleteCar(id);
    }
  }

  // ---- Métodos para manejo del estado UI ----
  
  setLoading(loading: boolean) {
    this.loading = loading;
  }
  
  setError(error: string | null) {
    this.error = error;
  }
  
  openModal() {
    this.isModalOpen = true;
  }
  
  closeModal() {
    this.isModalOpen = false;
    this.selectedCar = null;
  }
}