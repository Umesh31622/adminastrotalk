// const mongoose = require("mongoose");

// const PanchangSchema = new mongoose.Schema({
//   date: { type: String, required: true },
//   sunrise: { type: String, required: true },
//   sunset: { type: String, required: true },
//   tithi: { type: String, required: true },
//   nakshatra: { type: String, required: true },
//   yoga: { type: String },
//   karana: { type: String },
//   location: { type: String, required: true },
// }, { timestamps: true });

// module.exports = mongoose.model("Panchang", PanchangSchema);

const mongoose = require("mongoose");

const PanchangSchema = new mongoose.Schema({
  city: { type: String, required: true },
  date: { type: String, required: true },
  data: { type: Object }, // Panchang data from Prokerala
}, { timestamps: true });

module.exports = mongoose.model("Panchang", PanchangSchema);
