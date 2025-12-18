

const Razorpay = require("razorpay");
const crypto = require("crypto");
const Transaction = require("../models/Transaction");

// ⭐ Wallet Function
const { addMoneyToWallet } = require("./walletController");

// Razorpay client
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

/* =====================================================
   🧾 CREATE ORDER
===================================================== */
exports.createOrder = async (req, res) => {
  console.log("📩 /payment/create-order hit:", req.body);

  try {
    let { amount, userId, planId } = req.body;

    if (!amount || !userId) {
      return res
        .status(400)
        .json({ success: false, error: "Amount & userId required" });
    }

    amount = Number(amount);
    if (isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid amount" });
    }

    // 🧾 CREATE Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${planId || "wallet"}_${Date.now()}`,
    });

    console.log("✅ Razorpay Order Created:", order.id);

    // ⭐ Create PENDING transaction
    await Transaction.create({
      user: userId,
      plan: planId || null,
      amount,
      currency: "INR",
      orderId: order.id,
      receiptId: order.receipt,
      status: "PENDING",
    });

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err.message);
    return res
      .status(500)
      .json({ success: false, error: err.message });
  }
};

// /* =====================================================
//    🔍 VERIFY PAYMENT
// ===================================================== */
// exports.verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       userId,
//       planId,
//       amount,
//     } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Incomplete payment details" });
//     }

//     // 🔐 Generate expected signature
//     const expectedSignature = crypto
//       .createH

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      planId,
      amount,

      // ⭐ ADD THIS (for bookings)
      serviceType,
      serviceName
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, error: "Incomplete payment details" });
    }

    // 🔐 Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    const status = isAuthentic ? "SUCCESS" : "FAILED";

    // ⭐ Update transaction
    let txn = await Transaction.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status,
      },
      { new: true }
    );

    // If not found, create new transaction
    if (!txn) {
      txn = await Transaction.create({
        user: userId,
        plan: planId || null,
        amount,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status,
      });
    }

    /* ⭐⭐⭐ IF PAYMENT SUCCESS → 
       1) Wallet Update
       2) Booking Save
    */
    if (isAuthentic) {
      console.log("💳 Payment SUCCESS → Adding to wallet:", userId, amount);

      // ➤ 1) WALLET UPDATE
      await addMoneyToWallet(userId, amount);

      // ➤ 2) CREATE BOOKING
      const Booking = require("../models/Booking");

      await Booking.create({
        userId,
        serviceType: serviceType || "service",
        serviceName: serviceName || "Astro Service",
        amount,
        status: "completed",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });

      console.log("🎉 Booking Saved Successfully!");
    }

    console.log("💰 Payment Verify Status:", status);

    return res.status(200).json({
      success: isAuthentic,
      status,
      txn,
    });
  } catch (err) {
    console.error("❌ Error verifying payment:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
