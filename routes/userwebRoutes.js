
// const express = require("express");
// const router = express.Router();
// const ctrl = require("../controllers/userwebController");
// const UserWeb = require("../models/userwebUser");

// // ⭐ GET ALL WEBSITE USERS (Admin Panel)
// router.get("/", async (req, res) => {
//   try {
//     const users = await UserWeb.find().sort({ createdAt: -1 });
//     res.json({ success: true, data: users });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // PROFILE
// router.get("/profile/:id", ctrl.getProfile);
// router.put("/profile/:id", ctrl.updateProfile);

// // HISTORIES
// router.get("/orders/:id", ctrl.getOrders);
// router.get("/payments/:id", ctrl.getPayments);
// router.get("/remedies/:id", ctrl.getRemedies);
// router.get("/kundli/:id", ctrl.getKundli);
// router.get("/wallet/:id", ctrl.getWallet);
// router.get("/history/:id", ctrl.getFullHistory);

// module.exports = router;

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userwebController");
const UserWeb = require("../models/userwebUser");

// ADMIN PANEL - LIST ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await UserWeb.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PROFILE ROUTES
router.get("/profile/:id", ctrl.getProfile);
router.put("/profile/:id", ctrl.updateProfile);

// HISTORY ROUTES
router.get("/orders/:id", ctrl.getOrders);
router.get("/payments/:id", ctrl.getPayments);
router.get("/remedies/:id", ctrl.getRemedies);
router.get("/kundli/:id", ctrl.getKundli);
router.get("/wallet/:id", ctrl.getWallet);
router.get("/history/:id", ctrl.getFullHistory);

module.exports = router;
