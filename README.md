Manual de Instalación: Pasos para Ejecutar la Aplicación Frontend 🚀

1. Dependencias (Prerrequisitos)
Antes de comenzar, asegúrate de tener instalado el siguiente software en tu sistema:

  Node.js: Se recomienda la versión 20.19.0 o superior.

  NPM: El gestor de paquetes de Node.js, que se instala automáticamente con Node.js.

2. Configuración del Proyecto
Sigue estos pasos para poner en marcha el proyecto en tu entorno local.

Paso 1: Clona el Repositorio
Abre tu terminal y ejecuta el siguiente comando para descargar el código fuente del proyecto:

  git clone <URL-DEL-REPOSITORIO-FRONTEND>
  cd Mercado-Local-Frontend

Paso 2: Instala las Dependencias del Proyecto
Una vez dentro de la carpeta del proyecto, instala todas las dependencias necesarias que se encuentran en el archivo package.json.

  npm install

Este comando descargará todas las librerías necesarias, como React, Axios y Vite.

Paso 3: Configura las Variables de Entorno
Para que la aplicación se conecte correctamente con los servicios externos, es crucial configurar las variables de entorno.

Crea un archivo .env en la raíz del proyecto.

Copia y pega el siguiente contenido, reemplazando los valores de Cloudinary con tus propias credenciales si es necesario.

# Credenciales para la subida de imágenes a Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=dg3qn86ka
VITE_CLOUDINARY_UPLOAD_PRESET=cxb41gni

# URL del servidor backend
VITE_API_URL=https://mercado-local-backend.onrender.com/api

3. Ejecución de la Aplicación
Ahora que todo está configurado, puedes iniciar el servidor de desarrollo.

Ejecuta la aplicación:

  npm run dev

Este comando debe de estar definido en el archivo package.json, utiliza Vite para iniciar el servidor de desarrollo rápido con recarga en caliente (Hot Module Replacement).

¡Y listo!  Si todo ha salido bien, verás un mensaje en la consola indicando que el servidor está corriendo. Puedes abrir la URL que te proporciona (normalmente http://localhost:5173) en tu navegador para ver la aplicación.