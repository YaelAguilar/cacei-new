import { SubMenuRef } from "./subMenuRef";

export interface MenuWithSubmenus {
  uuid: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
  submenus: SubMenuRef[];
}