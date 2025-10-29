const mongoose = require("mongoose");

const DashaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    timeOfBirth: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    dashaData: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dasha", DashaSchema);
