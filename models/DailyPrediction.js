const mongoose = require("mongoose");

const dailyPredictionSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    effect: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyPrediction", dailyPredictionSchema);
