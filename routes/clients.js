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

// Rutas para clients
router.get("/", authMiddleware, getClients);
router.get("/archived", authMiddleware, getArchivedClients);
router.get("/:id", authMiddleware, getClientById);
router.post("/", authMiddleware, validatorCreateClient, createClient);
router.put("/:id", authMiddleware, validatorUpdateClient, updateClient);

// Soft delete
router.delete("/:id", authMiddleware, deleteClient);

// Hard delete (borrado físico)
router.delete("/:id/hard", authMiddleware, hardDeleteClient);

// Restaurar cliente soft deleted
router.patch("/:id/restore", authMiddleware, restoreClient);

module.exports = router;
