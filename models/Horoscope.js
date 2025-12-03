const mongoose = require("mongoose");

const horoscopeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dateOfBirth: { type: String, required: true }, // store as yyyy-mm-dd
    timeOfBirth: { type: String, required: true }, // hh:mm
    placeOfBirth: { type: String, required: true },
    sunSign: { type: String },
    moonSign: { type: String },
    ascendant: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Horoscope", horoscopeSchema);
