const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  uploaderName: { type: String, required: true },
  fileName: { type: String, required: true },
  originalName: { type: String },
  status: { type: String, enum: ["Pending", "InProgress", "Completed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Upload", uploadSchema);
