
const express = require("express");
const router = express.Router();
const cloudUpload = require("../middleware/cloudUpload")("remedies");

const {
  getRemedies,
  createRemedy,
  updateRemedy,
  deleteRemedy,
  getRemedyCalendar,
} = require("../controllers/remedyController");

router.get("/", getRemedies);
router.post("/", cloudUpload.single("file"), createRemedy);
router.put("/:id", cloudUpload.single("file"), updateRemedy);
router.delete("/:id", deleteRemedy);

// 📅 calendar
router.get("/calendar", getRemedyCalendar);

module.exports = router;
