# Sistema Educativo - Front-end

Este proyecto contiene la estructura front-end para el Sistema Educativo, organizado con una arquitectura escalable basada en características (feature-based architecture).

## Estructura de Directorios

```
src/
├── assets/                  # Recursos estáticos (imágenes, fuentes, etc.)
├── components/              # Componentes reutilizables
│   ├── common/              # Componentes genéricos (botones, inputs, etc.)
│   ├── layout/              # Componentes de estructura (Header, Sidebar, etc.)
│   └── features/            # Componentes específicos por característica
├── hooks/                   # Hooks personalizados
├── context/                 # Contextos de React para estado global
├── features/                # Organización por características/módulos
│   ├── administracion/      # Módulo de administración
│   │   ├── components/      # Componentes específicos del módulo
│   │   ├── hooks/           # Hooks específicos del módulo
│   │   ├── services/        # Servicios específicos del módulo
│   │   └── pages/           # Páginas del módulo
│   ├── estudiantes/         # Módulo de estudiantes
│   └── finanzas/            # Módulo de finanzas
├── pages/                   # Páginas principales (rutas de nivel superior)
├── routes/                  # Configuración de rutas
├── services/                # Servicios API
│   ├── api.js               # Configuración base de axios
│   ├── auth.service.js      # Servicios de autenticación
│   └── index.js             # Exportación de servicios
├── store/                   # Estado global (Redux o similar)
├── styles/                  # Estilos globales y temas
├── utils/                   # Utilidades y helpers
└── App.jsx                  # Componente principal
```

## Arquitectura

La aplicación está organizada siguiendo una arquitectura basada en características (feature-based architecture), lo que permite una mejor escalabilidad y mantenimiento. Cada módulo o característica principal tiene su propia estructura de carpetas que contiene todos los componentes, servicios y lógica relacionada.

### Módulos Principales

1. **Estudiantes**: Gestión de estudiantes, evaluaciones y niveles académicos.
2. **Administración**: Herramientas administrativas, configuración y gestión de instructores.
3. **Finanzas**: Control de ingresos, gastos y reportes financieros.

### Servicios API

Los servicios API están organizados de la siguiente manera:

- **api.js**: Configuración base de Axios con interceptores para manejo de tokens y errores.
- **auth.service.js**: Servicios de autenticación (login, logout, refresh token).
- Servicios específicos por módulo dentro de cada carpeta de características.

### Manejo de Estado

El estado global se maneja a través de React Context API:

- **AuthContext**: Gestión de autenticación y datos del usuario.

### Enrutamiento

El enrutamiento se implementa utilizando React Router v6 con una estructura anidada:

- Rutas principales en App.jsx
- Rutas específicas por módulo en componentes de rutas dedicados (EstudiantesRoutes, AdministracionRoutes, FinanzasRoutes)

## Convenciones de Código

- Componentes en PascalCase (ej. StudentList.jsx)
- Archivos de servicios y utilidades en camelCase (ej. authService.js)
- Estilos CSS en kebab-case (ej. student-list.css)

## Instalación y Ejecución

1. Instalar dependencias:
   ```
   npm install
   ```

2. Ejecutar en modo desarrollo:
   ```
   npm run dev
   ```

3. Construir para producción:
   ```
   npm run build
   ```

## Dependencias Principales

- React
- React Router
- Axios
- [Otras dependencias según sea necesario]
