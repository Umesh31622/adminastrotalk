const express = require("express");
const router = express.Router();
const AdminNotification = require("../models/AdminNotification");

router.post("/", async (req, res) => {
  try {
    const { type, message, userName, userPhone } = req.body;

    if (!type || !message || !userName || !userPhone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const notification = await AdminNotification.create({
      type,
      message,
      userName,
      userPhone,
      read: false,
    });

    // 🔔 Realtime socket emit (optional but recommended)
    const io = req.app.get("io");
    if (io) {
      io.emit("adminNotification", notification);
    }

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (err) {
    console.error("Create notification error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ======================================================
   READ ALL NOTIFICATIONS
   GET /api/admin-notifications
====================================================== */
router.get("/", async (req, res) => {
  try {
    const notifications = await AdminNotification.find()
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ======================================================
   READ SINGLE NOTIFICATION
   GET /api/admin-notifications/:id
====================================================== */
router.get("/:id", async (req, res) => {
  try {
    const notification = await AdminNotification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json(notification);
  } catch (err) {
    console.error("Fetch single notification error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ======================================================
   UPDATE NOTIFICATION
   PUT /api/admin-notifications/:id
====================================================== */
router.put("/:id", async (req, res) => {
  try {
    const updated = await AdminNotification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error("Update notification error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ======================================================
   MARK AS READ
   PUT /api/admin-notifications/:id/read
====================================================== */
router.put("/:id/read", async (req, res) => {
  try {
    const updated = await AdminNotification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ======================================================
   DELETE NOTIFICATION
   DELETE /api/admin-notifications/:id
====================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await AdminNotification.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (err) {
    console.error("Delete notification error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
