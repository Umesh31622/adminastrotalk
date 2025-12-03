const Career = require("../models/Career");

// 💼 Get all Careers
exports.getCareers = async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    res.status(200).json(careers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching careers", error: err.message });
  }
};

// 💼 Add a new Career
exports.addCareer = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newCareer = new Career({ title, description });
    await newCareer.save();
    res.status(201).json({ message: "✅ Career added successfully", data: newCareer });
  } catch (err) {
    res.status(500).json({ message: "Error adding career", error: err.message });
  }
};

// 💼 Delete a Career
exports.deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) return res.status(404).json({ message: "Career not found" });
    res.status(200).json({ message: "🗑️ Career deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting career", error: err.message });
  }
};
