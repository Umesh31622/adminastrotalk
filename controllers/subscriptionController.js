const SubscriptionPlan = require("../models/SubscriptionPlan");
const Referral = require("../models/Referral");

// ===== PLANS =====
exports.getPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.setHeader("Cache-Control", "no-store");
    res.json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.create(req.body);
    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    await SubscriptionPlan.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===== REFERRALS =====
exports.getReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find().populate("user", "name email");
    res.setHeader("Cache-Control", "no-store");
    res.json({ success: true, referrals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.approveReferral = async (req, res) => {
  try {
    const referral = await Referral.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    ).populate("user", "name email");
    res.json({ success: true, referral });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
