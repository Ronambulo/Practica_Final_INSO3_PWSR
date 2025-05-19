const express = require("express");
const router = express.Router();
const {
  validatorRegister,
  validatorVerfiy,
  validatorLogin,
} = require("../validators/auth");
const {
  register,
  verify,
  login,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/auth");
const { authMiddleware } = require("../middleware/auth");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: miPassword123
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/register", validatorRegister, register);

/**
 * @swagger
 * /auth/verify:
 *   put:
 *     summary: Verifica el correo del usuario con un código enviado por email
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Usuario verificado correctamente
 *       400:
 *         description: Código inválido
 *       401:
 *         description: No autorizado
 */
router.put("/verify", validatorVerfiy, authMiddleware, verify);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión en la aplicación y devuelve un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: miPassword123
 *     responses:
 *       200:
 *         description: Login correcto
 *       400:
 *         description: Credenciales incorrectas
 */
router.post("/login", validatorLogin, login);

/**
 * @swagger
 * /auth/recover:
 *   post:
 *     summary: Solicita un código de recuperación de contraseña por email
 *     tags: [Auth]
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
 * /auth/reset-password:
 *   post:
 *     summary: Cambia la contraseña usando el código recibido por email
 *     tags: [Auth]
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

module.exports = router;
