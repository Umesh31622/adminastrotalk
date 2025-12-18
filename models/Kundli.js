
const mongoose = require("mongoose");

const KundliSchema = new mongoose.Schema(
  {
    name: String,
    dateOfBirth: String,
    timeOfBirth: String,
    placeOfBirth: String,
    kundliData: {
      type: Object, 
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Kundli", KundliSchema);

