const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan" },
  amount: Number,
  status: String,
  paymentId: String,
  orderId: String
}, { timestamps: true });
module.exports = mongoose.model("Transaction", schema);
