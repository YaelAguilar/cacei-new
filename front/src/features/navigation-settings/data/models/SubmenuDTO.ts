import { Submenu } from "./Submenu";

export interface SubmenuAttributes {
    name: string;
    description: string;
    icon: string;
    path: string;
    sort_order: number;
    active: boolean;
    component_name: string;
}

export interface SubmenuDTO {
    type: string;
    id: string;
    attributes: SubmenuAttributes;
}

export function mapSubmenuDTOToSubmenu(dto: SubmenuDTO, menuId: string): Submenu {
    return new Submenu(
        dto.id,
        menuId, // Asignar el menuId del menú padre
        dto.attributes.name,
        dto.attributes.description,
        dto.attributes.icon,
        dto.attributes.path,
        dto.attributes.sort_order,
        dto.attributes.active,
        dto.attributes.component_name
    );
}