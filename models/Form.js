
const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  fields: [
    {
      label: { type: String, required: true },
      type: { type: String, required: true },
      required: { type: Boolean, default: false },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Form", formSchema);
