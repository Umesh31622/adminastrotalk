// const mongoose = require("mongoose");

// const manglikSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     dateOfBirth: { type: String, required: true },
//     timeOfBirth: { type: String, required: true },
//     placeOfBirth: { type: String, required: true },
//     isManglik: Boolean,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Manglik", manglikSchema);
const mongoose = require("mongoose");

const manglikSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    timeOfBirth: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    isManglik: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Manglik", manglikSchema);
