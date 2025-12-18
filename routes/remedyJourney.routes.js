
const express = require("express");
const router = express.Router();

const {
  getAll,
  create,
  updateStatus,
  remove,
  getUserRemediesByEmail,
} = require("../controllers/remedyJourneyController");

/* ADMIN */
router.get("/", getAll);
router.post("/", create);
router.put("/:id/status", updateStatus);
router.delete("/:id", remove);

/* USER PANEL */
router.get("/user-by-email/:email", getUserRemediesByEmail);

module.exports = router;
