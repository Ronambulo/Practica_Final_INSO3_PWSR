const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const DeliveryNoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
      required: true,
    },
    format: {
      type: String,
      enum: ["hours", "materials"],
      required: true,
      default: "hours",
    },
    hours: {
      type: Number,
      required: function () {
        return this.format === "hours";
      },
    },
    description: {
      type: String,
    },
    sign: {
      type: String, // URL o ruta de la firma (imagen)
    },
    pending: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

DeliveryNoteSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("deliverynotes", DeliveryNoteSchema);
