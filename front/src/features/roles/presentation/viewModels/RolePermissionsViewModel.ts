import { makeAutoObservable, runInAction } from "mobx";
import { RoleRepository } from "../../data/repository/roleRepository";
import { GetRolePermissionsUseCase } from "../../domain/GetRolePermissionsUseCase";
import { AssignMenuToRoleUseCase } from "../../domain/AssignMenuToRoleUseCase";
import { AssignSubmenuToRoleUseCase } from "../../domain/AssignSubmenuToRoleUseCase";
import { RemoveMenuFromRoleUseCase } from "../../domain/RemoveMenuFromRoleUseCase";
import { RemoveSubmenuFromRoleUseCase } from "../../domain/RemoveSubmenuFromRoleUseCase";
import { RolePermissions } from "../../data/models/RolePermissions";
import { MenuPermission, SubMenuPermission } from "../../data/models/MenuPermission";
import Toasters from "../../../shared/components/Toasters";

export class RolePermissionsViewModel {
    // Estado
    roleId: string = "";
    rolePermissions: RolePermissions | null = null;
    loading: boolean = false;
    error: string | null = null;
    
    // Casos de uso
    private repository: RoleRepository;
    private getRolePermissionsUseCase: GetRolePermissionsUseCase;
    private assignMenuToRoleUseCase: AssignMenuToRoleUseCase;
    private assignSubmenuToRoleUseCase: AssignSubmenuToRoleUseCase;
    private removeMenuFromRoleUseCase: RemoveMenuFromRoleUseCase;
    private removeSubmenuFromRoleUseCase: RemoveSubmenuFromRoleUseCase;

    constructor() {
        makeAutoObservable(this);
        
        this.repository = new RoleRepository();
        this.getRolePermissionsUseCase = new GetRolePermissionsUseCase(this.repository);
        this.assignMenuToRoleUseCase = new AssignMenuToRoleUseCase(this.repository);
        this.assignSubmenuToRoleUseCase = new AssignSubmenuToRoleUseCase(this.repository);
        this.removeMenuFromRoleUseCase = new RemoveMenuFromRoleUseCase(this.repository);
        this.removeSubmenuFromRoleUseCase = new RemoveSubmenuFromRoleUseCase(this.repository);
    }
    
    // Setters
    setRoleId(id: string) {
        this.roleId = id;
        this.loadRolePermissions();
    }
    
    setLoading(loading: boolean) {
        this.loading = loading;
    }
    
    setError(error: string | null) {
        this.error = error;
    }
    
    // Acciones
    async loadRolePermissions() {
        if (!this.roleId) return;
        
        this.setLoading(true);
        this.setError(null);
        
        try {
            const permissions = await this.getRolePermissionsUseCase.execute(this.roleId);            
            runInAction(() => {
                this.rolePermissions = permissions;
            });
        } catch (error: any) {
            this.setError(`Error al cargar los permisos: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }
    
    async toggleMenuAssignment(menu: MenuPermission) {
        if (!this.roleId) return;
        
        this.setLoading(true);
        
        try {
            let success = false;
            
            if (menu.assigned) {
                // Desasignar menú - usando UUID para ambos
                success = await this.removeMenuFromRoleUseCase.execute(
                    this.roleId, 
                    menu.uuid
                );
            } else {
                // Asignar menú - ahora enviamos solo el menu_id
                success = await this.assignMenuToRoleUseCase.execute(
                    this.roleId, 
                    menu.uuid
                );
            }
            
            if (success) {
                Toasters(
                    "success", 
                    `Menú ${menu.assigned ? "desasignado" : "asignado"} correctamente`
                );
                // Recargar permisos para reflejar los cambios
                await this.loadRolePermissions();
            } else {
                throw new Error(`No se pudo ${menu.assigned ? "desasignar" : "asignar"} el menú`);
            }
        } catch (error: any) {
            Toasters("error", error.message);
            this.setError(error.message);
        } finally {
            this.setLoading(false);
        }
    }
    
    async toggleSubmenuAssignment(submenu: SubMenuPermission) {
        if (!this.roleId) return;
        
        this.setLoading(true);
        
        try {
            let success = false;
            
            if (submenu.assigned) {
                // Desasignar submenú - usando UUID para ambos
                success = await this.removeSubmenuFromRoleUseCase.execute(
                    this.roleId, 
                    submenu.uuid
                );
            } else {
                // Asignar submenú - ahora enviamos solo el submenu_id
                success = await this.assignSubmenuToRoleUseCase.execute(
                    this.roleId, 
                    submenu.uuid
                );
            }
            
            if (success) {
                Toasters(
                    "success", 
                    `Submenú ${submenu.assigned ? "desasignado" : "asignado"} correctamente`
                );
                // Recargar permisos para reflejar los cambios
                await this.loadRolePermissions();
            } else {
                throw new Error(`No se pudo ${submenu.assigned ? "desasignar" : "asignar"} el submenú`);
            }
        } catch (error: any) {
            Toasters("error", error.message);
            this.setError(error.message);
        } finally {
            this.setLoading(false);
        }
    }
}