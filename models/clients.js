const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    cif: { type: String, required: true, unique: true },

    address: {
      street: { type: String, required: true },
      number: { type: Number, required: true },
      postal: { type: Number, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
    },
    logo: { type: String },
    activeProjects: { type: Number, default: 0 },
    pendingDeliveryNotes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

clientSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("clients", clientSchema);
