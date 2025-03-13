const express = require("express");
const router = express.Router();
const {
  validatorRegister,
  validatorVerfiy,
  validatorLogin,
} = require("../validators/auth");
const { register, verify, login } = require("../controllers/auth");
const { authMiddleware } = require("../middleware/auth");

router.post("/register", validatorRegister, register);
router.put("/verify", validatorVerfiy, authMiddleware, verify);
router.post("/login", validatorLogin, login);

module.exports = router;
