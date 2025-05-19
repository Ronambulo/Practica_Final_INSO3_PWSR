const { check } = require("express-validator");

const validatorCreateProject = [
  check("name").notEmpty(),
  check("projectCode").notEmpty(),
  check("clientId").isMongoId(),
  // ...otros checks si quieres
];

const validatorUpdateProject = [
  check("name").optional(),
  check("projectCode").optional(),
  check("clientId").optional().isMongoId(),
  // ...otros checks si quieres
];

module.exports = { validatorCreateProject, validatorUpdateProject };
