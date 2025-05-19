const express = require("express");
const router = express.Router();
const fs = require("fs");
const removeExtension = (fileName) => {
  return fileName.split(".").shift();
};

fs.readdirSync(__dirname).filter((file) => {
  const name = removeExtension(file);
  if (name !== "index") {
    router.use(`/${name}`, require(`./${name}`));
  }
});

// Ruta de prueba para forzar un error 500
router.get("/test-error", (req, res, next) => {
  // Crea un error y lánzalo
  const err = new Error("Esto es un error de prueba 500!");
  err.status = 500;
  next(err);
});

module.exports = router;
