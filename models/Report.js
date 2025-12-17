
const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    astrologerId: { type: mongoose.Schema.Types.ObjectId, ref: "Astrologer" },
    clientName: { type: String },       // store client name
    astrologerName: { type: String },   // store astrologer name
    reportType: {
      type: String,
      enum: ["remedy", "consultation", "analysis", "custom"],
      default: "consultation",
    },
    revenue: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "follow-up"],
      default: "pending",
    },
    completedAt: { type: Date },
    data: { type: Object, default: {} },
    summary: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
