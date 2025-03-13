const { check } = require("express-validator");
const handleValidator = require("../utils/handleValidator");

const validatorRegister = [
  check("email").exists().isEmail().withMessage("Email is required"),
  check("password")
    .exists()
    .isLength({ min: 8 })
    .withMessage("Password is required"),
  (req, res, next) => {
    return handleValidator(req, res, next);
  },
];

const validatorVerfiy = [
  check("code")
    .exists()
    .isLength({ min: 6 })
    .withMessage("Verification code is required"),
  (req, res, next) => {
    return handleValidator(req, res, next);
  },
];

const validatorLogin = [
  check("email").exists().isEmail().withMessage("Email is required"),
  check("password")
    .exists()
    .isLength({ min: 8 })
    .withMessage("Password is required"),
  (req, res, next) => {
    return handleValidator(req, res, next);
  },
];

module.exports = { validatorRegister, validatorVerfiy, validatorLogin };
