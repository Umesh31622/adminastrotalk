const mongoose = require("mongoose");

const wealthSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    fileUrl: String,
    publicId: String,
    accessProgram: {
      type: String,
      enum: ["material"],
      default: "material",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WealthContent", wealthSchema);