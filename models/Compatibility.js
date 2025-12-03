// const mongoose = require("mongoose");

// const CompatibilitySchema = new mongoose.Schema({
//   boyName: { type: String, required: true },
//   boyDob: { type: String, required: true },
//   boyTob: { type: String, required: true },
//   boyPlace: { type: String, required: true },       // ✅ Added
//   girlName: { type: String, required: true },
//   girlDob: { type: String, required: true },
//   girlTob: { type: String, required: true },
//   girlPlace: { type: String, required: true },     // ✅ Added
//   score: Number,
//   message: String,
// }, { timestamps: true });

// module.exports = mongoose.model("Compatibility", CompatibilitySchema);

const mongoose = require("mongoose");

const CompatibilitySchema = new mongoose.Schema(
  {
    boyName: { type: String, required: true },
    boyDob: { type: String, required: true },
    boyTob: { type: String, required: true },
    boyPlace: { type: String, required: true },

    girlName: { type: String, required: true },
    girlDob: { type: String, required: true },
    girlTob: { type: String, required: true },
    girlPlace: { type: String, required: true },

    score: { type: Number, default: 0 },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Compatibility", CompatibilitySchema);
