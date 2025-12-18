

const mongoose = require("mongoose");

const remedyJourneySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserWeb", // ✅ MUST MATCH MODEL NAME
      required: true,
    },

    remedyName: {
      type: String,
      required: true,
    },

    remedyType: {
      type: String,
      enum: ["Mantra", "Gemstone", "Yantra", "Pooja", "Other"],
      default: "Mantra",
    },

    status: {
      type: String,
      enum: ["ASSIGNED", "IN_PROGRESS", "COMPLETED", "DROPPED"],
      default: "ASSIGNED",
    },

    journal: [
      {
        note: String,
        date: { type: Date, default: Date.now },
      },
    ],

    feedback: {
      rating: Number,
      comment: String,
      submittedAt: Date,
    },

    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RemedyJourney", remedyJourneySchema);
