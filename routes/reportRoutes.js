
const express = require("express");
const router = express.Router();
const reportCtrl = require("../controllers/reportController");
const { auth } = require("../middleware/auth");

// ================= ANALYTICS =================
router.get("/analytics/revenue-by-service", auth, reportCtrl.revenueByService);
router.get("/analytics/top-services", auth, reportCtrl.topServices);
router.get("/analytics/remedy-completion-rate", auth, reportCtrl.remedyCompletionRate);
router.get("/analytics/call-success-rate", auth, reportCtrl.callSuccessRate);

// ================= CRUD =================
router.post("/", auth, reportCtrl.createReport);
router.get("/", auth, reportCtrl.getReports);
router.get("/:id", auth, reportCtrl.getReportById);
router.put("/:id", auth, reportCtrl.updateReport);
router.delete("/:id", auth, reportCtrl.deleteReport);

module.exports = router;
