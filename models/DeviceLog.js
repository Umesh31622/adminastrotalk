const mongoose = require("mongoose");

const deviceLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  device: String,
  ip: String,
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DeviceLog", deviceLogSchema);
