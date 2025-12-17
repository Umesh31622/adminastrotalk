<<<<<<< HEAD
const mongoose = require("mongoose");

const knowMoreSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KnowMore", knowMoreSchema);
=======

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
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
