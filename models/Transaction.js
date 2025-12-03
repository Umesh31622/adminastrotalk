// const mongoose = require("mongoose");
// const schema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   plan: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan" },
//   amount: Number,
//   status: String,
//   paymentId: String,
//   orderId: String
// }, { timestamps: true });
// module.exports = mongoose.model("Transaction", schema);

// const mongoose = require("mongoose");

// const transactionSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     plan: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SubscriptionPlan",
//       default: null,
//     },

//     // 💰 Amount and Currency
//     amount: {
//       type: Number,
//       required: true,
//       min: [1, "Amount must be greater than 0"],
//     },
//     currency: {
//       type: String,
//       default: "INR",
//     },

//     // 💳 Razorpay details
//     orderId: { type: String, required: true },
//     paymentId: { type: String, default: null },
//     signature: { type: String, default: null },

//     // ✅ Status
//     status: {
//       type: String,
//       enum: ["PENDING", "SUCCESS", "FAILED"],
//       default: "PENDING",
//     },

//     // 🧾 Extra details
//     receiptId: { type: String, default: null },
//     remarks: { type: String, default: "" },
//   },
//   { timestamps: true }
// );

// transactionSchema.index({ user: 1, status: 1 });
// transactionSchema.index({ orderId: 1 });

// module.exports = mongoose.model("Transaction", transactionSchema);


const mongoose = require("mongoose");

// 🧩 Helper: Generate unique transaction ID like TXN_2025NOV08_1234
function generateTransactionId() {
  const now = new Date();
  const dateStr = now
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "")
    .toUpperCase(); // e.g. 20251108
  const random = Math.floor(1000 + Math.random() * 9000); // random 4 digits
  return `TXN_${dateStr}_${random}`;
}

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      default: null,
    },

    // 💰 Amount and Currency
    amount: {
      type: Number,
      required: true,
      min: [1, "Amount must be greater than 0"],
    },
    currency: {
      type: String,
      default: "INR",
    },

    // 💳 Razorpay details
    orderId: { type: String, required: true },
    paymentId: { type: String, default: null },
    signature: { type: String, default: null },

    // ✅ Unique internal transaction ID
    transactionId: {
      type: String,
      unique: true,
      default: generateTransactionId,
    },

    // ✅ Status
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    // 🧾 Extra details
    receiptId: { type: String, default: null },
    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

// ⚡ Helpful indexes
transactionSchema.index({ user: 1, status: 1 });
transactionSchema.index({ orderId: 1 });
transactionSchema.index({ transactionId: 1 }, { unique: true });

module.exports = mongoose.model("Transaction", transactionSchema);
