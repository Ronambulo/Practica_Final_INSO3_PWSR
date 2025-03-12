const { validationResult } = require("express-validator");

const handleValidator = (req, res, next) => {
  try {
    validationResult(req).throw();
    next();
  } catch (err) {
    res.status(403).json({ error: err.array() });
  }
};
module.exports = handleValidator;
