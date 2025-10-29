


// const Feedback = require("../models/Feedback");

// // Create feedback (public)
// exports.createFeedback = async (req, res) => {
//   try {
//     const { name, email, message, service, rating } = req.body;
//     if (!name || !email || !message || !rating)
//       return res.status(400).json({ message: "Missing required fields" });

//     const feedback = new Feedback({ name, email, message, service, rating });
//     await feedback.save();
//     res.status(201).json({ message: "Feedback submitted successfully", feedback });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get all feedbacks (admin) or public
// exports.getAllFeedbacks = async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find().sort({ createdAt: -1 });
//     res.json(feedbacks);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // Delete feedback (admin only)
// exports.deleteFeedback = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Feedback.findByIdAndDelete(id);
//     res.json({ message: "Feedback deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // Update feedback (admin only)
// exports.updateFeedback = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const update = req.body; // e.g., { status, isPublished, tags }
//     const feedback = await Feedback.findByIdAndUpdate(id, update, { new: true });
//     res.json(feedback);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };
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
