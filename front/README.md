# README - Proyecto de Analítica CACEI

## Descripción
Este proyecto es una aplicación de analítica enfocada en CACEI (Consejo de Acreditación de la Enseñanza de la Ingeniería), desarrollada con React y TypeScript. La aplicación permite visualizar, analizar y gestionar datos relacionados con procesos de acreditación de programas de ingeniería.

## Requisitos previos
- Node.js (versión 20.x o superior)
- npm (viene incluido con Node.js)

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/alilopez37/CACEI_frontend
cd CACEI_frontend
```

2. Instala las dependencias:
```bash
npm i
```

3. Configura el archivo .env:
Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```
VITE_URL=https://url-api
```

## Ejecución del proyecto

Para iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

Para compilar la aplicación para producción:
```bash
npm run build
```

## Estructura del proyecto

El proyecto sigue una arquitectura basada en features con separación clara de responsabilidades:

```
src/
├── core/                          # Funcionalidades centrales de la aplicación
│   ├── assets/                    # Recursos estáticos globales
│   │   └── react.svg
│   └── navigation/                # Componentes de navegación
│       └── NavegationWrapper.tsx
├── features/                      # Módulos funcionales de la aplicación
│   ├── dashboard/                 # Módulo de dashboard
│   │   └── presentation/
│   │       └── pages/
│   │           └── Dashboard.tsx
│   ├── shared/                    # Componentes compartidos
│   │   └── components/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Table.tsx
│   └── users/                     # Módulo de usuarios (y notas)
│       ├── data/                  # Capa de datos
│       │   ├── models/            # Modelos de datos y DTOs
│       │   │   ├── Note.ts
│       │   │   └── NoteDTO.ts
│       │   └── repository/        # Repositorios para acceso a datos
│       │       └── NoteRepository.ts
│       ├── domain/                # Capa de dominio con casos de uso
│       │   └── CreateNoteUseCase.ts
│       └── presentation/          # Capa de presentación
│           ├── pages/             # Páginas o vistas
│           │   └── NoteView.tsx
│           └── viewmodels/        # ViewModels que conectan UI con lógica
│               └── NoteViewModel.ts
├── index.css                      # Estilos globales
├── main.tsx                       # Punto de entrada de la aplicación
└── vite-env.d.ts                  # Definiciones de tipos para Vite
```

## Arquitectura del proyecto

El proyecto sigue una arquitectura Clean Architecture con separación por features:

- **Core**: Contiene funcionalidades centrales y compartidas a nivel global.
- **Features**: Módulos funcionales organizados por dominio.
  - **Data**: Capa de acceso a datos, modelos y repositorios.
  - **Domain**: Contiene la lógica de negocio y casos de uso.
  - **Presentation**: Componentes de UI, pages y ViewModels.
- **Shared**: Componentes y utilidades reutilizables en toda la aplicación.

## Tecnologías utilizadas
- React
- TypeScript
- Vite

## Configuración de la API
La aplicación utiliza una API configurada mediante la variable de entorno `VITE_URL`. Por defecto, se usa JSONPlaceholder para pruebas, pero debe cambiarse a la API real de CACEI en producción.

## Comandos útiles
- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Compila la aplicación para producción
- `npm run lint`: Ejecuta el linter para verificar el código
- `npm run preview`: Ejecuta la vista previa


## 🏗️ Desarrollo de Features

Este proyecto utiliza un sistema de **auto-discovery** que permite agregar nuevas funcionalidades sin modificar el código de routing.

### 📋 Guías de Desarrollo

- **[📚 Convenciones de Features](./docs/FEATURE-CONVENTIONS.md)** - Guía completa para crear nuevos features
- **[🔧 Auto-Discovery System](./docs/FEATURE-CONVENTIONS.md#troubleshooting)** - Cómo funciona el sistema de descubrimiento automático

### 🚀 Inicio Rápido para Nuevos Features

1. **Crear estructura:** `src/features/mi-nuevo-feature/` (kebab-case)
2. **Agregar página:** `presentation/pages/MiComponente.tsx` (PascalCase)
3. **¡Listo!** El sistema auto-discovery se encarga del resto

### 📖 Lectura Recomendada

Antes de crear un nuevo feature, lee la [**Guía de Convenciones**](./docs/FEATURE-CONVENTIONS.md) para asegurar compatibilidad con el auto-discovery.

---

## Contacto
Ingeniería en Software - UPCHIAPAS