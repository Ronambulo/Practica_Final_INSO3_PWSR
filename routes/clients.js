const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const {
  validatorCreateClient,
  validatorUpdateClient,
} = require("../validators/clients");
const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  hardDeleteClient,
  getArchivedClients,
  restoreClient,
} = require("../controllers/clients");

/**
 * @swagger
 * tags:
 *   - name: Clientes
 *     description: Endpoints para gestión de clientes
 */

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Lista todos los clientes del usuario autenticado
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida correctamente
 *       401:
 *         description: No autorizado
 */
router.get("/", authMiddleware, getClients);

/**
 * @swagger
 * /clients/archived:
 *   get:
 *     summary: Lista todos los clientes archivados (soft-deleted)
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes archivados
 *       401:
 *         description: No autorizado
 */
router.get("/archived", authMiddleware, getArchivedClients);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Obtiene un cliente específico por ID
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:id", authMiddleware, getClientById);

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Crea un nuevo cliente asociado al usuario autenticado
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - cif
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: ACME Servicios S.A.
 *               cif:
 *                 type: string
 *                 example: A12345678
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: Calle Falsa
 *                   number:
 *                     type: integer
 *                     example: 123
 *                   postal:
 *                     type: integer
 *                     example: 28080
 *                   city:
 *                     type: string
 *                     example: Madrid
 *                   province:
 *                     type: string
 *                     example: Madrid
 *               logo:
 *                 type: string
 *                 example: https://example.com/logo.png
 *     responses:
 *       201:
 *         description: Cliente creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/", authMiddleware, validatorCreateClient, createClient);

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Actualiza un cliente existente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: ACME Servicios y Soluciones S.L.
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: Calle Verdadera
 *                   number:
 *                     type: integer
 *                     example: 456
 *                   postal:
 *                     type: integer
 *                     example: 28081
 *                   city:
 *                     type: string
 *                     example: Madrid
 *                   province:
 *                     type: string
 *                     example: Madrid
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cliente no encontrado
 */
router.put("/:id", authMiddleware, validatorUpdateClient, updateClient);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Archiva (soft delete) un cliente por ID
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente archivado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cliente no encontrado
 */
router.delete("/:id", authMiddleware, deleteClient);

/**
 * @swagger
 * /clients/{id}/hard:
 *   delete:
 *     summary: Elimina físicamente (hard delete) un cliente por ID
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado permanentemente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cliente no encontrado
 */
router.delete("/:id/hard", authMiddleware, hardDeleteClient);

/**
 * @swagger
 * /clients/{id}/restore:
 *   patch:
 *     summary: Restaura un cliente archivado (soft deleted)
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente restaurado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cliente no encontrado
 */
router.patch("/:id/restore", authMiddleware, restoreClient);

module.exports = router;
