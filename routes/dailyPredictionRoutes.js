const express = require("express");
const router = express.Router();
const DailyPrediction = require("../models/DailyPrediction");

// GET all predictions
router.get("/", async (req, res) => {
  try {
    const predictions = await DailyPrediction.find().sort({ date: -1 });
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST new prediction
router.post("/", async (req, res) => {
  try {
    const { date, title, description, effect } = req.body;
    if (!date || !title || !description)
      return res.status(400).json({ error: "All fields are required" });

    const newPrediction = new DailyPrediction({ date, title, description, effect });
    await newPrediction.save();
    res.status(201).json(newPrediction);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT: update prediction
router.put("/:id", async (req, res) => {
  try {
    const { date, title, description, effect } = req.body;
    const updatedPrediction = await DailyPrediction.findByIdAndUpdate(
      req.params.id,
      { date, title, description, effect },
      { new: true }
    );
    res.json(updatedPrediction);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE: remove prediction
router.delete("/:id", async (req, res) => {
  try {
    await DailyPrediction.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
