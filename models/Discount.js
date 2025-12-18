
const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true },
    usageCount: { type: Number, default: 0 },
    maxUsage: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", discountSchema);
