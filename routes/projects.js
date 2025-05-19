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

// CRUD
router.get("/", authMiddleware, getProjects);
router.get("/archived", authMiddleware, getArchivedProjects);
router.get("/:id", authMiddleware, getProjectById);
router.post("/", authMiddleware, validatorCreateProject, createProject);
router.put("/:id", authMiddleware, validatorUpdateProject, updateProject);

// Soft delete
router.delete("/:id", authMiddleware, deleteProject);
// Hard delete
router.delete("/:id/hard", authMiddleware, hardDeleteProject);
// Restaurar
router.patch("/:id/restore", authMiddleware, restoreProject);

module.exports = router;
