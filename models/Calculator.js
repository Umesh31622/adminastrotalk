
const mongoose = require("mongoose");

const InputSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["text", "number", "date", "time"], default: "text" },
});

const CalculatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, unique: true }, // e.g., kundli, numerology
    description: { type: String },
    inputs: [InputSchema],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Calculator", CalculatorSchema);

