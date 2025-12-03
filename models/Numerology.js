const mongoose = require("mongoose");

const NumerologySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    lifePathNumber: { type: Number },
    destinyNumber: { type: Number },
    soulUrgeNumber: { type: Number },
    personalityNumber: { type: Number },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Numerology", NumerologySchema);
