const express = require("express");
const router = express.Router();

const Client = require("../models/Client");
const Order = require("../models/Order");
const Report = require("../models/Report");
const Remedy = require("../models/Remedy");

// 🔍 Global Search API
router.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ success: false, message: "Query is required" });
    }

    const searchRegex = new RegExp(query, "i");

    const [clients, orders, reports, remedies] = await Promise.all([
      Client.find({
        $or: [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }],
      }).limit(10),

      Order.find({
        $or: [{ orderId: searchRegex }, { clientName: searchRegex }],
      }).limit(10),

      Report.find({
        $or: [{ clientName: searchRegex }, { reportType: searchRegex }],
      }).limit(10),

      Remedy.find({
        $or: [{ clientName: searchRegex }, { remedyType: searchRegex }],
      }).limit(10),
    ]);

    return res.json({
      success: true,
      data: { clients, orders, reports, remedies },
    });
  } catch (error) {
    console.error("🔴 Search Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
