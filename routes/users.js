const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const {
  validatorUpdate,
  validatorUpdateCompany,
} = require("../validators/users");
const {
  updateItem,
  updateCompany,
  updateLogo,
  softDeleteUser,
  hardDeleteUser,
  restoreUser,
  changePassword,
  inviteUser,
} = require("../controllers/users");
const { uploadMiddleware } = require("../utils/handleStorage");

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: Endpoints para gestión de usuarios
 */

/**
 * @swagger
 * /users:
 *   patch:
 *     summary: Actualiza datos personales del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Enrique
 *               surnames:
 *                 type: string
 *                 example: Rodriguez del Real
 *     responses:
 *       200:
 *         description: Datos actualizados correctamente
 *       401:
 *         description: No autorizado
 */
router.patch("/", validatorUpdate, authMiddleware, updateItem);

/**
 * @swagger
 * /users/company:
 *   patch:
 *     summary: Actualiza los datos de la compañía del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Servitop, SL.
 *                   cif:
 *                     type: string
 *                     example: BXXXXXXXX
 *                   street:
 *                     type: string
 *                     example: Carlos V
 *                   number:
 *                     type: integer
 *                     example: 22
 *                   postal:
 *                     type: integer
 *                     example: 28936
 *                   city:
 *                     type: string
 *                     example: Móstoles
 *                   province:
 *                     type: string
 *                     example: Madrid
 *     responses:
 *       200:
 *         description: Compañía actualizada correctamente
 *       401:
 *         description: No autorizado
 */
router.patch("/company", validatorUpdateCompany, authMiddleware, updateCompany);

/**
 * @swagger
 * /users/logo:
 *   patch:
 *     summary: Actualiza el logo del usuario (requiere archivo de imagen)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Logo actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.patch(
  "/logo",
  authMiddleware,
  uploadMiddleware.single("image"),
  updateLogo
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Archiva (soft delete) un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario archivado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/:id", authMiddleware, softDeleteUser);

/**
 * @swagger
 * /users/{id}/hard:
 *   delete:
 *     summary: Elimina físicamente (hard delete) un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado permanentemente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/:id/hard", authMiddleware, hardDeleteUser);

/**
 * @swagger
 * /users/{id}/restore:
 *   patch:
 *     summary: Restaura un usuario archivado (soft deleted)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario restaurado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.patch("/:id/restore", authMiddleware, restoreUser);

/**
 * @swagger
 * /users/password:
 *   patch:
 *     summary: Cambia la contraseña del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: miPasswordAntigua
 *               newPassword:
 *                 type: string
 *                 example: miPasswordNueva
 *     responses:
 *       200:
 *         description: Contraseña cambiada correctamente
 *       400:
 *         description: Contraseña antigua incorrecta
 *       401:
 *         description: No autorizado
 */
router.patch("/password", authMiddleware, changePassword);

const { requestPasswordReset, resetPassword } = require("../controllers/auth");

/**
 * @swagger
 * /users/recover:
 *   post:
 *     summary: Solicita un código de recuperación de contraseña por email (alias de /auth/recover)
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *     responses:
 *       200:
 *         description: Código de recuperación enviado al correo
 *       404:
 *         description: Usuario no encontrado
 */
router.post("/recover", requestPasswordReset);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Cambia la contraseña usando el código recibido por email (alias de /auth/reset-password)
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               code:
 *                 type: string
 *                 example: 123456
 *               newPassword:
 *                 type: string
 *                 example: nuevaPassword123
 *     responses:
 *       200:
 *         description: Contraseña cambiada correctamente
 *       400:
 *         description: Código inválido o expirado
 *       404:
 *         description: Usuario no encontrado
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /users/invite:
 *   post:
 *     summary: Invita a un usuario a la compañía del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - surnames
 *             properties:
 *               email:
 *                 type: string
 *                 example: nuevo_usuario@email.com
 *               name:
 *                 type: string
 *                 example: NombreNuevo
 *               surnames:
 *                 type: string
 *                 example: ApellidoNuevo
 *     responses:
 *       201:
 *         description: Invitación enviada correctamente
 *       409:
 *         description: El usuario ya existe
 *       401:
 *         description: No autorizado
 */
router.post("/invite", authMiddleware, inviteUser);

module.exports = router;
