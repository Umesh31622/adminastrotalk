const express = require("express");
const router = express.Router();
const analyticsCtrl = require("../controllers/analyticsController");

// CRUD
router.post("/", analyticsCtrl.createAnalytics);
router.get("/", analyticsCtrl.getAnalytics);
router.get("/:id", analyticsCtrl.getAnalyticsById);
router.put("/:id", analyticsCtrl.updateAnalytics);
router.delete("/:id", analyticsCtrl.deleteAnalytics);

module.exports = router;
