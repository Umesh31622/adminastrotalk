<<<<<<< HEAD


=======
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
const mongoose = require("mongoose");

const remedySchema = new mongoose.Schema(
  {
<<<<<<< HEAD
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
=======
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    remedyType: {
      type: String,
      enum: ["Gemstone", "Yantra", "Mantra","Rahu Yantra", "Homa", "Other"],
      default: "Gemstone",
    },
    description: { type: String },
    fileUrl: { type: String },
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
<<<<<<< HEAD
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Remedy", remedySchema);
=======
  { timestamps: true }
);

module.exports = mongoose.model("Remedy", remedySchema);

>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
