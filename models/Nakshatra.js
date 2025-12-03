const mongoose = require("mongoose");

const nakshatraSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    timeOfBirth: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    nakshatra: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nakshatra", nakshatraSchema);
