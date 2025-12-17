// const mongoose = require("mongoose");

// const manifestationSchema = new mongoose.Schema(
//   {
//     label: { type: String, required: true },
//     description: String,
//     fullDesc: String,
//     deliverable: String,
//     category: {
//       type: String,
//       enum: ["manifestation", "well-being"],
//       default: "manifestation",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("ManifestationService", manifestationSchema);
const mongoose = require("mongoose");

const manifestationSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    fullDesc: {
      type: String,
      trim: true,
    },

    deliverable: {
      type: String,
      trim: true,
    },

    // ✅ PRICE FIELD
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      enum: ["manifestation", "well-being"],
      default: "manifestation",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ManifestationService", manifestationSchema);
