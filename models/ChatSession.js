const mongoose = require("mongoose");

const ChatSessionSchema = new mongoose.Schema({
  name: String,
  gender: String,
  dob: String,
  tob: String,
  pob: String,
  intent: String,
  problemType: String,
  messages: [
    {
      sender: String, // user | admin | bot
      text: String,
      time: { type: Date, default: Date.now }
    }
  ],
  status: {
    type: String,
    default: "New"
  }
}, { timestamps: true });

module.exports = mongoose.model("ChatSession", ChatSessionSchema);
