

// const mongoose = require("mongoose");

// const TemplateSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     type: { type: String, enum: ["email", "whatsapp"], required: true },
//     subject: { type: String },
//     body: { type: String, required: true },
//     variables: [String],
//     isActive: { type: Boolean, default: true },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Template", TemplateSchema);

const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["email", "whatsapp"], required: true },
    subject: { type: String }, // For email
    body: { type: String, required: true }, // Can contain placeholders like {{name}}
    variables: [String],
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Template", TemplateSchema);
