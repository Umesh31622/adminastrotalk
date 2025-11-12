// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// const Transaction = require("../models/Transaction");

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// exports.createOrder = async (req, res) => {
//   try {
//     const { amount, userId, planId } = req.body;
//     if (!amount || !userId) return res.status(400).json({ success: false, error: "Amount & userId required" });

//     const order = await razorpay.orders.create({
//       amount: Number(amount) * 100,
//       currency: "INR",
//       receipt: `receipt_${planId || "direct"}_${Date.now()}`,
//     });

//     res.json({ ...order, userId, planId });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// exports.verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, userId, amount } = req.body;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     const status = expectedSignature === razorpay_signature ? "SUCCESS" : "FAILED";

//     const txn = await Transaction.create({
//       user: userId,
//       plan: planId,
//       amount,
//       status,
//       paymentId: razorpay_payment_id,
//       orderId: razorpay_order_id,
//     });

//     res.json({ success: status === "SUCCESS", txn });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// const Transaction = require("../models/Transaction");

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// // ================= CREATE ORDER =================
// exports.createOrder = async (req, res) => {
//   console.log("📩 /api/payments/create-order hit:", req.body);

//   try {
//     const { amount, userId, planId } = req.body;

//     if (!amount || !userId) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Amount & userId required" });
//     }

//     // ✅ Order create
//     const order = await razorpay.orders.create({
//       amount: Math.round(Number(amount) * 100),
//       currency: "INR",
//       receipt: `receipt_${planId || "direct"}_${Date.now()}`,
//     });

//     console.log("✅ Razorpay order created:", order.id);
//     return res.status(200).json({
//       success: true,
//       message: "Order created successfully",
//       order,
//     });
//   } catch (err) {
//     console.error("❌ Error creating Razorpay order:", err.message);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };

// // ================= VERIFY PAYMENT =================
// exports.verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       planId,
//       userId,
//       amount,
//     } = req.body;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     const isAuthentic = expectedSignature === razorpay_signature;
//     const status = isAuthentic ? "SUCCESS" : "FAILED";

//     // ✅ Save to DB
//     const txn = await Transaction.create({
//       user: userId,
//       plan: planId,
//       amount,
//       status,
//       paymentId: razorpay_payment_id,
//       orderId: razorpay_order_id,
//     });

//     console.log("💰 Payment verification status:", status);
//     return res.status(200).json({ success: isAuthentic, txn });
//   } catch (err) {
//     console.error("❌ Error verifying payment:", err.message);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };


const Razorpay = require("razorpay");
const crypto = require("crypto");
const Transaction = require("../models/Transaction");

// Razorpay client
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

/* ===========================================================
   🧾 CREATE ORDER
=========================================================== */
exports.createOrder = async (req, res) => {
  console.log("📩 /api/payments/create-order hit:", req.body);
  try {
    let { amount, userId, planId } = req.body;

    if (!amount || !userId) {
      console.warn("❌ Missing fields:", { amount, userId });
      return res.status(400).json({ success: false, error: "Amount & userId required" });
    }

    amount = Number(amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid amount" });
    }

    // ✅ Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${planId || "direct"}_${Date.now()}`,
    });

    console.log("✅ Razorpay order created:", order.id);

    // ✅ Save a PENDING transaction
    await Transaction.create({
      user: userId,
      plan: planId || null,
      amount,
      currency: "INR",
      orderId: order.id,
      receiptId: order.receipt,
      status: "PENDING",
    });

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Error creating Razorpay order:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ===========================================================
   ✅ VERIFY PAYMENT
=========================================================== */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      planId,
      amount,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: "Incomplete payment details" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    const status = isAuthentic ? "SUCCESS" : "FAILED";

    // ✅ Update existing transaction
    const txn = await Transaction.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status,
      },
      { new: true }
    );

    if (!txn) {
      console.warn("⚠ Transaction not found for order:", razorpay_order_id);
      await Transaction.create({
        user: userId,
        plan: planId || null,
        amount,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status,
      });
    }

    console.log("💰 Payment verification:", status);
    res.status(200).json({ success: isAuthentic, status, txn });
  } catch (err) {
    console.error("❌ Error verifying payment:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
