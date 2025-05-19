const { check } = require("express-validator");

const validatorCreateDeliveryNote = [
  check("userId").isMongoId().withMessage("userId inválido"),
  check("clientId").isMongoId().withMessage("clientId inválido"),
  check("projectId").isMongoId().withMessage("projectId inválido"),
  check("format").isIn(["hours", "materials"]).withMessage("Formato inválido"),
  check("hours").optional().isNumeric().withMessage("hours debe ser numérico"),
  check("description").optional().isString(),
  check("sign").optional().isString(),
  check("pending").optional().isBoolean(),
];

const validatorUpdateDeliveryNote = [
  check("format").optional().isIn(["hours", "materials"]),
  check("hours").optional().isNumeric(),
  check("description").optional().isString(),
  check("sign").optional().isString(),
  check("pending").optional().isBoolean(),
];

module.exports = {
  validatorCreateDeliveryNote,
  validatorUpdateDeliveryNote,
};
