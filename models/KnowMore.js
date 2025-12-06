
const mongoose = require("mongoose");

const KnowMoreSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    cloudinaryId: { type: String, required: true }, // public_id
  },
  { timestamps: true }
);

module.exports = mongoose.model("KnowMore", KnowMoreSchema);
