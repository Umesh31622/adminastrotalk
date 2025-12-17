// const express = require("express");
// const { createSubmission, getAllSubmissions } = require("../controllers/submissionController");
// const router = express.Router();

// router.post("/", createSubmission);
// router.get("/", getAllSubmissions);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getReferrals,
  approveReferral,
  deleteReferral,
} = require("../controllers/subscriptionController");

// ===== Plans =====
router.get("/plans", getPlans);
router.post("/plans", createPlan);
router.put("/plans/:id", updatePlan);
router.delete("/plans/:id", deletePlan);

// ===== Referrals =====
router.get("/referrals", getReferrals);
router.put("/referrals/:id/approve", approveReferral);
router.delete("/referrals/:id", deleteReferral);

module.exports = router;
