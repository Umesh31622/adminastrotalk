
const express = require("express");
const router = express.Router();
const Manglik = require("../models/Manglik");

// GET all calculations
router.get("/", async (req, res) => {
  try {
    const calculations = await Manglik.find().sort({ createdAt: -1 });
    res.json(calculations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch calculations" });
  }
});

// POST calculate Manglik
router.post("/calculate", async (req, res) => {
  const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

  if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const isManglik = Math.random() < 0.5;

    const calculation = new Manglik({ name, dateOfBirth, timeOfBirth, placeOfBirth, isManglik });
    await calculation.save();

    res.json({ message: "Manglik calculation successful", calculation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Calculation failed" });
  }
});

// GET a single calculation by ID
router.get("/:id", async (req, res) => {
  try {
    const calc = await Manglik.findById(req.params.id);
    if (!calc) return res.status(404).json({ error: "Calculation not found" });
    res.json(calc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch calculation" });
  }
});

// DELETE a calculation
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Manglik.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Calculation not found" });
    res.json({ message: "Calculation deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete calculation" });
  }
});

// UPDATE a calculation
router.put("/:id", async (req, res) => {
  const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

  if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const updatedCalc = await Manglik.findByIdAndUpdate(
      req.params.id,
      { name, dateOfBirth, timeOfBirth, placeOfBirth },
      { new: true }
    );

    if (!updatedCalc) return res.status(404).json({ error: "Calculation not found" });

    res.json({ message: "Calculation updated successfully", calculation: updatedCalc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update calculation" });
  }
});

module.exports = router;
