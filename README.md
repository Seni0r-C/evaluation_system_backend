# Sistema de Evaluación de Titulación

## Descripción

Este proyecto es el backend de un sistema de evaluación de trabajos de titulación. Gestiona todo el proceso, desde la asignación de tribunales y la definición de rúbricas de evaluación hasta la generación de actas de notas.

## Características Principales

*   **Gestión de Usuarios y Roles:** Manejo de diferentes tipos de usuarios (administradores, docentes, estudiantes) con sus respectivos permisos.
*   **Trabajos de Titulación:** Creación y seguimiento de los trabajos de titulación, incluyendo la asignación de tutores y tribunales.
*   **Rúbricas de Evaluación:** Creación y gestión de rúbricas personalizadas para la evaluación de los trabajos.
*   **Calificaciones:** Registro de las calificaciones otorgadas por los miembros del tribunal.
*   **Generación de Actas:** Generación automática de actas de notas en formato PDF.
*   **Reportes:** Generación de reportes y estadísticas del proceso de titulación.

## Empezando

Sigue estas instrucciones para tener una copia del proyecto corriendo en tu máquina local para desarrollo y pruebas.

### Prerrequisitos

*   [Node.js](https://nodejs.org/) (versión 14 o superior)
*   [MySQL](https://www.mysql.com/)

### Instalación

*  **Instala las dependencias:**
    ```bash
    npm install
    ```

## Variables de Entorno

Para correr la aplicación, necesitas crear un archivo `.env` en la raíz del proyecto. Puedes copiar el archivo `.env.example` como plantilla:

```bash
cp .env.example .env
```

Asegúrate de llenar las siguientes variables en tu archivo `.env`:

*   `DB_HOST`: Host de la base de datos
*   `DB_USER`: Usuario de la base de datos
*   `DB_PASSWORD`: Contraseña de la base de datos
*   `DB_NAME`: Nombre de la base de datos
*   `JWT_SECRET`: Un secreto para la generación de JSON Web Tokens
*   `PORT`: El puerto en el que correrá la aplicación (por defecto 3000)
*   `FRONTEND_URL`: La URL del frontend de la aplicación
*   `FAKE_AUTH`: Si se debe usar autenticación falsa (para pruebas)
*   `UTM_API_KEY`: Clave de API para UTM (necesario para el inicio de sesión con las credenciales de UTM)
*   `CALIFICACION_MINIMA`: Calificación mínima para aprobar un trabajo de titulación
*   `ADMIN_USERNAME`: Nombre de usuario del administrador
*   `ADMIN_PASSWORD`: Contraseña del administrador


## Corriendo la Aplicación

Para iniciar la aplicación en modo de desarrollo (con recarga automática), corre:

```bash
npm run dev
```

Para iniciar la aplicación en modo de producción, corre:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000` (o el puerto que hayas configurado).

## Endpoints de la API

La API provee varios endpoints para gestionar los recursos de la aplicación. Las rutas principales están definidas en el directorio `src/routes`.

*   `/auth`: Autenticación de usuarios
*   `/usuarios`: Gestión de usuarios
*   `/roles`: Gestión de roles
*   `/trabajos-titulacion`: Gestión de trabajos de titulación
*   `/rubricas`: Gestión de rúbricas
*   `/calificaciones`: Gestión de calificaciones
*   `/actas`: Generación de actas
*   `/carrera`: Gestión de carreras
*   `/modalidad-titulacion`: Gestión de modalidades de titulación
*   `/notas`: Gestión de notas
*   `/reportes`: Gestión de reportes
*   `/rutas`: Gestión de rutas

Para una documentación detallada de la API, puedes revisar el código en `src/routes` y `src/controllers`.

## Estructura del Proyecto

```
evaluation_system_backend/
├── app.js                # Archivo de entrada de la aplicación
├── package.json          # Dependencias y scripts del proyecto
├── .env.example          # Plantilla para las variables de entorno
├── sql/                  # Scripts SQL y backups de la base de datos
├── src/
│   ├── config/           # Configuración (base de datos, etc.)
│   ├── controllers/      # Lógica de negocio de los endpoints
│   ├── dto/              # Data Transfer Objects
│   ├── middlewares/      # Middlewares de Express
│   ├── routes/           # Definición de las rutas de la API
│   ├── services/         # Lógica de negocio y acceso a datos
│   └── utils/            # Funciones de utilidad
└── templates/            # Plantillas HTML para la generación de PDFs
```

## Dependencias

Este proyecto utiliza las siguientes dependencias principales:

*   **Express:** Framework web para Node.js
*   **Sequelize:** ORM para Node.js (usado con MySQL)
*   **MySQL2:** Driver de MySQL para Node.js
*   **JSONWebToken:** Para la autenticación basada en tokens
*   **Bcryptjs:** Para el hasheo de contraseñas
*   **Puppeteer:** Para la generación de PDFs a partir de HTML
*   **Axios:** Cliente HTTP basado en promesas
*   **CORS:** Para habilitar CORS
*   **Dotenv:** Para cargar variables de entorno desde un archivo .env
*   **ExcelJS:** Para leer y escribir archivos de Excel
*   **Express-validator:** Un conjunto de middlewares de express para la validación de datos
*   **fs-extra:** Métodos adicionales para el sistema de archivos
*   **helmet:** Ayuda a securizar aplicaciones de Express
*   **morgan:** Logger de peticiones HTTP

Puedes encontrar la lista completa de dependencias en el archivo `package.json`.

## Autores

- Arteaga Toro Carlos Luis
- Rodriguez Zambrano Jostin Andres
