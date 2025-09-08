import { MenuPermission } from "./MenuPermission";

export interface RolePermissions {
  uuid: string;
  name: string;
  description: string;
  active: boolean;
  availablePermissions: {
    menus: MenuPermission[];
  };
}