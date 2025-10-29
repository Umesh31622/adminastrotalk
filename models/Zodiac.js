const mongoose = require("mongoose");

const zodiacSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    timeOfBirth: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    zodiacSign: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Zodiac", zodiacSchema);
