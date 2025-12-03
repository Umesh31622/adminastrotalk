const mongoose = require("mongoose");

const manifestationSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    description: String,
    fullDesc: String,
    deliverable: String,
    category: {
      type: String,
      enum: ["manifestation", "well-being"],
      default: "manifestation",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ManifestationService", manifestationSchema);
