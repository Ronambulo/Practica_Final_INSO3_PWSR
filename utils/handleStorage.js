const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("file", file);
    const pathStorage = __dirname + "/../storage";
    cb(null, pathStorage);
  },
  filename: function (req, file, cb) {
    const filename = file.originalname;
    cb(null, filename);
  },
});

const maxSize = 2 * 1024 * 1024; //3kb

const uploadMiddleware = multer({
  storage,
  limits: { fileSize: maxSize },
});
const memory = multer.memoryStorage();
const uploadMiddlewareMemory = multer({
  storage: memory,
  limits: { fileSize: maxSize },
});

module.exports = { uploadMiddleware, uploadMiddlewareMemory };
