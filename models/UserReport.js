const mongoose = require("mongoose");

const userReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  title: { type: String, required: true },
  type: { type: String, default: "kundli" },  // kundli | numerology | planetary etc.

  fileUrl: { type: String },   // PDF / IMAGE / TEXT URL
  description: String,

  adminReportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserReport", userReportSchema);
