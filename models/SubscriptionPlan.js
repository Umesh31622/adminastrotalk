const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  interval: { type: String, enum: ["weekly","monthly","yearly"], default: "monthly" },
}, { timestamps: true });
module.exports = mongoose.model("SubscriptionPlan", schema);
