const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  paymentId: { type: String },          // Razorpay payment ID
  orderId: { type: String },            // Razorpay order ID
  status: { type: String, default: "created" }, // created, paid, failed, refunded
  subscriptionPlan: { type: String },  // Optional
  discountCode: { type: String },      // Optional
  refunded: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
