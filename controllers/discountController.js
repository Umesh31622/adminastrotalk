const Discount = require("../models/Discount");

exports.getDiscountCodes = async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.setHeader("Cache-Control", "no-store");
    res.json({ success: true, discounts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createDiscountCode = async (req, res) => {
  try {
    const { code, discountPercentage, maxUsage } = req.body;
    if (!code || !discountPercentage)
      return res.status(400).json({ success: false, error: "Code & discount required" });

    const existing = await Discount.findOne({ code: code.toUpperCase() });
    if (existing) return res.status(400).json({ success: false, error: "Code exists" });

    const discount = await Discount.create({
      code: code.toUpperCase(),
      discountPercentage,
      maxUsage: maxUsage || 1,
    });

    res.status(201).json({ success: true, discount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteDiscountCode = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
