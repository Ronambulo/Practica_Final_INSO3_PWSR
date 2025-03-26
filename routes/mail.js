const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { sendItem } = require("../controllers/mail");
const { validatorMail } = require("../validators/mail");

router.post("/", authMiddleware, validatorMail, sendItem);

module.exports = router;
