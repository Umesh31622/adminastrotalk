<<<<<<< HEAD
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
=======
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
const mongoose = require("mongoose");

const manifestationSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
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

=======
    label: { type: String, required: true },
    description: String,
    fullDesc: String,
    deliverable: String,
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
    category: {
      type: String,
      enum: ["manifestation", "well-being"],
      default: "manifestation",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ManifestationService", manifestationSchema);
