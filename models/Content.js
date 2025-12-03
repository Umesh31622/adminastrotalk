
// const mongoose = require("mongoose");

// const contentSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     type: { type: String, enum: ["pdf", "audio", "video", "blog", "prompt"], required: true },
//     tags: [{ type: String }],
//     access: { type: String, enum: ["free", "paid", "program"], default: "free" },
//     fileUrl: { type: String },
//     content: { type: String }, // For blog text or journaling prompts
//     scheduledDate: { type: Date }, // For auto-push scheduling
//     uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Content", contentSchema);

const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["pdf", "audio", "video", "blog", "prompt", "image", "text"], required: true },
    tags: [{ type: String }],
    access: { type: String, enum: ["free", "paid", "program"], default: "free" },
    fileUrl: { type: String },
    content: { type: String }, // blog text or prompts
    scheduledDate: { type: Date },
    publicId: { type: String },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
