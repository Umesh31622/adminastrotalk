const mongoose = require("mongoose");

const EnergyServiceSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  short: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  tag: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("EnergyService", EnergyServiceSchema);
