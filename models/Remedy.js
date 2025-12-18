

const mongoose = require("mongoose");

const remedySchema = new mongoose.Schema(
  {
    // ================= CLIENT DETAILS =================
    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    // ================= REMEDY DETAILS =================
    remedyType: {
      type: String,
      enum: ["Gemstone", "Yantra", "Mantra", "Rahu Yantra", "Homa", "Other"],
      default: "Gemstone",
    },

    description: {
      type: String,
      trim: true,
    },

    // ================= IMPORTANT DATES =================

    // 📅 Date of Doing Remedy (renamed from remedyDate)
    dateOfDoingRemedy: {
      type: Date,
      required: true,
    },

    // 🚚 Date of Product Delivery
    dateOfProductDelivery: {
      type: Date,
    },

    // ================= FILE =================
    fileUrl: {
      type: String,
    },

    // ================= STATUS =================
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Remedy", remedySchema);
