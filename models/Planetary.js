const mongoose = require("mongoose");

const planetarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    timeOfBirth: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    planets: {
      Sun: String,
      Moon: String,
      Mars: String,
      Mercury: String,
      Jupiter: String,
      Venus: String,
      Saturn: String,
      Rahu: String,
      Ketu: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Planetary", planetarySchema);

