const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { sendItem } = require("../controllers/mail");
const { validatorMail } = require("../validators/mail");

/**
 * @swagger
 * tags:
 *   - name: Correo
 *     description: Endpoints para envío de emails
 */

/**
 * @swagger
 * /mail:
 *   post:
 *     summary: Envía un email (requiere autenticación)
 *     tags: [Correo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *               - text
 *             properties:
 *               to:
 *                 type: string
 *                 example: destinatario@email.com
 *               subject:
 *                 type: string
 *                 example: Asunto del correo
 *               text:
 *                 type: string
 *                 example: Contenido del mensaje a enviar
 *               from:
 *                 type: string
 *                 example: origen@email.com
 *     responses:
 *       200:
 *         description: Email enviado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/", authMiddleware, validatorMail, sendItem);

module.exports = router;
