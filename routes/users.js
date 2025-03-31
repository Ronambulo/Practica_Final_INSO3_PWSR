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

module.exports = router;
