import { makeAutoObservable, runInAction } from "mobx";
import { Menu } from "../../data/models/Menu";
import { GetAllMenusUseCase } from "../../domain/getAllMenusUseCase";
import { CreateMenuUseCase } from "../../domain/createMenuUseCase";
import { ToggleMenuStatusUseCase } from "../../domain/toggleMenuStatusUseCase";
import { UpdateMenuUseCase } from "../../domain/updateMenuUseCase";
import { GetMenuByUUID } from "../../domain/GetMenuByUUIDUseCase";
import { MenuRepository } from "../../data/repository/MenuRepository";
import Toasters from "../../../shared/components/Toasters";
import { NavigationSettingsViewModel } from "./NavigationSettingsViewModel";

export class MenuViewModel {
    menus: Menu[] = [];
    selectedMenu: Menu | null = null;
    isLoading: boolean = false;
    error: string | null = null;


    private getAllMenusUseCase: GetAllMenusUseCase;
    private createMenuUseCase: CreateMenuUseCase;
    private toggleMenuStatusUseCase: ToggleMenuStatusUseCase;
    private getMenuByUUIDUseCase: GetMenuByUUID;
    private updateMenuUseCase: UpdateMenuUseCase;
    private navigationViewModel: NavigationSettingsViewModel;

    constructor(navigationViewModel: NavigationSettingsViewModel) {
        makeAutoObservable(this);
        this.navigationViewModel = navigationViewModel;
        const repository = new MenuRepository();
        this.getAllMenusUseCase = new GetAllMenusUseCase(repository);
        this.createMenuUseCase = new CreateMenuUseCase(repository);
        this.toggleMenuStatusUseCase = new ToggleMenuStatusUseCase(repository);
        this.updateMenuUseCase = new UpdateMenuUseCase(repository);
        this.getMenuByUUIDUseCase = new GetMenuByUUID(repository);
    }

    setLoading(loading: boolean) {
        this.isLoading = loading;
    }

    setError(error: string | null) {
        this.error = error;
    }

    closeModal() {
        this.navigationViewModel.closeModal();
        this.selectedMenu = null;
    }

    setSelectedMenu(menu: Menu | null) {
        this.selectedMenu = menu;
    }

    async prepareForEdit(menu: Menu) {
        const menuInfo = await this.getMenuByUUIDUseCase.execute(menu.uuid);
        this.setSelectedMenu(menuInfo);
        this.navigationViewModel.prepareForCreate(); // Esto abrirá el modal
    }

    async loadMenus() {
        this.isLoading = true;
        this.error = null;
        try {
            const data = await this.getAllMenusUseCase.execute();
            runInAction(() => {
                this.menus = data ?? [];
                this.isLoading = false;
            });
        } catch (err) {
            runInAction(() => {
                this.error = "Error al cargar los menús";
                this.isLoading = false;
            });
        }
    }

    async createMenu(menuData: {
        name: string,
        description: string,
        icon: string,
        path: string,
        order: number,
        is_navegable: boolean,   // Si es navegable directamente o solo organizacional
        component_name: string,  // Componente React (NULL si organizacional)
        feature_name: string
    }) {
        this.setLoading(true);
        this.setError(null);

        try {
            const menu = new Menu("", menuData.name, menuData.description, menuData.icon, menuData.path, menuData.order, true, menuData.is_navegable, menuData.component_name, menuData.feature_name);

            const result = await this.createMenuUseCase.execute(
                menu.name,
                menu.description,
                menu.icon,
                menu.path,
                menu.order,
                menu.is_navegable,
                menu.component_name,
                menu.feature_name
            );

            runInAction(() => {
                if (result) {
                    Toasters("success", "Creado exitosamente");
                    this.menus.push(result);
                    this.navigationViewModel.closeModal();
                } else {
                    Toasters("error", "No se pudo crear el Menu");
                    return false;
                }
            });
        } catch (error) {
            Toasters("error", "No se pudo crear el Menu");
            return false;
        } finally {
            this.setLoading(false);
        }
    }

    async toggleMenuStatus(uuid: string) {
        this.setLoading(true);
        
        try {
            // Buscar el menú en la lista
            const menuIndex = this.menus.findIndex(menu => menu.uuid === uuid);
            
            if (menuIndex !== -1) {
                // Obtener el estado actual e invertirlo
                const currentMenu = this.menus[menuIndex];
                const newActiveState = !currentMenu.active;
                
                // Llamar al caso de uso
                const success = await this.toggleMenuStatusUseCase.execute(
                    uuid, 
                    newActiveState
                );
                
                runInAction(() => {
                    if (success) {
                        // Actualizar el estado localmente
                        const updatedMenus = [...this.menus];
                        updatedMenus[menuIndex].active = newActiveState;
                        this.menus = updatedMenus;
                        
                        Toasters("success", `Menú ${newActiveState ? 'activado' : 'desactivado'} correctamente`);
                    } else {
                        Toasters("error", "No se pudo cambiar el estado del menú");
                    }
                });
            }
        } catch (error) {
            runInAction(() => {
                console.error("Error en toggleMenuStatus:", error);
                Toasters("error", "Error al cambiar el estado del menú");
            });
        } finally {
            this.setLoading(false);
        }
    }

    async updateMenu(menuData: {
        name: string,
        description: string,
        icon: string,
        path: string,
        order: number,
        is_navegable: boolean,
        component_name: string | null, // Puede ser null si no es navegable
        feature_name: string,
    }) {
        if (!this.selectedMenu) {
            Toasters("error", "No hay menú seleccionado para actualizar");
            return false;
        }

        this.setLoading(true);
        this.setError(null);

        try {
            const result = await this.updateMenuUseCase.execute(
                this.selectedMenu.uuid,
                menuData
            );

            runInAction(() => {
                if (result) {
                    // Actualizar el menú en la lista
                    const menuIndex = this.menus.findIndex(m => m.uuid === result.uuid);
                    if (menuIndex !== -1) {
                        // Crear una nueva referencia del array para asegurar reactividad
                        const updatedMenus = [...this.menus];
                        updatedMenus[menuIndex] = result;
                        this.menus = updatedMenus;
                    }

                    Toasters("success", "Menú actualizado exitosamente");
                    this.navigationViewModel.closeModal();
                    this.setSelectedMenu(null); // Limpiar la selección
                    return true;
                } else {
                    Toasters("error", "No se pudo actualizar el menú");
                    return false;
                }
            });
        } catch (error) {
            runInAction(() => {
                console.error("Error al actualizar el menú:", error);
                Toasters("error", "Error al actualizar el menú");
                this.setLoading(false);
                return false;
            });
        } finally {
            this.setLoading(false);
        }
    }
}