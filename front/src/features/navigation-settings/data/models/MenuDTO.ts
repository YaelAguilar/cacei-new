import { Menu } from "./Menu";
import { Submenu } from "./Submenu";
import { SubmenuDTO, mapSubmenuDTOToSubmenu } from "./SubmenuDTO";

export interface MenuAttributes {
    name: string;
    description: string;
    icon: string;
    path: string;
    orden: number;
    active: boolean;
    is_navegable: boolean;
    component_name: string;
    feature_name: string; 
}

export interface MenuRelationships {
    submenus?: {
        data: SubmenuDTO[];
    };
}

export interface MenuDTO {
    id: string;
    type: string;
    attributes: MenuAttributes;
    relationships?: MenuRelationships;
    meta?: {
        submenuCount?: number;
    };
}

export function mapMenuDTOToMenu(dto: MenuDTO): Menu {
    const menu = new Menu(
        dto.id,
        dto.attributes.name,
        dto.attributes.description,
        dto.attributes.icon,
        dto.attributes.path,
        dto.attributes.orden,
        dto.attributes.active,
        dto.attributes.is_navegable,
        dto.attributes.component_name,
        dto.attributes.feature_name
    );

    // Añadir conteo de submenús desde los datos de relaciones o desde meta
    if (dto.relationships?.submenus?.data) {
        (menu as any).submenuCount = dto.relationships.submenus.data.length;
    } else if (dto.meta?.submenuCount !== undefined) {
        (menu as any).submenuCount = dto.meta.submenuCount;
    }

    return menu;
}

// Nueva función para extraer submenús de un MenuDTO
export function extractSubmenusFromMenuDTO(dto: MenuDTO): Submenu[] {
    if (!dto.relationships?.submenus?.data) {
        return [];
    }
    
    return dto.relationships.submenus.data.map(submenuDTO => 
        mapSubmenuDTOToSubmenu(submenuDTO, dto.id)
    );
}