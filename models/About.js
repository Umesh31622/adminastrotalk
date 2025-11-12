const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    title: { type: String, default: "About Us" },
    content: { type: String, required: true },
    image: { type: String }, // image URL or base64 string
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);
