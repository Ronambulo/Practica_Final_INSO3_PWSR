const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { validatorUpdate } = require("../validators/users");
const { updateItem } = require("../controllers/users");

router.patch("/", validatorUpdate, authMiddleware, updateItem);

module.exports = router;
