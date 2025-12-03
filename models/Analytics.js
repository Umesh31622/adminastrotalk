const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g. "revenue", "conversion", "remedy_completion"
  data: { type: mongoose.Schema.Types.Mixed }, // Flexible JSON for any analytics data
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Analytics", analyticsSchema);
