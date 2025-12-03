const express = require("express");
const router = express.Router();
const Nakshatra = require("../models/Nakshatra");

// ---------------- POST: Calculate & Save ----------------
router.post("/calculate", async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;
    if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth)
      return res.status(400).json({ error: "All fields are required" });

    const birthDate = new Date(`${dateOfBirth}T${timeOfBirth}`);
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;

    // Example Nakshatra calculation logic (simplified)
    const nakshatras = [
      "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
      "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
      "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
      "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
      "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ];

    // Very simple demo: assign nakshatra based on day % 27
    const nakshatra = nakshatras[day % 27];

    const newNakshatra = new Nakshatra({ name, dateOfBirth, timeOfBirth, placeOfBirth, nakshatra });
    await newNakshatra.save();

    res.status(200).json(newNakshatra);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- GET: Fetch All ----------------
router.get("/", async (req, res) => {
  try {
    const data = await Nakshatra.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- DELETE: Remove Entry ----------------
router.delete("/:id", async (req, res) => {
  try {
    await Nakshatra.findByIdAndDelete(req.params.id);
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

    const nakshatras = [
      "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
      "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
      "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
      "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
      "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ];

    const nakshatra = nakshatras[day % 27];

    const updated = await Nakshatra.findByIdAndUpdate(
      req.params.id,
      { name, dateOfBirth, timeOfBirth, placeOfBirth, nakshatra },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

