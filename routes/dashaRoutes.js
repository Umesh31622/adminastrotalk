const express = require("express");
const router = express.Router();
const Dasha = require("../models/Dasha");

// 🆕 Calculate & Save Dasha
router.post("/calculate", async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

    // 🌟 Dasha calculation logic (replace with real astrology logic)
    const dashaData = {
      mahadasha: "Ketu",
      antardasha: "Venus",
      description: "This is an example Dasha calculation.",
    };

    const newDasha = new Dasha({
      name,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      dashaData,
    });

    await newDasha.save();
    res.status(201).json(newDasha);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate Dasha" });
  }
});

// 🔄 Update Dasha
router.put("/:id", async (req, res) => {
  try {
    const updatedDasha = await Dasha.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDasha);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Dasha" });
  }
});

// 🗑 Delete Dasha
router.delete("/:id", async (req, res) => {
  try {
    await Dasha.findByIdAndDelete(req.params.id);
    res.json({ message: "Dasha deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Dasha" });
  }
});

// 📄 Get All Dashas
router.get("/", async (req, res) => {
  try {
    const dashas = await Dasha.find().sort({ createdAt: -1 });
    res.json(dashas);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashas" });
  }
});

module.exports = router;
