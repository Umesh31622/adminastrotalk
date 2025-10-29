// const mongoose = require("mongoose");

// const TransitSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   dateOfBirth: { type: String, required: true },
//   timeOfBirth: { type: String, required: true },
//   placeOfBirth: { type: String, required: true },
//   transitData: {
//     type: Object, // Store calculated planet positions or predictions
//     default: {},
//   },
// }, { timestamps: true });

// module.exports = mongoose.model("Transit", TransitSchema);


const mongoose = require("mongoose");

const TransitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    timeOfBirth: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    transitData: {
      sunTransit: { type: String },
      moonTransit: { type: String },
      description: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transit", TransitSchema);
