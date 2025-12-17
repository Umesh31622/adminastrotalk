const Activity = require("../models/ActivityLog");

exports.getActivity = async (req, res) => {
  try {
    const logs = await Activity.find({ userId: req.user.id }).sort({ time: -1 });
    res.json({ success: true, logs });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// call this whenever user does something important
exports.addActivity = async (userId, action) => {
  try {
    await Activity.create({ userId, action });
  } catch (e) {
    console.log("Activity error:", e);
  }
};
