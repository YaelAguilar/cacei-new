// presentation/viewModels/RoleViewModel.ts
import { makeAutoObservable, runInAction } from "mobx";
import { RoleDTO } from "../../data/models/RoleDTO";
import { RoleRepository } from "../../data/repository/roleRepository";
import { CreateRoleUseCase } from "../../domain/CreateRoleUseCase";
import { GetAllRolesUseCase } from "../../domain/GetAllRolesUseCase";
import Toasters from "../../../shared/components/Toasters";

export class RoleViewModel {
    //propiedades de la lista de roles
    roles: RoleDTO[] = [];
    selectedRole: RoleDTO | null = null;

    //propiedades para el manejo de UI
    loading: boolean = false;
    error: string | null = null;
    isModalOpen: boolean = false;
    modalTitle: string = "";
    modalSubtitle: string = "";
    
    //propiedades para paginación
    currentPage: number = 1;
    itemsPerPage: number = 50;
    totalItems: number = 0;

    //propiedades para casos de uso
    private repository: RoleRepository;
    private createRoleUseCase: CreateRoleUseCase;
    private getAllRolesUseCase: GetAllRolesUseCase;

    constructor() {
        makeAutoObservable(this);

        this.repository = new RoleRepository();
        this.createRoleUseCase = new CreateRoleUseCase(this.repository);
        this.getAllRolesUseCase = new GetAllRolesUseCase(this.repository);
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
        this.selectedRole = null;
    }

    setPage(page: number) {
        this.currentPage = page;
        this.loadRoles();
    }

    setItemsPerPage(items: number) {
        this.itemsPerPage = items;
        this.currentPage = 1; // Reset to first page
        this.loadRoles();
    }

    async loadRoles() {
        this.setLoading(true);
        this.setError(null);

        try {
            // Utilizamos el caso de uso para obtener los roles
            const response = await this.getAllRolesUseCase.execute(
                this.currentPage, 
                this.itemsPerPage
            );

            runInAction(() => {
                if (response) {
                    // Actualizar paginación
                    this.totalItems = response.pagination.total;
        
                    this.roles = response.data
                }
            });
        } catch (error: any) {
            this.setError("Error al cargar los roles: " + error.message);
        } finally {
            this.setLoading(false);
        }
    }

    async createRole(roleData: {
        name: string,
        description: string
    }) {
        this.setLoading(true);
        this.setError(null);

        try {
            // Utilizamos directamente el caso de uso con los datos necesarios
            const result = await this.createRoleUseCase.execute(
                roleData.name,
                roleData.description
            );

            runInAction(() => {
                if (result) {
                    Toasters("success", "Rol creado exitosamente");
                    // Actualizar la lista de roles recargando en lugar de hacer push
                    this.loadRoles();
                    this.closeModal();
                } else {
                    Toasters("error", "No se pudo crear el rol");
                }
            });
            
            return !!result;
        } catch (error: any) {
            this.setError("Error al crear el rol: " + error.message);
            Toasters("error", "No se pudo crear el rol");
            return false;
        } finally {
            this.setLoading(false);
        }
    }

    prepareForCreate() {
        this.selectedRole = null;
        this.modalTitle = "Información del Rol";
        this.modalSubtitle = "Ingresa los detalles para crear un nuevo rol de usuario.";
        this.openModal();
    }
}