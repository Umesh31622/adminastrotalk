// const mongoose = require("mongoose");

// const walletSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, required: true },
//   balance: { type: Number, default: 0 },
//   transactions: [
//     {
//       type: { type: String, enum: ["credit", "debit"] },
//       amount: Number,
//       date: { type: Date, default: Date.now },
//     },
//   ],
// });

// module.exports = mongoose.model("Wallet", walletSchema);
const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        type: {
          type: String,
          enum: ["credit", "debit"],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
