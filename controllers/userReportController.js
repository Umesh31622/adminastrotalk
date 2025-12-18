




const UserReport = require("../models/UserReport");

// ➕ Add User Report
exports.addUserReport = async (req, res) => {
  try {
    const { userId, title, reportType, data } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const report = await UserReport.create({
      userId,
      title,
      reportType: reportType || "general",
      data: data || {},
      createdAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Report saved",
      report,
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 📄 Get Reports for a User
exports.getUserReports = async (req, res) => {
  try {
    const { userId } = req.params;

    const reports = await UserReport.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reports,
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ❌ Delete a Report
exports.deleteUserReport = async (req, res) => {
  try {
    await UserReport.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Report deleted"
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
