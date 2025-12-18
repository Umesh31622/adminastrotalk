
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


