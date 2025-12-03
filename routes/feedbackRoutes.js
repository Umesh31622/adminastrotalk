

// const express = require("express");
// const router = express.Router();
// const { auth, admin } = require("../middleware/auth");
// const {
//   createFeedback,
//   getAllFeedbacks,
//   deleteFeedback,
//   updateFeedback,
// } = require("../controllers/feedbackController");

// // Public
// router.post("/", createFeedback);
// router.get("/public", getAllFeedbacks); // public read

// // Admin protected
// router.get("/", auth, admin, getAllFeedbacks);
// router.delete("/:id", auth, admin, deleteFeedback);
// router.put("/:id", auth, admin, updateFeedback);

// module.exports = router;
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
