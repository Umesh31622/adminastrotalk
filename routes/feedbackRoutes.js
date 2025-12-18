
const express = require("express");
const router = express.Router();
const {
  createFeedback,
  getAllFeedbacks,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

router.post("/", createFeedback);
router.get("/public", getAllFeedbacks);
router.put("/:id", updateFeedback);
router.delete("/:id", deleteFeedback);

module.exports = router;

