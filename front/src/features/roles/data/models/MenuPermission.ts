export interface MenuPermission {
  uuid: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  orden: number;
  active: boolean;
  assigned: boolean;
  submenus: SubMenuPermission[];
}

export interface SubMenuPermission {
  uuid: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  orden: number;
  active: boolean;
  assigned: boolean;
}