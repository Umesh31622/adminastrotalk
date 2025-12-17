
// const mongoose = require("mongoose");

// const kundliSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     dateOfBirth: { type: String, required: true }, // YYYY-MM-DD
//     timeOfBirth: { type: String, required: true }, // HH:mm
//     placeOfBirth: { type: String, required: true },
//     // Store results (mock or real API response)
//     zodiac: { type: String },
//     lagna: { type: String },
//     moonSign: { type: String },
//     nakshatra: { type: String },
//     result: { type: Object }, // full response / details
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Kundli", kundliSchema);

const mongoose = require("mongoose");

const KundliSchema = new mongoose.Schema(
  {
    name: String,
    dateOfBirth: String,
    timeOfBirth: String,
    placeOfBirth: String,
    kundliData: {
<<<<<<< HEAD
      type: Object, 
=======
      type: Object, // store calculated kundli details (planets, zodiac etc.)
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Kundli", KundliSchema);
