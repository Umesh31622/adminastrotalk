
// // const mongoose = require("mongoose");

// // const feedbackSchema = new mongoose.Schema(
// //   {
// //     name: { type: String, required: true },
// //     email: { type: String, required: true },
// //     message: { type: String, required: true },
// //     service: { type: String },
// //     rating: { type: Number, required: true },
// //     status: { type: String, default: "pending" }, // pending/approved/rejected
// //     isPublished: { type: Boolean, default: false },
// //     tags: [{ type: String }],
// //   },
// //   { timestamps: true }
// // );

// module.exports = mongoose.model("Feedback", feedbackSchema);

const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    service: { type: String },
    rating: { type: Number, required: true },
    status: { type: String, default: "pending" }, // pending / approved / rejected
    isPublished: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);

// const mongoose = require("mongoose");

// const discountCodeSchema = new mongoose.Schema({
//   code: { type: String, required: true, unique: true },
//   discount: { type: Number, required: true }, // percentage
//   active: { type: Boolean, default: true },
//   validTill: { type: Date },
// }, { timestamps: true });

// module.exports = mongoose.model("DiscountCode", discountCodeSchema);
// s