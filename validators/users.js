const { check } = require("express-validator");
const handleValidator = require("../utils/handleValidator");

const validatorUpdate = [
  check("name").optional().isString().withMessage("Name has to be a string"),
  check("surnames")
    .optional()
    .isString()
    .withMessage("Surnames has to be a string"),
  check("nif").optional().isString().withMessage("NIF has to be a string"),
  (req, res, next) => {
    return handleValidator(req, res, next);
  },
];

module.exports = { validatorUpdate };
