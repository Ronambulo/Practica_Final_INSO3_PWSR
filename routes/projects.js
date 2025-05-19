const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const {
  validatorCreateProject,
  validatorUpdateProject,
} = require("../validators/projects");
const {
  createProject,
  updateProject,
  getProjects,
  getProjectById,
  deleteProject,
  hardDeleteProject,
  getArchivedProjects,
  restoreProject,
} = require("../controllers/projects");

/**
 * @swagger
 * tags:
 *   - name: Proyectos
 *     description: Endpoints para gestión de proyectos
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Lista todos los proyectos del usuario autenticado
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos obtenida correctamente
 *       401:
 *         description: No autorizado
 */
router.get("/", authMiddleware, getProjects);

/**
 * @swagger
 * /projects/archived:
 *   get:
 *     summary: Lista todos los proyectos archivados (soft-deleted)
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos archivados
 *       401:
 *         description: No autorizado
 */
router.get("/archived", authMiddleware, getArchivedProjects);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Obtiene un proyecto específico por ID
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *       404:
 *         description: Proyecto no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:id", authMiddleware, getProjectById);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Crea un nuevo proyecto asociado al usuario y cliente
 *     tags: [Proyectos]
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
 *               - projectCode
 *               - clientId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Obra Y
 *               projectCode:
 *                 type: string
 *                 example: Id-proyect
 *               code:
 *                 type: string
 *                 example: 0002
 *               clientId:
 *                 type: string
 *                 example: 6662a8c3c199795c88329e4e
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: Carlos II
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
 *               begin:
 *                 type: string
 *                 example: 07-01-2024
 *               end:
 *                 type: string
 *                 example: 06-04-2025
 *               notes:
 *                 type: string
 *                 example: no acabado
 *     responses:
 *       201:
 *         description: Proyecto creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/", authMiddleware, validatorCreateProject, createProject);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Actualiza un proyecto existente
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Obra Y actualizada
 *               notes:
 *                 type: string
 *                 example: actualizado
 *     responses:
 *       200:
 *         description: Proyecto actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no encontrado
 */
router.put("/:id", authMiddleware, validatorUpdateProject, updateProject);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Archiva (soft delete) un proyecto por ID
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto archivado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no encontrado
 */
router.delete("/:id", authMiddleware, deleteProject);

/**
 * @swagger
 * /projects/{id}/hard:
 *   delete:
 *     summary: Elimina físicamente (hard delete) un proyecto por ID
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto eliminado permanentemente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no encontrado
 */
router.delete("/:id/hard", authMiddleware, hardDeleteProject);

/**
 * @swagger
 * /projects/{id}/restore:
 *   patch:
 *     summary: Restaura un proyecto archivado (soft deleted)
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto restaurado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no encontrado
 */
router.patch("/:id/restore", authMiddleware, restoreProject);

module.exports = router;
