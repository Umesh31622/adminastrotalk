
const Feedback = require("../models/Feedback");

// ✅ Create
exports.createFeedback = async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;
    const feedback = await Feedback.create({ name, email, message, rating });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: "Failed to create feedback" });
  }
};

// ✅ Read (all feedbacks)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
};

// ✅ Update
exports.updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Feedback.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update feedback" });
  }
};

// ✅ Delete
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await Feedback.findByIdAndDelete(id);
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete feedback" });
  }
};

