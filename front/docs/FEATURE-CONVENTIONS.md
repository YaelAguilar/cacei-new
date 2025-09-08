# 🏗️ Convenciones de Features - Auto-Discovery

Esta guía establece las convenciones necesarias para que el sistema de **auto-discovery** funcione correctamente con nuevos features.

## 📋 Tabla de Contenidos

- [Estructura de Features](#estructura-de-features)
- [Convenciones de Nomenclatura](#convenciones-de-nomenclatura)
- [Ejemplos Prácticos](#ejemplos-prácticos)
- [Casos Especiales](#casos-especiales)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Estructura de Features

### Estructura Base Requerida

```
src/features/
└── [feature-name]/                    # kebab-case
    ├── data/
    │   ├── models/
    │   │   ├── [Entity].ts
    │   │   └── [Entity]DTO.ts
    │   └── repository/
    │       └── [Entity]Repository.ts
    ├── domain/
    │   ├── [Action]UseCase.ts
    │   └── [Other]UseCase.ts
    └── presentation/
        ├── components/
        │   ├── [Component].tsx
        │   └── [Form].tsx
        ├── pages/                     # ← CRITICAL: Aquí van las vistas principales
        │   ├── [MainView].tsx         # PascalCase - Auto-discovery target
        │   └── [SecondaryView].tsx    # PascalCase - Auto-discovery target
        ├── validations/
        │   └── [Entity]Schema.ts
        └── viewModels/
            ├── [Entity]ViewModel.ts
            └── [Feature]ViewModel.ts
```

### ⚠️ **Puntos Críticos para Auto-Discovery:**

1. **Carpeta del feature:** DEBE usar `kebab-case`
2. **Archivos de páginas:** DEBEN estar en `presentation/pages/`
3. **Nombres de componentes:** DEBEN usar `PascalCase`
4. **Export:** DEBE usar `export default`

---

## 📝 Convenciones de Nomenclatura

### 🗂️ Nombres de Features (Carpetas)

| ✅ Correcto | ❌ Incorrecto | Descripción |
|-------------|---------------|-------------|
| `user-management` | `UserManagement` | No usar PascalCase |
| `inventory-control` | `inventoryControl` | No usar camelCase |
| `sales-reports` | `sales_reports` | No usar snake_case |
| `customer-service` | `customerservice` | Usar guiones para separar |

### 📄 Nombres de Componentes (Archivos)

| ✅ Correcto | ❌ Incorrecto | Descripción |
|-------------|---------------|-------------|
| `UserManagement.tsx` | `userManagement.tsx` | Primera letra mayúscula |
| `InventoryView.tsx` | `inventory-view.tsx` | No usar kebab-case |
| `SalesReport.tsx` | `salesreport.tsx` | Separar palabras |
| `CustomerProfile.tsx` | `Customer_Profile.tsx` | No usar snake_case |

### 🎯 Patrón de Nomenclatura Recomendado

```typescript
// Estructura típica de nombres:
[Feature][Purpose].tsx

// Ejemplos:
UserManagement.tsx     // Gestión principal de usuarios
UserForm.tsx          // Formulario de usuarios  
UserProfile.tsx       // Perfil de usuario
InventoryView.tsx     // Vista principal de inventario
InventoryReport.tsx   // Reporte de inventario
SalesDashboard.tsx    // Dashboard de ventas
```

---

## 🎯 Ejemplos Prácticos

### Ejemplo 1: Feature de Gestión de Inventario

#### 1️⃣ Estructura de Archivos
```
src/features/
└── inventory-management/              # ← kebab-case
    ├── data/
    │   ├── models/
    │   │   ├── Product.ts
    │   │   └── ProductDTO.ts
    │   └── repository/
    │       └── ProductRepository.ts
    ├── domain/
    │   ├── CreateProductUseCase.ts
    │   └── GetProductsUseCase.ts
    └── presentation/
        ├── components/
        │   ├── ProductCard.tsx
        │   └── ProductForm.tsx
        ├── pages/                     # ← Vistas para auto-discovery
        │   ├── InventoryView.tsx      # ← Vista principal
        │   ├── ProductList.tsx        # ← Lista de productos
        │   └── ProductDetails.tsx     # ← Detalles de producto
        ├── validations/
        │   └── ProductSchema.ts
        └── viewModels/
            └── InventoryViewModel.ts
```

#### 2️⃣ Rutas Resultantes
- `/inventory` → `InventoryView.tsx`
- `/inventory/products` → `ProductList.tsx`
- `/inventory/details` → `ProductDetails.tsx`

### Ejemplo 2: Feature de Inteligencia de Negocios

#### 1️⃣ Estructura de Archivos
```
src/features/
└── business-intelligence/             # ← kebab-case
    └── presentation/
        └── pages/
            ├── SalesReport.tsx        # ← PascalCase
            ├── InventoryReport.tsx    # ← PascalCase
            └── ExecutiveDashboard.tsx # ← PascalCase
```

#### 2️⃣ Auto-Discovery
- `/reports/sales` → `features/business-intelligence/presentation/pages/SalesReport.tsx`
- `/reports/inventory` → `features/business-intelligence/presentation/pages/InventoryReport.tsx`
- `/reports/executive` → `features/business-intelligence/presentation/pages/ExecutiveDashboard.tsx`

---

## ⚡ Casos Especiales

### 🔧 Rutas con Parámetros

Para rutas como `/users/:id/edit`, configura en el router manualmente:

```typescript
// En DynamicRouter.tsx
routes.push({
  path: "/users/:userId/edit",
  element: (
    <ProtectedRoute authViewModel={authViewModel}>
      <LazyComponentWrapper 
        componentName="UserEdit" 
        featureName="user-management"
      />
    </ProtectedRoute>
  )
});
```

### 🎭 Componentes con MobX Observer

```typescript
// ✅ Estructura recomendada para observer
import React from 'react';
import { observer } from 'mobx-react-lite';

const UserManagement: React.FC = observer(() => {
  // Tu lógica aquí
  return (
    <div>
      {/* Tu contenido */}
    </div>
  );
});

export default UserManagement; // ← CRÍTICO: export default
```

---

## 🐛 Troubleshooting

### ❌ Error: "Componente no encontrado"

**Causa:** Convención de nomenclatura incorrecta

**Solución:**
1. ✅ Verificar que la carpeta use `kebab-case`
2. ✅ Verificar que el archivo esté en `presentation/pages/`
3. ✅ Verificar que el componente use `PascalCase`
4. ✅ Verificar `export default`

### ❌ Error: "Archivo encontrado pero sin export válido"

**Causa:** Problema con `export default` o dependencias

**Solución:**
```typescript
// ✅ Correcto
const MyComponent: React.FC = () => { /* ... */ };
export default MyComponent;

// ❌ Incorrecto
export { MyComponent };
export const MyComponent = () => { /* ... */ };
```


### 🔍 Debugging

```typescript
// En consola del navegador:

// 1. Verificar cache del auto-discovery
AutoDiscoveryRegistry.getStats();

// 2. Test manual de componente
AutoDiscoveryRegistry.loadComponent('TuComponente', 'tu-feature')
  .then(comp => console.log('✅ Cargado:', comp))
  .catch(err => console.error('❌ Error:', err));

// 3. Verificar permisos
authViewModel.hasAccessToPath('/tu-ruta');

// 4. Ver rutas disponibles
authViewModel.getAllAssignedPaths();

// 5. Limpiar cache si es necesario
AutoDiscoveryRegistry.clearCache();
```

---

## 📚 Referencias

- [Documentación de MobX](https://mobx.js.org/react-integration.html)
- [Convenciones de React](https://reactjs.org/docs/thinking-in-react.html)
- [Arquitectura MVVM](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)

---

## 🎯 Checklist para Nuevo Feature

- [ ] Carpeta del feature en `kebab-case`
- [ ] Estructura MVVM completa
- [ ] Páginas principales en `presentation/pages/`
- [ ] Componentes con `export default`
- [ ] Configuración en base de datos
- [ ] Asignación de permisos a roles
- [ ] Testing de auto-discovery
- [ ] Documentación actualizada

¡Siguiendo estas convenciones, tu nuevo feature funcionará automáticamente con el sistema de auto-discovery! 🚀