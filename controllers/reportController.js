
const mongoose = require("mongoose");
const Report = require("../models/Report");
const Client = require("../models/Client");
const Astrologer = require("../models/Astrologer");

// Helper: emit socket updates
const emitReportUpdate = (req) => {
  try {
    const io = req.app?.get("io");
    if (io) io.emit("reportUpdate", { time: new Date().toISOString() });
  } catch (err) {
    console.warn("Socket emit failed:", err.message);
  }
};

// ---------------- CREATE REPORT ----------------
exports.createReport = async (req, res) => {
  try {
    const {
      title,
      service,
      revenue,
      status,
      clientId,
      astrologerId,
      clientName,
      astrologerName,
      completedAt,
      data,
    } = req.body;

    if (!title) return res.status(400).json({ success: false, message: "Title is required" });

    // Auto-fill names from IDs if not provided
    let finalClientName = clientName;
    let finalAstrologerName = astrologerName;

    if (clientId && !clientName) {
      const client = await Client.findById(clientId);
      finalClientName = client?.name || "";
    }
    if (astrologerId && !astrologerName) {
      const astrologer = await Astrologer.findById(astrologerId);
      finalAstrologerName = astrologer?.name || "";
    }

    const report = await Report.create({
      title,
      reportType: service || "consultation",
      revenue: revenue || 0,
      status: status || "pending",
      clientId: clientId || null,
      astrologerId: astrologerId || null,
      clientName: finalClientName,
      astrologerName: finalAstrologerName,
      completedAt: completedAt ? new Date(completedAt) : null,
      data: data || {},
      createdBy: req.user?._id || null,
    });

    emitReportUpdate(req);
    res.status(201).json({ success: true, data: report });
  } catch (err) {
    console.error("Create Report Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- GET REPORTS ----------------
exports.getReports = async (req, res) => {
  try {
    const { service, date } = req.query;
    const filter = {};
    if (service) filter.reportType = service;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.completedAt = { $gte: start, $lte: end };
    }

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reports });
  } catch (err) {
    console.error("Get Reports Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- GET SINGLE REPORT ----------------
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    res.json({ success: true, data: report });
  } catch (err) {
    console.error("Get Report Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- UPDATE REPORT ----------------
exports.updateReport = async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.completedAt === "") update.completedAt = null;
    if (update.completedAt) update.completedAt = new Date(update.completedAt);

    // Auto-fill names if IDs provided
    if (update.clientId && !update.clientName) {
      const client = await Client.findById(update.clientId);
      update.clientName = client?.name || "";
    }
    if (update.astrologerId && !update.astrologerName) {
      const astrologer = await Astrologer.findById(update.astrologerId);
      update.astrologerName = astrologer?.name || "";
    }

    const updated = await Report.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Report not found" });

    emitReportUpdate(req);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Update Report Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- DELETE REPORT ----------------
exports.deleteReport = async (req, res) => {
  try {
    const deleted = await Report.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Report not found" });

    emitReportUpdate(req);
    res.json({ success: true, message: "Report deleted" });
  } catch (err) {
    console.error("Delete Report Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- ANALYTICS ----------------
exports.revenueByService = async (req, res) => {
  try {
    const revenue = await Report.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$reportType", totalRevenue: { $sum: "$revenue" } } },
      { $sort: { totalRevenue: -1 } },
    ]);
    res.json({ success: true, data: revenue });
  } catch (err) {
    console.error("Revenue By Service Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.topServices = async (req, res) => {
  try {
    const top = await Report.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$reportType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    res.json({ success: true, data: top });
  } catch (err) {
    console.error("Top Services Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remedyCompletionRate = async (req, res) => {
  try {
    const total = await Report.countDocuments();
    const completed = await Report.countDocuments({ status: "completed" });
    const rate = total ? Math.round((completed / total) * 100) : 0;
    res.json({ success: true, data: { total, completed, rate } });
  } catch (err) {
    console.error("Remedy Completion Rate Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.callSuccessRate = async (req, res) => {
  try {
    const total = await Report.countDocuments();
    const successful = await Report.countDocuments({ status: "completed" });
    const rate = total ? Math.round((successful / total) * 100) : 0;
    res.json({ success: true, data: { total, successful, rate } });
  } catch (err) {
    console.error("Call Success Rate Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
