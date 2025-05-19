const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    projectCode: { type: String, required: true },
    code: { type: String },
    address: {
      street: String,
      number: Number,
      postal: Number,
      city: String,
      province: String,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clients",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    begin: String, // O Date si quieres fechas reales
    end: String,
    notes: String,
  },
  { timestamps: true }
);

ProjectSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("Projects", ProjectSchema);
