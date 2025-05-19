const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const {
  validatorCreateDeliveryNote,
  validatorUpdateDeliveryNote,
} = require("../validators/deliveryNotes");
const {
  createDeliveryNote,
  getDeliveryNotes,
  getDeliveryNoteById,
  updateDeliveryNote,
  deleteDeliveryNote,
  hardDeleteDeliveryNote,
  getArchivedDeliveryNotes,
  restoreDeliveryNote,
} = require("../controllers/deliveryNotes");

/**
 * @swagger
 * tags:
 *   - name: Albaranes
 *     description: Endpoints para gestión de albaranes (delivery notes)
 */

/**
 * @swagger
 * /deliverynotes:
 *   get:
 *     summary: Lista todos los albaranes del usuario autenticado
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de albaranes obtenida correctamente
 *       401:
 *         description: No autorizado
 */
router.get("/", authMiddleware, getDeliveryNotes);

/**
 * @swagger
 * /deliverynotes/archived:
 *   get:
 *     summary: Lista todos los albaranes archivados (soft-deleted)
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de albaranes archivados
 *       401:
 *         description: No autorizado
 */
router.get("/archived", authMiddleware, getArchivedDeliveryNotes);

/**
 * @swagger
 * /deliverynotes/{id}:
 *   get:
 *     summary: Obtiene un albarán específico por ID
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     responses:
 *       200:
 *         description: Albarán encontrado
 *       404:
 *         description: Albarán no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:id", authMiddleware, getDeliveryNoteById);

/**
 * @swagger
 * /deliverynotes:
 *   post:
 *     summary: Crea un nuevo albarán (delivery note)
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - clientId
 *               - projectId
 *               - format
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 6661d631b3456d765e39af78
 *               clientId:
 *                 type: string
 *                 example: 6662a8c3c199795c88329e4e
 *               projectId:
 *                 type: string
 *                 example: 6662afde03013916089bc058
 *               format:
 *                 type: string
 *                 enum: [hours, materials]
 *                 example: hours
 *               hours:
 *                 type: number
 *                 example: 7
 *               description:
 *                 type: string
 *                 example: my description
 *               sign:
 *                 type: string
 *                 example: /path/to/sign3
 *               pending:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Albarán creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post(
  "/",
  authMiddleware,
  validatorCreateDeliveryNote,
  createDeliveryNote
);

/**
 * @swagger
 * /deliverynotes/{id}:
 *   put:
 *     summary: Actualiza un albarán existente
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               format:
 *                 type: string
 *                 enum: [hours, materials]
 *                 example: hours
 *               hours:
 *                 type: number
 *                 example: 8
 *               description:
 *                 type: string
 *                 example: descripción actualizada
 *               sign:
 *                 type: string
 *                 example: /path/to/sign3
 *               pending:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Albarán actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Albarán no encontrado
 */
router.put(
  "/:id",
  authMiddleware,
  validatorUpdateDeliveryNote,
  updateDeliveryNote
);

/**
 * @swagger
 * /deliverynotes/{id}:
 *   delete:
 *     summary: Archiva (soft delete) un albarán por ID
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     responses:
 *       200:
 *         description: Albarán archivado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Albarán no encontrado
 */
router.delete("/:id", authMiddleware, deleteDeliveryNote);

/**
 * @swagger
 * /deliverynotes/{id}/hard:
 *   delete:
 *     summary: Elimina físicamente (hard delete) un albarán por ID
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     responses:
 *       200:
 *         description: Albarán eliminado permanentemente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Albarán no encontrado
 */
router.delete("/:id/hard", authMiddleware, hardDeleteDeliveryNote);

/**
 * @swagger
 * /deliverynotes/{id}/restore:
 *   patch:
 *     summary: Restaura un albarán archivado (soft deleted)
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     responses:
 *       200:
 *         description: Albarán restaurado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Albarán no encontrado
 */
router.patch("/:id/restore", authMiddleware, restoreDeliveryNote);

module.exports = router;
