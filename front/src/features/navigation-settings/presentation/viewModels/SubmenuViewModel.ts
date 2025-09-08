import { makeAutoObservable, runInAction } from "mobx";
import { Menu } from "../../data/models/Menu";
import { Submenu } from "../../data/models/Submenu";
import { GetMenusWithSubmenusUseCase, MenuWithSubmenus } from "../../domain/GetMenusWithSubmenusUseCase";
import { SubmenuRepository } from "../../data/repository/SubmenuRepository";
import { MenuRepository } from "../../data/repository/MenuRepository";
import Toasters from "../../../shared/components/Toasters";
import { NavigationSettingsViewModel } from "./NavigationSettingsViewModel";
import { CreateSubmenuUseCase } from "../../domain/createSubmenuUseCase";
import { ToggleSubmenuStatusUseCase } from "../../domain/toggleSubmenuStatusUseCase";
import { UpdateSubmenuUseCase } from "../../domain/updateSubmenuUseCase";

export class SubmenuViewModel {
    menusWithSubmenus: MenuWithSubmenus[] = [];
    selectedMenu: Menu | null = null;
    selectedSubmenu: Submenu | null = null;
    isLoading: boolean = false;
    error: string | null = null;

    private createSubmenuUseCase: CreateSubmenuUseCase;
    private toggleSubmenuStatusUseCase: ToggleSubmenuStatusUseCase;
    private updateSubmenuUseCase: UpdateSubmenuUseCase;
    private getMenusWithSubmenusUseCase: GetMenusWithSubmenusUseCase;
    private navigationViewModel: NavigationSettingsViewModel;

    constructor(navigationViewModel: NavigationSettingsViewModel) {
        makeAutoObservable(this);
        this.navigationViewModel = navigationViewModel;
        const menuRespository = new MenuRepository();
        const submenuRepository = new SubmenuRepository();
        this.createSubmenuUseCase = new CreateSubmenuUseCase(submenuRepository);
        this.toggleSubmenuStatusUseCase = new ToggleSubmenuStatusUseCase(submenuRepository);
        this.updateSubmenuUseCase = new UpdateSubmenuUseCase(submenuRepository);
        this.getMenusWithSubmenusUseCase = new GetMenusWithSubmenusUseCase(menuRespository);
    }

    setLoading(loading: boolean) {
        this.isLoading = loading;
    }

    setError(error: string | null) {
        this.error = error;
    }

    closeModal() {
        this.navigationViewModel.closeModal();
        this.selectedSubmenu = null;
    }

    setSelectedMenu(menu: Menu | null) {
        this.selectedMenu = menu;
    }

    setSelectedSubmenu(submenu: Submenu | null) {
        this.selectedSubmenu = submenu;
    }

    prepareForEditSubmenu(submenu: Submenu) {
        this.setSelectedSubmenu(submenu);
        this.navigationViewModel.prepareForCreate(); // Esto abrirá el modal
    }

    prepareForAddSubmenu(menu: Menu) {
        this.setSelectedMenu(menu);
        this.setSelectedSubmenu(null);
        this.navigationViewModel.prepareForCreate(); // Esto abrirá el modal
    }

    async loadSubmenus() {
        this.setLoading(true);
        this.error = null;
        try {
            const result = await this.getMenusWithSubmenusUseCase.execute();
            runInAction(() => {
                this.menusWithSubmenus = result;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = "Error al cargar los submenús";
                this.isLoading = false;
            });
        }
    }

    // Agregar métodos para crear, actualizar, y cambiar estado de submenús
    async toggleSubmenuStatus(submenuId: string, menuId: string) {
        this.setLoading(true);

        try {
            const menuIndex = this.menusWithSubmenus.findIndex(
                item => item.menu.uuid === menuId
            );

            if (menuIndex !== -1) {
                const submenuIndex = this.menusWithSubmenus[menuIndex].submenus.findIndex(
                    submenu => submenu.uuid === submenuId
                );

                if (submenuIndex !== -1) {
                    // Obtener el estado actual e invertirlo
                    const currentSubmenu = this.menusWithSubmenus[menuIndex].submenus[submenuIndex];
                    const newActiveState = !currentSubmenu.active;

                    // Llamar al caso de uso
                    const success = await this.toggleSubmenuStatusUseCase.execute(
                        submenuId,
                        newActiveState
                    );

                    runInAction(() => {
                        if (success) {
                            // Crear copias para mantener la reactividad
                            const updatedMenusWithSubmenus = [...this.menusWithSubmenus];
                            const updatedSubmenus = [...updatedMenusWithSubmenus[menuIndex].submenus];

                            // Actualizar el estado del submenú
                            updatedSubmenus[submenuIndex] = {
                                ...updatedSubmenus[submenuIndex],
                                active: newActiveState
                            };

                            // Actualizar el estado
                            updatedMenusWithSubmenus[menuIndex] = {
                                ...updatedMenusWithSubmenus[menuIndex],
                                submenus: updatedSubmenus
                            };

                            this.menusWithSubmenus = updatedMenusWithSubmenus;

                            Toasters("success", `Submenú ${newActiveState ? 'activado' : 'desactivado'} correctamente`);
                        } else {
                            Toasters("error", "No se pudo cambiar el estado del submenú");
                        }
                    });
                }
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

    async createSubmenu(submenuData: {
        menuId: string,
        name: string,
        description: string,
        component_name: string,
        path: string,
        order: number
    }) {
        this.setLoading(true);
        this.setError(null);

        try {
            const result = await this.createSubmenuUseCase.execute(
                submenuData.name,
                submenuData.description,
                submenuData.component_name,
                submenuData.path,
                submenuData.order,
                submenuData.menuId
            );

            runInAction(() => {
                if (result) {
                    const menuIndex = this.menusWithSubmenus.findIndex(
                        item => item.menu.uuid === submenuData.menuId
                    );

                    if (menuIndex !== -1) {
                        // Crear una copia del arreglo para mantener la reactividad
                        const updatedMenusWithSubmenus = [...this.menusWithSubmenus];

                        // Agregar el nuevo submenú al arreglo de submenus del menú padre
                        updatedMenusWithSubmenus[menuIndex] = {
                            ...updatedMenusWithSubmenus[menuIndex],
                            submenus: [...updatedMenusWithSubmenus[menuIndex].submenus, result]
                        };

                        // Actualizar el estado
                        this.menusWithSubmenus = updatedMenusWithSubmenus;
                    } else {
                        // Si por alguna razón no se encuentra el menú padre, podríamos
                        // recargar todos los menús con sus submenús
                        console.warn(`No se encontró el menú padre con ID ${submenuData.menuId}`);
                        this.loadSubmenus(); // Cargar todo nuevamente
                    }
                    Toasters("success", "Creado exitosamente");
                    this.navigationViewModel.closeModal();
                } else {
                    Toasters("error", "No se pudo crear el Submenú");
                    return false;
                }
            });
        } catch (error) {
            Toasters("error", "No se pudo crear el Submenú");
            return false;
        } finally {
            this.setLoading(false);
        }
    }

    async updateSubmenu(submenuData: {
        name: string,
        description: string,
        component_name: string,
        path: string,
        order: number,
        menuId: string
    }) {
        if (!this.selectedSubmenu) {
            Toasters("error", "No hay submenú seleccionado para actualizar");
            return false;
        }
        this.setLoading(true);
        this.setError(null);

        try {

            const updateData = {
                name: submenuData.name,
                description: submenuData.description,
                component_name: submenuData.component_name,
                path: submenuData.path,
                sort_order: submenuData.order,
                id_menu: submenuData.menuId
            };

            const result = await this.updateSubmenuUseCase.execute(
                this.selectedSubmenu.uuid,
                updateData
            );

            runInAction(() => {
                if (result) {
                    // Buscar el índice del menú padre en el arreglo menusWithSubmenus
                    const menuIndex = this.menusWithSubmenus.findIndex(
                        item => item.menu.uuid === submenuData.menuId
                    );

                    if (menuIndex !== -1) {
                        // Crear una copia del arreglo de menús para mantener la reactividad
                        const updatedMenusWithSubmenus = [...this.menusWithSubmenus];

                        // Buscar el índice del submenú dentro del arreglo de submenus
                        const submenuIndex = updatedMenusWithSubmenus[menuIndex].submenus.findIndex(
                            submenu => submenu.uuid === this.selectedSubmenu!.uuid
                        );

                        if (submenuIndex !== -1) {
                            // Crear una copia del arreglo de submenus para mantener la reactividad
                            const updatedSubmenus = [...updatedMenusWithSubmenus[menuIndex].submenus];

                            // Reemplazar el submenú actualizado
                            updatedSubmenus[submenuIndex] = result;

                            // Actualizar el estado
                            updatedMenusWithSubmenus[menuIndex] = {
                                ...updatedMenusWithSubmenus[menuIndex],
                                submenus: updatedSubmenus
                            };

                            this.menusWithSubmenus = updatedMenusWithSubmenus;
                        }
                    } else {
                        // Si no se encuentra el menú, recargamos todo
                        console.warn(`No se encontró el menú padre con ID ${submenuData.menuId}`);
                        this.loadSubmenus();
                    }

                    Toasters("success", "Submenú actualizado exitosamente");
                    this.navigationViewModel.closeModal();
                    this.setSelectedSubmenu(null);
                    return true;
                } else {
                    Toasters("error", "No se pudo actualizar el submenú");
                    return false;
                }
            });


        } catch (error) {
            runInAction(() => {
                Toasters("error", "Error al actualizar el Submenú");
                this.setLoading(false);
                return false;
            });
        } finally {
            this.setLoading(false);
        }
    }
}