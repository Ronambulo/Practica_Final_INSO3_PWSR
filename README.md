# Práctica Intermedia INSO3 PWSR

Este proyecto es una aplicación backend desarrollada en Node.js/Express para gestionar usuarios. Incluye funcionalidades básicas como registro, validación del email, inicio de sesión, actualización de datos y gestión de imágenes (logo).

## Descripción

La aplicación permite a los usuarios:

- Registrarse (con validación de email y contraseña).
- Validar su email a través de un código.
- Iniciar sesión y obtener un token de autenticación.
- Actualizar sus datos personales o de compañía.
- Subir un logo (imagen).

## Instalación y Uso

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/Ronambulo/Practica_Intermedia_INSO3_PWSR.git
   ```

2. **Accede al directorio:**

   ```bash
   cd Practica_Intermedia_INSO3_PWSR
   ```

3. **Crea tu propio archivo `.env`**  
   Asegúrate de crear un archivo `.env` para definir las variables de entorno necesarias (por ejemplo, configuración de la base de datos, claves secretas, etc.). Este archivo no debe incluirse en el repositorio para mantener la seguridad.

4. **Instala las dependencias:**

   ```bash
   npm install
   ```

5. **Inicia la aplicación:**

   ```bash
   npm start
   ```

El servidor se iniciará y estará listo para recibir peticiones.

## Endpoints Principales

- **Registro de Usuario:** Permite crear un nuevo usuario.
- **Validación de Email:** Confirma el email del usuario mediante un código.
- **Login:** Permite iniciar sesión y recibir un token.
- **Onboarding y Actualización:** Permite actualizar datos personales y de la compañía.
- **Logo:** Permite subir y guardar la imagen de logo.

## Autor

**Enrique Rodriguez del Real**

## Licencia

Este proyecto se distribuye bajo la licencia **MIT**.
