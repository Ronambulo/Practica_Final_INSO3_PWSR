const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

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

    company: {
      name: { type: String },
      cif: { type: String },
      street: { type: String },
      number: { type: Number },
      postal: { type: Number },
      city: { type: String },
      province: { type: String },
    },
  },
  {
    timeStamps: true,
    versionKey: false,
  }
);

UserSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("users", UserSchema);
