// const express = require("express");
// const router = express.Router();
// const {
//   getPlans,
//   createPlan,
//   deletePlan,
//   getReferrals,
//   approveReferral,
// } = require("../controllers/subscriptionController");

// // Subscription plans
// router.get("/plans", getPlans);
// router.post("/plans", createPlan);
// router.delete("/plans/:id", deletePlan);

// // Referrals
// router.get("/referrals", getReferrals);
// router.put("/referrals/:id/approve", approveReferral);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { getPlans, createPlan, deletePlan, getReferrals, approveReferral } = require("../controllers/subscriptionController");

router.get("/plans", getPlans);
router.post("/plans", createPlan);
router.delete("/plans/:id", deletePlan);

router.get("/referrals", getReferrals);
router.put("/referrals/:id/approve", approveReferral);

module.exports = router;
