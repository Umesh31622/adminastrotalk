

const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const Remedy = require("../models/Remedy");
const Consultation = require("../models/Consultation");
const Service = require("../models/Service");

router.get("/", async (req, res) => {
  try {
    const [reports, remedies, consultations, services] = await Promise.all([
      Report.find(),
      Remedy.find(),
      Consultation.find(),
      Service.find(),
    ]);

    
    const activeOrders = reports.filter((r) => r.status !== "completed").length;
    const completedOrders = reports.filter((r) => r.status === "completed").length;
    const pendingUploads = reports.filter((r) => r.status === "pending").length;
    const remediesInProgress = remedies.filter((r) => r.status === "Pending").length;

    const serviceCounts = reports.reduce((acc, r) => {
      acc[r.reportType] = (acc[r.reportType] || 0) + 1;
      return acc;
    }, {});
    const topServices = Object.keys(serviceCounts).slice(0, 3);

    const activeClients = [
      ...new Set([
        ...reports.map((r) => r.clientName).filter(Boolean),
        ...consultations.map((c) => c.clientName).filter(Boolean),
      ]),
    ].slice(0, 5);

    const totalRevenue = reports.reduce((sum, r) => sum + (r.revenue || 0), 0);
    const revenue = {
      daily: Math.floor(totalRevenue / 30),
      weekly: Math.floor(totalRevenue / 4),
      monthly: totalRevenue,
    };

    res.json({
      success: true,
      stats: {
        activeOrders,
        completedOrders,
        pendingUploads,
        remediesInProgress,
        topServices,
        activeClients,
        revenue,
      },
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/revenue-trend", async (req, res) => {
  try {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 6);

    const reports = await Report.find({
      completedAt: { $gte: weekAgo, $lte: now },
    });

    const dailyTotals = {};
    reports.forEach((r) => {
      if (!r.completedAt || !r.revenue) return;
      const day = new Date(r.completedAt).toLocaleDateString("en-US", {
        weekday: "short",
      });
      dailyTotals[day] = (dailyTotals[day] || 0) + r.revenue;
    });

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const data = days.map((day) => ({
      day,
      revenue: dailyTotals[day] || 0,
    }));

    res.json({ success: true, data });
  } catch (err) {
    console.error("Revenue trend error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/activities", async (req, res) => {
  try {
    const [reports, remedies, consultations, services] = await Promise.all([
      Report.find().sort({ createdAt: -1 }).limit(5),
      Remedy.find().sort({ createdAt: -1 }).limit(5),
      Consultation.find().sort({ createdAt: -1 }).limit(5),
      Service.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const activities = [];

    reports.forEach((r) =>
      activities.push({
        id: `report-${r._id}`,
        text: `Report "${r.title || "Untitled"}" ${
          r.status === "completed" ? "completed" : "updated"
        }`,
        time: new Date(r.createdAt).toLocaleString(),
        icon: "📄",
      })
    );

    remedies.forEach((r) =>
      activities.push({
        id: `remedy-${r._id}`,
        text: `Remedy for ${r.clientName || "client"} marked as ${
          r.status || "Pending"
        }`,
        time: new Date(r.createdAt).toLocaleString(),
        icon: "💊",
      })
    );

    consultations.forEach((c) =>
      activities.push({
        id: `consult-${c._id}`,
        text: `Consultation with ${c.clientName || "client"} ${
          c.status || "Pending"
        }`,
        time: new Date(c.createdAt).toLocaleString(),
        icon: "📞",
      })
    );

    services.forEach((s) =>
      activities.push({
        id: `service-${s._id}`,
        text: `Service "${s.name}" ${s.timeline ? "updated" : "created"}`,
        time: new Date(s.createdAt).toLocaleString(),
        icon: "🛠️",
      })
    );

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json({
      success: true,
      activities: activities.slice(0, 10),
    });
  } catch (err) {
    console.error("Recent activities error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/alerts", async (req, res) => {
  try {
    const now = new Date();
    const alerts = [];

    const reports = await Report.find({ completedAt: { $exists: true, $ne: null } });
    reports.forEach((r) => {
      const due = new Date(r.completedAt);
      const diff = (due - now) / (1000 * 60 * 60 * 24); 
      if (diff <= 2 && diff >= 0)
        alerts.push(`Order "${r.title || "Unnamed Report"}" approaching deadline`);
      if (diff < 0)
        alerts.push(`Delayed Delivery: "${r.title || "Unnamed Report"}"`);
    });

   
    const pendingRemedies = await Remedy.find({ status: "Pending" });
    pendingRemedies.forEach((r) =>
      alerts.push(`Remedy for ${r.clientName || "client"} pending feedback`)
    );


    alerts.push("Failed payment for Order #A05");
    alerts.push("New client submission #C12");

   
    res.json({
      success: true,
      alerts: alerts.slice(0, 10),
    });
  } catch (err) {
    console.error("Dashboard alerts error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

