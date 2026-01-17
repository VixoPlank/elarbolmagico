# React Starter Kit

Un proyecto personal basado en [AdonisJS Inertia Starter Kit](https://github.com/adonisjs/react-starter-kit), adaptado para mis necesidades específicas.

## 🚀 Tecnologías

### Backend
- **AdonisJS 7.x** - Framework Node.js con TypeScript
- **Lucid ORM** - ORM para base de datos
- **VineJS** - Validación de datos
- **Inertia.js** - Para aplicaciones SPA server-driven
- **PostgreSQL** - Base de datos
- **Redis** - Para sesiones y cache

### Frontend
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Inertia.js React** - Integración React con Inertia

### Herramientas de Desarrollo
- **ESLint** - Linter
- **Prettier** - Formateador de código
- **Docker** - Containerización (compose.yml incluido)

## 📋 Características

- ✅ Autenticación con sesiones
- ✅ Sistema de usuarios
- ✅ Validación de formularios
- ✅ Protección CSRF
- ✅ Server-side rendering (SSR)
- ✅ Hot Module Replacement (HMR)
- ✅ TypeScript en backend y frontend
- ✅ Estructura de proyecto escalable

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/VixoPlank/react-starter-kit.git
cd react-starter-kit
```

2. Instalar dependencias:
```bash
npm install
# o
pnpm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Generar la clave de la aplicación:
```bash
node ace generate:key
```

5. Configurar la base de datos en `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=nombre_base_datos
```

6. Ejecutar migraciones:
```bash
node ace migration:run
```

## 🚦 Uso

### Desarrollo
```bash
npm run dev
```

Esto iniciará:
- Servidor AdonisJS en `http://localhost:3333`
- Vite dev server con HMR

### Producción
```bash
npm run build
npm start
```

### Otros comandos
```bash
# Ejecutar tests
npm test

# Linter
npm run lint

# Formatear código
npm run format

# Type checking
npm run typecheck
```

## 📁 Estructura del Proyecto

```
react-starter-kit/
├── app/                    # Lógica de la aplicación
│   ├── controllers/        # Controladores
│   ├── models/             # Modelos de base de datos
│   ├── middleware/         # Middleware personalizado
│   ├── validators/         # Validadores VineJS
│   └── transformers/       # Transformadores de datos
├── config/                 # Archivos de configuración
├── database/               # Migraciones y schema
├── inertia/                # Frontend React
│   ├── app/               # Componentes principales
│   ├── pages/             # Páginas Inertia
│   ├── layouts/           # Layouts
│   └── css/               # Estilos
├── resources/              # Recursos estáticos
└── start/                  # Archivos de inicio
```

## 🔐 Autenticación

El proyecto incluye:
- Login y registro de usuarios
- Middleware de autenticación
- Protección de rutas
- Gestión de sesiones

## 📝 TODO

Ver [docs/TODO.md](./docs/TODO.md) para la lista de tareas pendientes.

## 📄 Licencia

Este es un proyecto personal. Basado en el [AdonisJS Inertia Starter Kit](https://github.com/adonisjs/react-starter-kit) (licencia MIT).

## 🤝 Contribuciones

Este es un proyecto personal, pero las sugerencias son bienvenidas.

---

Hecho con ❤️ usando AdonisJS y React
