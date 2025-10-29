// const mongoose = require('mongoose');

// const TriggerSchema = new mongoose.Schema({
//   name: String,
//   event: String, // e.g., "order.created", "remedy.started"
//   channel: { type: String, enum: ['email','whatsapp'] },
//   template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
//   active: { type: Boolean, default: true },
//   // additional filter criteria (optional)
//   criteria: Object 
// }, { timestamps: true });

// module.exports = mongoose.model('Trigger', TriggerSchema);

const mongoose = require("mongoose");

const triggerSchema = new mongoose.Schema({
  eventType: { type: String, required: true, unique: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trigger", triggerSchema);
