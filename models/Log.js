const mongoose = require('mongoose');
const LogSchema = new mongoose.Schema({
  channel: String,
  to: String,
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  subject: String,
  body: String,
  attachments: Array,
  status: { type: String, enum: ['sent', 'failed', 'queued'], default: 'queued' },
  error: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Log', LogSchema);
