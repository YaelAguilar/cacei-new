//Casos de uso
import { GetRolesUseCase } from "../application/getRolesUseCase";
import { CreateRoleUseCase } from "../application/createRoleUseCase";
import { GetRolePermissionsUseCase } from "../application/getRolePermissionsUseCase";
import { AssignMenuToRoleUseCase } from "../application/AssignMenuToRoleUseCase";
import { AssignSubmenuToRoleUseCase } from "../application/AssignSubmenuToRoleUseCase";
import { RemoveMenuFromRoleUseCase } from "../application/RemoveMenuFromRoleUseCase";
import { RemoveSubmenuFromRoleUseCase } from "../application/RemoveSubmenuFromRoleUseCase";

//Controlladores
import { GetRolesController } from "./controllers/getRolesController";
import { CreateRoleController } from "./controllers/createRoleController";
import { GetRolePermissionsController } from "./controllers/getRolePermissionsController";
import { AssignMenuToRoleController } from "./controllers/AssignMenuToRoleController";
import { AssignSubmenuToRoleController } from "./controllers/AssignSubmenuToRoleController";
import { RemoveMenuFromRoleController } from "./controllers/RemoveMenuFromRoleController";
import { RemoveSubmenuFromRoleController } from "./controllers/RemoveSubmenuFromRoleController";

import { MysqlRoleRepository } from "./repositories/MysqlRoleRepository";
const roleRepository = new MysqlRoleRepository();

const getRolesUseCase = new GetRolesUseCase(roleRepository);
export const getRolesController = new GetRolesController(getRolesUseCase);

const createRoleUseCase = new CreateRoleUseCase(roleRepository);
export const createRoleController = new CreateRoleController(createRoleUseCase);

const getRolePermissionsUseCase = new GetRolePermissionsUseCase(roleRepository);
export const getRolePermissionsController = new GetRolePermissionsController(getRolePermissionsUseCase);

const assignMenuToRoleUseCase = new AssignMenuToRoleUseCase(roleRepository);
export const assignMenuToRoleController = new AssignMenuToRoleController(assignMenuToRoleUseCase);

const assignSubmenuToRoleUseCase = new AssignSubmenuToRoleUseCase(roleRepository);
export const assignSubmenuToRoleController = new AssignSubmenuToRoleController(assignSubmenuToRoleUseCase);

const removeMenuFromRoleUseCase = new RemoveMenuFromRoleUseCase(roleRepository);
export const removeMenuFromRoleController = new RemoveMenuFromRoleController(removeMenuFromRoleUseCase);

const removeSubmenuFromRoleUseCase = new RemoveSubmenuFromRoleUseCase(roleRepository);
export const removeSubmenuFromRoleController = new RemoveSubmenuFromRoleController(removeSubmenuFromRoleUseCase);
