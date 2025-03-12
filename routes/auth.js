const express = require("express");
const router = express.Router();
const { validatorRegister } = require("../validators/auth");
const { register } = require("../controllers/auth");

router.post("/register", validatorRegister, register);

module.exports = router;
