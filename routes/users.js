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
} = require("../controllers/users");
const { uploadMiddleware } = require("../utils/handleStorage");

router.patch("/", validatorUpdate, authMiddleware, updateItem);
router.patch("/company", validatorUpdateCompany, authMiddleware, updateCompany);
router.patch(
  "/logo",
  authMiddleware,
  uploadMiddleware.single("image"),
  updateLogo
);

// Soft delete
router.delete("/:id", authMiddleware, softDeleteUser);

// Hard delete
router.delete("/:id/hard", authMiddleware, hardDeleteUser);

// Restaurar usuario archivado
router.patch("/:id/restore", authMiddleware, restoreUser);

module.exports = router;
