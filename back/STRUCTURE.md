Arquitectura de carpetas para features de la API

src/roles
├── application
│   ├── AssignMenuToRoleUseCase.ts
│   ├── AssignSubmenuToRoleUseCase.ts
│   ├── createRoleUseCase.ts
│   ├── getRolePermissionsUseCase.ts
│   ├── getRolesUseCase.ts
│   ├── RemoveMenuFromRoleUseCase.ts
│   └── RemoveSubmenuFromRoleUseCase.ts
├── domain
│   ├── interfaces
│   │   └── roleRepository.ts
│   └── models
│       ├── role.ts
│       └── roleWithPermissions.ts
└── infrastructure
    ├── controllers
    │   ├── AssignMenuToRoleController.ts
    │   ├── AssignSubmenuToRoleController.ts
    │   ├── createRoleController.ts
    │   ├── getRolePermissionsController.ts
    │   ├── getRolesController.ts
    │   ├── RemoveMenuFromRoleController.ts
    │   └── RemoveSubmenuFromRoleController.ts
    ├── dependencies.ts
    ├── repositories
    │   └── MysqlRoleRepository.ts
    └── roleRouter.ts

8 directories, 20 files