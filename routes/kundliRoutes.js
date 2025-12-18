
const express = require("express");
const router = express.Router();
const Kundli = require("../models/Kundli");
const { calculateKundli } = require("../utils/prokeralaApi");
const axios = require("axios");

/* 🌍 Get coordinates from place name */
async function getCoordinates(place) {
  try {
    const res = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
      params: {
        q: place,
        key: process.env.OPENCAGE_API_KEY,
        limit: 1,
      },
    });
    if (res.data.results?.length) {
      const { lat, lng } = res.data.results[0].geometry;
      return { latitude: lat, longitude: lng };
    }
  } catch (err) {
    console.error("❌ Location fetch failed:", err.message);
  }

  // fallback to Hisar (default)
  return { latitude: 29.1539, longitude: 75.7229 };
}

/* 🌌 POST → Calculate & Save Kundli */
router.post("/calculate", async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

    if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // 🌍 Get coordinates
    const { latitude, longitude } = await getCoordinates(placeOfBirth);

    console.log("📍 Coordinates:", latitude, longitude);

    // 🔮 Call Prokerala API
    const result = await calculateKundli({
      date: dateOfBirth,
      time: timeOfBirth,
      latitude,
      longitude,
    });

    if (!result.success) {
      console.error("❌ Prokerala API failed:", result.error);
      return res.status(502).json({
        success: false,
        message: "Prokerala API failed",
        error: result.error,
      });
    }

    // ✅ Extract Kundli data safely
    const data = result.data || {};
    console.log("✅ Extracted Kundli:", {
      sunSign: data.sunSign,
      moonSign: data.moonSign,
      ascendant: data.ascendant,
      planets: data.planets?.length || 0,
      houses: data.houses?.length || 0,
    });

    // 💾 Save to MongoDB
    const kundli = await Kundli.create({
      name,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      kundliData: data,
    });

    res.json({
      success: true,
      message: "✅ Kundli calculated and saved successfully!",
      kundli,
    });
  } catch (err) {
    console.error("🔥 Kundli Error:", err);
    res.status(500).json({
      success: false,
      message: "Kundli calculation failed",
      error: err.message,
    });
  }
});

/* 📜 GET → All Kundlis */
router.get("/", async (req, res) => {
  try {
    const kundlis = await Kundli.find().sort({ createdAt: -1 });
    res.json({ success: true, data: kundlis });
  } catch (err) {
    console.error("❌ Fetch Kundlis Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* 🗑️ DELETE → Remove Kundli by ID */
router.delete("/:id", async (req, res) => {
  try {
    await Kundli.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Kundli Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

