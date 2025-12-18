const express = require("express");
const router = express.Router();
const Zodiac = require("../models/Zodiac");

// ---------------- POST: Calculate & Save ----------------
router.post("/calculate", async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;
    if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth)
      return res.status(400).json({ error: "All fields are required" });

    const birthDate = new Date(`${dateOfBirth}T${timeOfBirth}`);
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;

    let zodiacSign = "";
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) zodiacSign = "Aries";
    else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) zodiacSign = "Taurus";
    else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) zodiacSign = "Gemini";
    else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) zodiacSign = "Cancer";
    else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) zodiacSign = "Leo";
    else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) zodiacSign = "Virgo";
    else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) zodiacSign = "Libra";
    else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) zodiacSign = "Scorpio";
    else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) zodiacSign = "Sagittarius";
    else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) zodiacSign = "Capricorn";
    else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) zodiacSign = "Aquarius";
    else zodiacSign = "Pisces";

    const newZodiac = new Zodiac({ name, dateOfBirth, timeOfBirth, placeOfBirth, zodiacSign });
    await newZodiac.save();
    res.status(200).json(newZodiac);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- GET: Fetch All ----------------
router.get("/", async (req, res) => {
  try {
    const data = await Zodiac.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- DELETE: Remove Entry ----------------
router.delete("/:id", async (req, res) => {
  try {
    await Zodiac.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- PUT: Update Entry ----------------
router.put("/:id", async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;
    if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth)
      return res.status(400).json({ error: "All fields are required" });

    const birthDate = new Date(`${dateOfBirth}T${timeOfBirth}`);
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;

    let zodiacSign = "";
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) zodiacSign = "Aries";
    else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) zodiacSign = "Taurus";
    else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) zodiacSign = "Gemini";
    else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) zodiacSign = "Cancer";
    else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) zodiacSign = "Leo";
    else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) zodiacSign = "Virgo";
    else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) zodiacSign = "Libra";
    else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) zodiacSign = "Scorpio";
    else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) zodiacSign = "Sagittarius";
    else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) zodiacSign = "Capricorn";
    else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) zodiacSign = "Aquarius";
    else zodiacSign = "Pisces";

    const updated = await Zodiac.findByIdAndUpdate(
      req.params.id,
      { name, dateOfBirth, timeOfBirth, placeOfBirth, zodiacSign },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

