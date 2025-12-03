// const SubscriptionPlan = require("../models/SubscriptionPlan");
// const Referral = require("../models/Referral");

// // ===== PLANS =====
// exports.getPlans = async (req, res) => {
//   try {
//     const plans = await SubscriptionPlan.find();
//     res.setHeader("Cache-Control", "no-store");
//     res.json({ success: true, plans });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// exports.createPlan = async (req, res) => {
//   try {
//     const plan = await SubscriptionPlan.create(req.body);
//     res.json({ success: true, plan });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// exports.deletePlan = async (req, res) => {
//   try {
//     await SubscriptionPlan.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // ===== REFERRALS =====
// exports.getReferrals = async (req, res) => {
//   try {
//     const referrals = await Referral.find().populate("user", "name email");
//     res.setHeader("Cache-Control", "no-store");
//     res.json({ success: true, referrals });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// exports.approveReferral = async (req, res) => {
//   try {
//     const referral = await Referral.findByIdAndUpdate(
//       req.params.id,
//       { approved: true },
//       { new: true }
//     ).populate("user", "name email");
//     res.json({ success: true, referral });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


const SubscriptionPlan = require("../models/SubscriptionPlan");
const Referral = require("../models/Referral");

/* =====================================================
   🔹 PLANS CRUD
===================================================== */

// ===== Get all plans =====
exports.getPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ createdAt: -1 });
    res.setHeader("Cache-Control", "no-store");
    res.json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===== Create plan =====
exports.createPlan = async (req, res) => {
  try {
    const { name, amount, interval } = req.body;
    if (!name || !amount) {
      return res.status(400).json({ success: false, error: "Name & amount required" });
    }

    const plan = await SubscriptionPlan.create({ name, amount, interval });
    res.status(201).json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===== Update plan =====
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, interval } = req.body;

    const plan = await SubscriptionPlan.findByIdAndUpdate(
      id,
      { name, amount, interval },
      { new: true }
    );

    if (!plan) return res.status(404).json({ success: false, error: "Plan not found" });

    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===== Delete plan =====
exports.deletePlan = async (req, res) => {
  try {
    const deleted = await SubscriptionPlan.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Plan not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* =====================================================
   🔹 REFERRALS MANAGEMENT
===================================================== */

// ===== Get all referrals =====
exports.getReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find().populate("user", "name email");
    res.setHeader("Cache-Control", "no-store");
    res.json({ success: true, referrals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===== Approve referral =====
exports.approveReferral = async (req, res) => {
  try {
    const referral = await Referral.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    ).populate("user", "name email");

    if (!referral)
      return res.status(404).json({ success: false, error: "Referral not found" });

    res.json({ success: true, referral });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===== Delete referral =====
exports.deleteReferral = async (req, res) => {
  try {
    const deleted = await Referral.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, error: "Referral not found" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
