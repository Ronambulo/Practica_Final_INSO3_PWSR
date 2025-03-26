const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const {
  validatorUpdate,
  validatorUpdateCompany,
} = require("../validators/users");
const { updateItem, updateCompany } = require("../controllers/users");

router.patch("/", validatorUpdate, authMiddleware, updateItem);
router.patch("/company", validatorUpdateCompany, authMiddleware, updateCompany);

module.exports = router;
