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

module.exports = router;
