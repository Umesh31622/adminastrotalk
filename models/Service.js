const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    media: [String],
    price: Number,
    timeline: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
