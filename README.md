# 🚀 Práctica Intermedia INSO3 PWSR

Este proyecto es una aplicación backend desarrollada en **Node.js** con **Express** 🛠️ para gestionar usuarios. Permite registro, validación de email, inicio de sesión, actualización de datos y gestión de imágenes de perfil.

---

## 📌 Descripción

La API permite:  
✅ **Registro de usuarios** con validaciones.  
✅ **Validación del email** a través de un código.  
✅ **Inicio de sesión** con token de autenticación.  
✅ **Actualización de datos personales** y de la compañía.  
✅ **Subida de imágenes** para el logo del usuario.

---

## 📥 Instalación y Uso

### 1️⃣ **Clona el repositorio**

```bash
git clone https://github.com/Ronambulo/Practica_Intermedia_INSO3_PWSR.git
```

### 2️⃣ **Accede al directorio del proyecto**

```bash
cd Practica_Intermedia_INSO3_PWSR
```

### 3️⃣ **Crea tu archivo `.env`** ⚠️

Debes crear un archivo `.env` con las variables de entorno necesarias, como la configuración de la base de datos y claves secretas.  
**Ejemplo (`.env`):**

```
PORT=5000
NODE_ENV='production'
DB_URI=
DB_URI_TEST=
PUBLIC_URL='http://localhost:5000'
PINATA_GATEWAY_URL=
PINATA_KEY=
PINATA_SECRET=
PINATA_JWT=
JWT_SECRET=

EMAIL=
REFRESH_TOKEN=
CLIENT_SECRET=
CLIENT_ID=
REDIRECT_URI=

SLACK_WEBHOOK_URL=
```

🔒 **No compartas este archivo ni lo subas al repositorio.**

### 4️⃣ **Instala las dependencias** 📦

```bash
npm install
```

### 5️⃣ **Inicia la aplicación** ▶️

```bash
npm start
```

El servidor se ejecutará y estará listo para recibir peticiones. 🚀

---

## 👤 Autor

📝 **Enrique Rodriguez del Real**

---

## 📜 Licencia

Este proyecto está bajo la licencia **MIT** 📄.
