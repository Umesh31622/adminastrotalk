const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  serviceType: { type: String, required: true },  
  // e.g. "kundli", "numerology", "consultation", "matchmaking"

  serviceName: { type: String }, // e.g. "Kundli Reading", "Chat with Astrologer"

  amount: { type: Number, required: true },

  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },

  paymentId: { type: String },
  orderId: { type: String },

  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
