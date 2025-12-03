const Analytics = require("../models/Analytics");

// Create analytics entry
exports.createAnalytics = async (req, res) => {
  try {
    const { type, data } = req.body;
    if (!type || !data) return res.status(400).json({ success: false, message: "Type and data required" });

    const analytics = await Analytics.create({ type, data });
    res.status(201).json({ success: true, data: analytics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all analytics
exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await Analytics.find().sort({ createdAt: -1 });
    res.json({ success: true, data: analytics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single analytics by ID
exports.getAnalyticsById = async (req, res) => {
  try {
    const analytics = await Analytics.findById(req.params.id);
    if (!analytics) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: analytics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update analytics by ID
exports.updateAnalytics = async (req, res) => {
  try {
    const updated = await Analytics.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete analytics by ID
exports.deleteAnalytics = async (req, res) => {
  try {
    const deleted = await Analytics.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
