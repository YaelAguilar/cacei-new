// Función para convertir de DTO a modelo de dominio
import { Role } from "./Role";
export interface RoleAttributes {
    name: string;
    description: string;
    active?: number;
    created_at?: string;
    updated_at?: string;
    user_creation?: string | null;
    user_update?: string | null;
}

export interface RoleMeta {
    menuCount: number;
    submenuCount: number;
    userCount: number;
}

export interface RoleDTO {
    type: string;
    id: string;
    attributes: RoleAttributes;
    meta: RoleMeta;
}

// Interfaz para la respuesta JSON:API
export interface JsonApiResponse<T> {
    data: T;
    meta?: {
        pagination?: {
            currentPage: number;
            limit: number;
            total: number;
        };
    };
}

// Interfaz para la respuesta paginada de roles
export interface PaginatedRoleResponse {
    data: RoleDTO[];
    meta: {
        pagination: {
            currentPage: number;
            limit: number;
            total: number;
        };
    };
}


export function mapRoleDTOToRole(roleDTO: RoleDTO): Role {
    return new Role(
        roleDTO.attributes.name,
        roleDTO.attributes.description,
        undefined, // id numérico (no viene en la respuesta JSON:API)
        roleDTO.id, // UUID
        roleDTO.attributes.active !== undefined ? !!roleDTO.attributes.active : undefined,
        roleDTO.attributes.created_at ? new Date(roleDTO.attributes.created_at) : undefined,
        roleDTO.attributes.updated_at ? new Date(roleDTO.attributes.updated_at) : undefined,
        roleDTO.attributes.user_creation,
        roleDTO.attributes.user_update
    );
}