const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: { type: String }, // Encriptada

    name: { type: String },
    surnames: { type: String },
    nif: { type: String },

    verificationCode: { type: Number }, // Código de verificación
    verificationAttempts: { type: Number, default: 3 }, // Intentos de verificación
    verified: { type: Boolean, default: false }, // Verificado o no

    role: {
      type: ["admin", "user", "guest"], // Enumerado
      default: "user",
    },
  },
  {
    timeStamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("users", UserSchema);
