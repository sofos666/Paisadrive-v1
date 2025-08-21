# PaisaDrive 🚗

PaisaDrive es una moderna plataforma web diseñada para facilitar la compra y venta de vehículos. Ofrece una interfaz de usuario limpia, rápida e intuitiva, construida con tecnologías de vanguardia. El proyecto utiliza Supabase como backend para gestionar la base de datos, la autenticación y el almacenamiento de archivos.

## ✨ Características Principales

- **Marketplace de Vehículos:** Explora una amplia gama de vehículos listados en la plataforma.
- **Páginas de Detalle:** Cada vehículo cuenta con una página detallada con sus especificaciones, imágenes y precio.
- **Vende tu Auto:** Un formulario intuitivo para que los usuarios puedan listar sus propios vehículos para la venta.
- **Panel de Administración:** Una vista de administrador para gestionar los listados y otros aspectos de la plataforma.
- **Autenticación de Usuarios:** Sistema seguro de registro e inicio de sesión para los usuarios.
- **Página de Seguros y Créditos:** Secciones informativas sobre seguros y opciones de financiamiento.

## 🚀 Stack Tecnológico

- **Frontend:**
  - **React:** Biblioteca para construir interfaces de usuario.
  - **Vite:** Herramienta de desarrollo frontend extremadamente rápida.
  - **TypeScript:** Superset de JavaScript que añade tipado estático.
  - **Tailwind CSS:** Framework de CSS "utility-first" para un diseño rápido y personalizado.
  - **Shadcn/UI:** Colección de componentes de UI reutilizables.
- **Backend:**
  - **Supabase:** Plataforma de "Backend as a Service" que provee base de datos (PostgreSQL), autenticación, y almacenamiento.

## ⚙️ Cómo Empezar

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### **Prerrequisitos**

- **Node.js:** Asegúrate de tener instalada una versión LTS (v18 o superior).
- **pnpm:** Este proyecto utiliza `pnpm` como gestor de paquetes. Si no lo tienes, instálalo con `npm install -g pnpm`.
- **Cuenta de Supabase:** Necesitarás una cuenta gratuita en [Supabase](https://supabase.com/).

### **1. Clonar e Instalar Dependencias**

```bash
# Clona este repositorio (o simplemente usa tu copia local)
# git clone [URL_DEL_REPOSITORIO]

# Navega al directorio del proyecto
cd paisadrive0

# Instala las dependencias del proyecto
pnpm install
```

### **2. Configurar Supabase**

1.  **Crea un Nuevo Proyecto:** Ve a tu [dashboard de Supabase](https://app.supabase.com/) y crea un nuevo proyecto.
2.  **Crea las Tablas:**
    - Dentro de tu proyecto en Supabase, ve al **Editor de SQL**.
    - Copia el contenido de los archivos `.sql` de este repositorio (`database-setup.sql`, `feature_cars_migration.sql`, etc.) y ejecútalo para configurar las tablas y la estructura de la base de datos.
3.  **Obtén tus Claves API:**
    - En el dashboard de Supabase, ve a **Configuración (Settings) > API**.
    - Allí encontrarás la **URL del Proyecto** y la clave pública **`anon` key**.

### **3. Configurar Variables de Entorno**

1.  **Crea el archivo `.env.local`:** En la raíz del proyecto, crea un archivo llamado `.env.local`.
2.  **Añade tus claves de Supabase:** Copia el siguiente formato y pega las claves que obtuviste en el paso anterior.

    ```env
    VITE_SUPABASE_URL="URL_DE_TU_PROYECTO_SUPABASE"
    VITE_SUPABASE_ANON_KEY="TU_ANON_KEY_DE_SUPABASE"
    ```

### **4. Ejecutar la Aplicación**

Una vez completada la configuración, puedes iniciar el servidor de desarrollo:

```bash
pnpm run dev
```

¡Abre [http://localhost:5173](http://localhost:5173) (o el puerto que indique Vite) en tu navegador para ver la aplicación en funcionamiento!

## 📦 Scripts Disponibles

- `pnpm run dev`: Inicia el servidor de desarrollo.
- `pnpm run build`: Compila la aplicación para producción en la carpeta `dist`.
- `pnpm run lint`: Ejecuta el linter de ESLint para revisar el código.
- `pnpm run preview`: Sirve la compilación de producción localmente para previsualizarla.