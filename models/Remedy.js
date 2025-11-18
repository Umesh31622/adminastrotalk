// const mongoose = require("mongoose");

// const remedySchema = new mongoose.Schema(
//   {
//     clientName: { type: String, required: true },
//     email: { type: String, required: true },
//     remedyType: {
//       type: String,
//       enum: ["Gemstone", "Yantra", "Mantra","Rahu Yantra", "Homa", "Other"],
//       default: "Gemstone",
//     },
//     description: { type: String },
//     fileUrl: { type: String },
//     status: {
//       type: String,
//       enum: ["Pending", "Completed"],
//       default: "Pending",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Remedy", remedySchema);


const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    serviceType: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    fileUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

