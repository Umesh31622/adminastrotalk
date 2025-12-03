const DeviceLog = require("../models/DeviceLog");

exports.getDevices = async (req, res) => {
  try {
    const logs = await DeviceLog.find({ userId: req.user.id }).sort({ time: -1 });
    res.json({ success: true, logs });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// call this on login success
exports.addDeviceLog = async (req, userId) => {
  try {
    await DeviceLog.create({
      userId,
      device: req.headers["user-agent"],
      ip: req.ip
    });
  } catch (e) {
    console.log("Device log error:", e);
  }
};
