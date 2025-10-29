const Razorpay = require("razorpay");
const crypto = require("crypto");
const Transaction = require("../models/Transaction");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, userId, planId } = req.body;
    if (!amount || !userId) return res.status(400).json({ success: false, error: "Amount & userId required" });

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `receipt_${planId || "direct"}_${Date.now()}`,
    });

    res.json({ ...order, userId, planId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, userId, amount } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const status = expectedSignature === razorpay_signature ? "SUCCESS" : "FAILED";

    const txn = await Transaction.create({
      user: userId,
      plan: planId,
      amount,
      status,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    res.json({ success: status === "SUCCESS", txn });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
