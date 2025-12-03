
// const mongoose = require("mongoose");

// const submissionSchema = new mongoose.Schema(
//   {
//     formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     userEmail: { type: String },
//     data: { type: Object, required: true },
//     status: { type: String, default: "Pending" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Submission", submissionSchema);

const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" }, // optional
    userEmail: { type: String },
    data: { type: Object, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);

