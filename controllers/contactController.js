const Contact = require("../models/Contact");

// ➕ CREATE — Website Form
exports.createContact = async (req, res) => {
  try {
    const saved = await Contact.create(req.body);
    res.json({ success: true, message: "Message saved", data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📥 READ All — Admin Panel
exports.getAllContacts = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📄 READ One
exports.getOneContact = async (req, res) => {
  try {
    const msg = await Contact.findById(req.params.id);
    res.json({ success: true, msg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✏️ UPDATE
exports.updateContact = async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ success: true, message: "Updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🗑 DELETE
exports.deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
