

// const mongoose = require("mongoose");

// const PanchangSchema = new mongoose.Schema({
//   city: { type: String, required: true },
//   date: { type: String, required: true },
//   data: { type: Object }, // Panchang data from Prokerala
// }, { timestamps: true });

// module.exports = mongoose.model("Panchang", PanchangSchema);

const mongoose = require("mongoose");

const PanchangSchema = new mongoose.Schema({
  city: String,
  date: String,
  sunrise: String,
  sunset: String,
  weekday: String,
  tithi: String,
  tithi_period: String,
  nakshatra: String,
  nakshatra_period: String,
  yoga: String,
  yoga_period: String,
  karana: String,
  karana_period: String,
  moonrise: String,
  moonset: String,
  fasting: String,
});

module.exports = mongoose.model("Panchang", PanchangSchema);
