const express = require("express");
const router = express.Router();
const Planetary = require("../models/Planetary");

// POST: Calculate & save planetary positions
router.post("/calculate", async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

    if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Example logic: random planets (replace with real calculation if needed)
    const planets = {
      Sun: "Leo",
      Moon: "Cancer",
      Mars: "Aries",
      Mercury: "Gemini",
      Jupiter: "Sagittarius",
      Venus: "Taurus",
      Saturn: "Capricorn",
      Rahu: "Gemini",
      Ketu: "Sagittarius",
    };

    const newEntry = new Planetary({
      name,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      planets,
    });

    await newEntry.save();
    res.status(200).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all planetary entries
router.get("/", async (req, res) => {
  try {
    const data = await Planetary.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE entry
router.delete("/:id", async (req, res) => {
  try {
    await Planetary.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE entry
router.put("/:id", async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;
    const updatedEntry = await Planetary.findByIdAndUpdate(
      req.params.id,
      { name, dateOfBirth, timeOfBirth, placeOfBirth },
      { new: true }
    );
    res.json(updatedEntry);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
