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

validatorUpdateCompany = [
  check("company.name")
    .optional()
    .isString()
    .withMessage("Company name has to be a string"),
  check("company.cif")
    .optional()
    .isString()
    .withMessage("Company CIF has to be a string"),
  check("company.street")
    .optional()
    .isString()
    .withMessage("Company street has to be a string"),
  check("company.number")
    .optional()
    .isNumeric()
    .withMessage("Company number has to be a number"),
  check("company.postal")
    .optional()
    .isNumeric()
    .withMessage("Company postal code has to be a number"),
  check("company.city")
    .optional()
    .isString()
    .withMessage("Company city has to be a string"),
  check("company.province")
    .optional()
    .isString()
    .withMessage("Company province has to be a string"),
  (req, res, next) => {
    return handleValidator(req, res, next);
  },
];

module.exports = { validatorUpdate, validatorUpdateCompany };
