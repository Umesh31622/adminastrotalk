<<<<<<< HEAD
// const mongoose = require("mongoose");

// const faqSchema = new mongoose.Schema(
//   {
//     question: { type: String, required: true },
//     answer: { type: String, required: true },
//     category: { type: String, default: "general" }, // optional
//     status: { type: String, default: "active" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("FAQ", faqSchema);

const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "general",
      trim: true,
    },

    // ✅ NEW FIELD (Page name)
    page: {
      type: String,
      required: true, // very important
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FAQ", faqSchema);
=======
const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "general" }, // optional
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FAQ", faqSchema);
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
