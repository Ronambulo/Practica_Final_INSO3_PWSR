// validators/clients.js
const { check } = require("express-validator");
const handleValidator = require("../utils/handleValidator");

/**
 * Validador para creación de cliente
 */
const validatorCreateClient = [
  check("name").exists().withMessage("Name is required").notEmpty(),
  check("cif").exists().withMessage("CIF is required").notEmpty(),
  check("address.street").exists().withMessage("Street is required").notEmpty(),
  check("address.number").exists().withMessage("Number is required").isInt(),
  check("address.postal")
    .exists()
    .withMessage("Postal code is required")
    .isInt(),
  check("address.city").exists().withMessage("City is required").notEmpty(),
  check("address.province")
    .exists()
    .withMessage("Province is required")
    .notEmpty(),
  (req, res, next) => handleValidator(req, res, next),
];

/**
 * Validador para actualización de cliente
 */
const validatorUpdateClient = [
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Name cannot be empty if provided"),
  check("cif")
    .optional()
    .notEmpty()
    .withMessage("CIF cannot be empty if provided"),
  check("address.street")
    .optional()
    .notEmpty()
    .withMessage("Street cannot be empty if provided"),
  check("address.number")
    .optional()
    .isInt()
    .withMessage("Number must be an integer if provided"),
  check("address.postal")
    .optional()
    .isInt()
    .withMessage("Postal code must be an integer if provided"),
  check("address.city")
    .optional()
    .notEmpty()
    .withMessage("City cannot be empty if provided"),
  check("address.province")
    .optional()
    .notEmpty()
    .withMessage("Province cannot be empty if provided"),
  (req, res, next) => handleValidator(req, res, next),
];

module.exports = {
  validatorCreateClient,
  validatorUpdateClient,
};
