import { RolePermissions } from "./RolePermissions";
import { MenuPermission, SubMenuPermission } from "./MenuPermission";

// DTO para los atributos del rol
export interface RoleAttributesDTO {
    name: string;
    description: string;
    active: boolean;
}

// DTO para los atributos del menú dentro de permisos
export interface MenuPermissionAttributesDTO {
    name: string;
    description: string;
    icon: string;
    path: string;
    orden: number;
    active: boolean;
    assigned: boolean;
}

// DTO para los atributos del submenú dentro de permisos
export interface SubMenuPermissionAttributesDTO {
    name: string;
    description: string;
    icon: string;
    path: string;
    orden: number;
    active: boolean;
    assigned: boolean;
}

// DTO para el submenú completo
export interface SubMenuPermissionDTO {
    type: string;
    id: string;
    attributes: SubMenuPermissionAttributesDTO;
}

// DTO para relaciones de menús
export interface MenuPermissionRelationshipsDTO {
    submenus: {
        data: SubMenuPermissionDTO[];
    };
}

// DTO para el menú completo
export interface MenuPermissionDTO {
    type: string;
    id: string;
    attributes: MenuPermissionAttributesDTO;
    relationships: MenuPermissionRelationshipsDTO;
}

// DTO para las relaciones del rol
export interface RoleRelationshipsDTO {
    availablePermissions: {
        menus: MenuPermissionDTO[];
    };
}

// DTO para el rol completo
export interface RolePermissionsDTO {
    type: string;
    id: string;
    attributes: RoleAttributesDTO;
    relationships: RoleRelationshipsDTO;
}

// Respuesta JSON:API
export interface RolePermissionsResponseDTO {
    data: RolePermissionsDTO;
}

// Función para mapear de DTO a modelo
export function mapRolePermissionsDTOToRolePermissions(dto: RolePermissionsResponseDTO): RolePermissions {
    // Mapear los menús
    const menus: MenuPermission[] = dto.data.relationships.availablePermissions.menus.map(menuDTO => {
        // Mapear los submenús si existen
        const submenus: SubMenuPermission[] = menuDTO.relationships.submenus.data.map(submenuDTO => ({
            uuid: submenuDTO.id,
            name: submenuDTO.attributes.name,
            description: submenuDTO.attributes.description,
            icon: submenuDTO.attributes.icon,
            path: submenuDTO.attributes.path,
            orden: submenuDTO.attributes.orden,
            active: submenuDTO.attributes.active,
            assigned: submenuDTO.attributes.assigned
        }));

        // Retornar el menú mapeado
        return {
            uuid: menuDTO.id,
            name: menuDTO.attributes.name,
            description: menuDTO.attributes.description,
            icon: menuDTO.attributes.icon,
            path: menuDTO.attributes.path,
            orden: menuDTO.attributes.orden,
            active: menuDTO.attributes.active,
            assigned: menuDTO.attributes.assigned,
            submenus
        };
    });

    // Retornar el rol con permisos mapeado
    return {
        uuid: dto.data.id,
        name: dto.data.attributes.name,
        description: dto.data.attributes.description,
        active: dto.data.attributes.active,
        availablePermissions: {
            menus
        }
    };
}