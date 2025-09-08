import ApiClient from "../../../../core/API/ApiClient";
import { MenuDTO, mapMenuDTOToMenu ,extractSubmenusFromMenuDTO } from "../models/MenuDTO";
import { Submenu } from "../models/Submenu";
import { Menu } from "../models/Menu";

export class MenuRepository {
    async getAll(): Promise<Menu[] | null> {
        try {
            const response = await ApiClient.get('/menus'); // o la ruta que uses
            const dtoList: MenuDTO[] = response.data.data;

            return dtoList.map(menuDTO => mapMenuDTOToMenu(menuDTO));
        } catch (error) {
            console.error("Error al obtener los menús:", error);
            return null;
        }
    }

    async create(menu: Menu): Promise<Menu | null> {
        console.log("Creando menú:");
        console.log(menu)
        try {
            const response = await ApiClient.post('/menus', menu);
         
            const menuDTO: MenuDTO = response.data.data;
            return mapMenuDTOToMenu(menuDTO);

        } catch (error) {
            console.error("Error al crear el Menu:", error);
            return null;
        }
    }

    async toggleMenuStatus(uuid: string, active: boolean): Promise<boolean> {
        try {
          const response = await ApiClient.patch(`/menus/${uuid}/status`, {
            active: active
          });
          
          return response.data.status === 'success';
        } catch (error) {
          console.error("Error al cambiar el estado del menú:", error);
          return false;
        }
      }

      async updateMenu(uuid: string, menuData: Partial<{
        name: string,
        description: string,
        icon: string,
        path: string,
        order: number,
        is_navegable: boolean,
        component_name: string | null, // Puede ser null si no es navegable
        feature_name: string,
      }>): Promise<Menu | null> {
        try {
          const response = await ApiClient.put(`/menus/${uuid}`, menuData);
          
          // Verificar si la respuesta tiene la estructura esperada
          if (response.data && response.data.data) {
            const menuDTO: MenuDTO = response.data.data;
            return mapMenuDTOToMenu(menuDTO);
          }
          return null;
        } catch (error) {
          console.error("Error al actualizar el menú:", error);
          return null;
        }
      }

      async getAllWithSubmenus(): Promise<{ menus: Menu[], submenus: Submenu[] } | null> {
        try {
            const response = await ApiClient.get('/menus/submenus');
            const dtoList: MenuDTO[] = response.data.data;
            
            const menus: Menu[] = [];
            const allSubmenus: Submenu[] = [];
            
            dtoList.forEach(menuDTO => {
                // Mapear el menú
                const menu = mapMenuDTOToMenu(menuDTO);
                menus.push(menu);
                
                // Extraer y mapear los submenús
                const submenus = extractSubmenusFromMenuDTO(menuDTO);
                allSubmenus.push(...submenus);
            });
            
            return { menus, submenus: allSubmenus };
        } catch (error) {
            console.error("Error al obtener los menús con submenús:", error);
            return null;
        }
    }

    async getMenuByUUID(uuid: string): Promise<Menu | null> {
        try {
            const response = await ApiClient.get(`/menus/${uuid}`);
            const menuDTO: MenuDTO = response.data.data;

            return mapMenuDTOToMenu(menuDTO);
        } catch (error) {
            console.error("Error al obtener el menú por UUID:", error);
            return null;
        }
    }
}