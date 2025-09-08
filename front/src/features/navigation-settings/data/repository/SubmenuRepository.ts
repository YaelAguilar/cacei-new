import ApiClient from "../../../../core/API/ApiClient";
import { SubmenuDTO, mapSubmenuDTOToSubmenu} from "../models/SubmenuDTO";
import { Submenu } from "../models/Submenu";

export class SubmenuRepository {
    async create(submenu : Submenu): Promise<Submenu | null>{
       try {
        const response = await ApiClient.post('/submenus',{
            name: submenu.name,
            description: submenu.description,
            component_name: submenu.component_name,
            path: submenu.path,
            sort_order: submenu.order,
            id_menu: submenu.menuId
        })

        const submenuDTO: SubmenuDTO = response.data.data
        return mapSubmenuDTOToSubmenu(submenuDTO, submenu.menuId);
       } catch (error) {
        console.error("Error al crear el Menu:", error);
        return null;
       } 
    }

    async toggleSubmenuStatus(uuid: string, active: boolean): Promise<boolean>{
        try {
            const response = await ApiClient.patch(`/submenus/${uuid}/status`, {
                active: active
            });
            return response.data.status === 'success';
        } catch (error) {
            console.error("Error al cambiar el estado del submenú:", error);
            return false;
        }
    }

    async updateSubmenu(uuid: string, submenuData: Partial<{
        name: string,
        description: string,
        component_name: string,
        path: string,
        sort_order: number,
        id_menu: string
    }>): Promise<Submenu | null>{
        try {
            console.log("SubemnuRepository")
            console.log(submenuData)
            const response = await ApiClient.put(`/submenus/${uuid}`, submenuData);
            if(response.data && response.data.data){
                const submenuDTO: SubmenuDTO = response.data.data;
                return mapSubmenuDTOToSubmenu(submenuDTO, submenuData.id_menu!);
            }
            return null;
        } catch (error) {
            console.error("Error al actualizar el submenú:", error);
            return null;
        }
    }
}