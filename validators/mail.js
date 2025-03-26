const { check } = require("express-validator");
const handleValidator = require("../utils/handleValidator");

const validatorMail = [
  check("subject").exists().notEmpty(),
  check("text").exists().notEmpty(),
  check("to").exists().notEmpty(),
  check("from").exists().notEmpty(),
  (req, res, next) => {
    return handleValidator(req, res, next);
  },
];
module.exports = { validatorMail };
