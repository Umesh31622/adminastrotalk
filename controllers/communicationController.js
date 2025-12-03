// const MessageLog = require("../models/MessageLog");

// // Send a message
// exports.sendMessage = async (req, res) => {
//   try {
//     const { sender, receiver, message } = req.body;
//     const newMessage = new MessageLog({ sender, receiver, message });
//     await newMessage.save();
//     res.status(201).json({ success: true, data: newMessage });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // Get all messages
// exports.getMessages = async (req, res) => {
//   try {
//     const messages = await MessageLog.find();
//     res.status(200).json({ success: true, data: messages });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


const Template = require("../models/Template");
const MessageLog = require("../models/MessageLog");

// ================== TEMPLATES CRUD ==================

// Create Template
exports.createTemplate = async (req, res) => {
  try {
    const { name, type, subject, body, variables } = req.body;

    if (!name || !type || !body) {
      return res.status(400).json({ success: false, message: "Name, type, and body required" });
    }

    const template = await Template.create({
      name,
      type,
      subject,
      body,
      variables,
      createdBy: req.user?._id || null,
    });

    res.status(201).json({ success: true, data: template });
  } catch (err) {
    console.error("Template Save Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all templates
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: templates });
  } catch (err) {
    console.error("Get Templates Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single template
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ success: false, message: "Template not found" });
    res.json({ success: true, data: template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update template
exports.updateTemplate = async (req, res) => {
  try {
    const updated = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Template not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete template
exports.deleteTemplate = async (req, res) => {
  try {
    const deleted = await Template.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Template not found" });
    res.json({ success: true, message: "Template deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================== MESSAGE CRUD ==================

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    if (!sender || !receiver || !message)
      return res.status(400).json({ success: false, message: "All fields required" });

    const newMessage = await MessageLog.create({ sender, receiver, message });
    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    console.error("Send Message Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await MessageLog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    console.error("Get Messages Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single message
exports.getMessageById = async (req, res) => {
  try {
    const message = await MessageLog.findById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });
    res.json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update message
exports.updateMessage = async (req, res) => {
  try {
    const updated = await MessageLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Message not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const deleted = await MessageLog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Message not found" });
    res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
