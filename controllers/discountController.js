// const Discount = require("../models/Discount");

// exports.getDiscountCodes = async (req, res) => {
//   try {
//     const discounts = await Discount.find().sort({ createdAt: -1 });
//     res.setHeader("Cache-Control", "no-store");
//     res.json({ success: true, discounts });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// exports.createDiscountCode = async (req, res) => {
//   try {
//     const { code, discountPercentage, maxUsage } = req.body;
//     if (!code || !discountPercentage)
//       return res.status(400).json({ success: false, error: "Code & discount required" });

//     const existing = await Discount.findOne({ code: code.toUpperCase() });
//     if (existing) return res.status(400).json({ success: false, error: "Code exists" });

//     const discount = await Discount.create({
//       code: code.toUpperCase(),
//       discountPercentage,
//       maxUsage: maxUsage || 1,
//     });

//     res.status(201).json({ success: true, discount });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// exports.deleteDiscountCode = async (req, res) => {
//   try {
//     const discount = await Discount.findByIdAndDelete(req.params.id);
//     if (!discount) return res.status(404).json({ success: false, error: "Not found" });
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// const Discount = require("../models/Discount");

// // ===== Get All Discounts =====
// exports.getDiscountCodes = async (req, res) => {
//   try {
//     const discounts = await Discount.find().sort({ createdAt: -1 });
//     res.setHeader("Cache-Control", "no-store");
//     res.json({ success: true, discounts });
//   } catch (err) {
//     console.error("Error fetching discounts:", err.message);
//     res.status(500).json({ success: false, error: "Failed to fetch discounts" });
//   }
// };

// // ===== Create New Discount =====
// exports.createDiscountCode = async (req, res) => {
//   try {
//     const { code, discountPercentage, maxUsage } = req.body;

//     if (!code || !discountPercentage) {
//       return res.status(400).json({
//         success: false,
//         error: "Code and discount percentage are required",
//       });
//     }

//     const existing = await Discount.findOne({ code: code.toUpperCase() });
//     if (existing) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Discount code already exists" });
//     }

//     const discount = await Discount.create({
//       code: code.toUpperCase(),
//       discountPercentage,
//       maxUsage: maxUsage || 1,
//     });

//     res.status(201).json({ success: true, discount });
//   } catch (err) {
//     console.error("Error creating discount:", err.message);
//     res.status(500).json({ success: false, error: "Failed to create discount" });
//   }
// };

// // ===== Delete Discount =====
// exports.deleteDiscountCode = async (req, res) => {
//   try {
//     const discount = await Discount.findByIdAndDelete(req.params.id);
//     if (!discount) {
//       return res
//         .status(404)
//         .json({ success: false, error: "Discount not found" });
//     }

//     res.json({ success: true, message: "Discount deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting discount:", err.message);
//     res.status(500).json({ success: false, error: "Failed to delete discount" });
//   }
// };

const Discount = require("../models/Discount");

/* =====================================================
   🔹 GET ALL DISCOUNT CODES
===================================================== */
exports.getDiscountCodes = async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.setHeader("Cache-Control", "no-store");
    res.json({ success: true, discounts });
  } catch (err) {
    console.error("Error fetching discounts:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch discounts" });
  }
};

/* =====================================================
   🔹 CREATE NEW DISCOUNT CODE
===================================================== */
exports.createDiscountCode = async (req, res) => {
  try {
    const { code, discountPercentage, maxUsage } = req.body;

    if (!code || !discountPercentage) {
      return res.status(400).json({
        success: false,
        error: "Code and discount percentage are required",
      });
    }

    const existing = await Discount.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, error: "Discount code already exists" });
    }

    const discount = await Discount.create({
      code: code.toUpperCase(),
      discountPercentage,
      maxUsage: maxUsage || 1,
    });

    res.status(201).json({ success: true, discount });
  } catch (err) {
    console.error("Error creating discount:", err.message);
    res.status(500).json({ success: false, error: "Failed to create discount" });
  }
};

/* =====================================================
   🔹 UPDATE DISCOUNT CODE
===================================================== */
exports.updateDiscountCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discountPercentage, maxUsage } = req.body;

    const updatedDiscount = await Discount.findByIdAndUpdate(
      id,
      {
        ...(code && { code: code.toUpperCase() }),
        ...(discountPercentage && { discountPercentage }),
        ...(maxUsage && { maxUsage }),
      },
      { new: true }
    );

    if (!updatedDiscount) {
      return res
        .status(404)
        .json({ success: false, error: "Discount not found" });
    }

    res.json({ success: true, discount: updatedDiscount });
  } catch (err) {
    console.error("Error updating discount:", err.message);
    res.status(500).json({ success: false, error: "Failed to update discount" });
  }
};

/* =====================================================
   🔹 DELETE DISCOUNT CODE
===================================================== */
exports.deleteDiscountCode = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) {
      return res
        .status(404)
        .json({ success: false, error: "Discount not found" });
    }

    res.json({ success: true, message: "Discount deleted successfully" });
  } catch (err) {
    console.error("Error deleting discount:", err.message);
    res.status(500).json({ success: false, error: "Failed to delete discount" });
  }
};
