const ChatSession = require("../models/ChatSession");

// Create new chat
exports.startChat = async (req, res) => {
  const chat = await ChatSession.create(req.body);
  res.json(chat);
};

// Send message
exports.sendMessage = async (req, res) => {
  const { id } = req.params;
  const { sender, text } = req.body;

  const chat = await ChatSession.findById(id);
  chat.messages.push({ sender, text });
  await chat.save();

  res.json(chat);
};

// Get all chats (Admin)
exports.getChats = async (req, res) => {
  const chats = await ChatSession.find().sort({ createdAt: -1 });
  res.json(chats);
};

// Get single chat
exports.getChat = async (req, res) => {
  const chat = await ChatSession.findById(req.params.id);
  res.json(chat);
};
