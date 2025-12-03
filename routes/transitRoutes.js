const express = require("express");
const router = express.Router();
const Transit = require("../models/Transit");
const axios = require("axios");
const { calculateTransit } = require("../utils/prokeralaApi"); // ✅ Correct live function

/* 🌍 Get coordinates using OpenCage API */
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

  // fallback Hisar if not found
  return { latitude: 29.1539, longitude: 75.7229 };
}

/* ♈ Convert degree to Zodiac sign */
function getZodiacFromDegree(deg) {
  const zodiacs = [
    "Aries ♈", "Taurus ♉", "Gemini ♊", "Cancer ♋",
    "Leo ♌", "Virgo ♍", "Libra ♎", "Scorpio ♏",
    "Sagittarius ♐", "Capricorn ♑", "Aquarius ♒", "Pisces ♓",
  ];
  return zodiacs[Math.floor((deg % 360) / 30)] || "-";
}

/* 🔮 POST: Calculate & Save Personalized Transit */
router.post("/calculate", async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

    if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth)
      return res.status(400).json({ success: false, message: "All fields are required." });

    const { latitude, longitude } = await getCoordinates(placeOfBirth);
    console.log(`🌍 Calculating transit for ${name} (${latitude}, ${longitude})`);

    // ✅ Fetch real-time transit data from Prokerala
    const result = await calculateTransit({
      date: dateOfBirth,
      time: timeOfBirth,
      latitude,
      longitude,
    });

    console.log("📡 RAW TRANSIT RESPONSE ↓↓↓");
    console.dir(result.data, { depth: null });

    if (!result.success) {
      console.error("❌ Prokerala API failed:", result.error);
      return res.status(502).json({
        success: false,
        message: "Prokerala API failed.",
        error: result.error,
      });
    }

    // ✅ Extract planetary transit data properly
    const raw =
      result.data?.data?.output ||
      result.data?.output ||
      result.data?.data ||
      result.data;

    const planets =
      raw?.planet_transit ||
      raw?.planet_positions ||
      raw?.planets ||
      raw?.grahas ||
      [];

    console.log(`✅ ${planets.length} planets fetched from Prokerala.`);

    if (planets.length === 0) {
      return res.status(500).json({
        success: false,
        message: "No planetary data returned from Prokerala.",
      });
    }

    // 🌞 Format planet data
    const formatted = planets.map((p) => ({
      planet: p.planet || p.name || "-",
      longitude: p.longitude?.toFixed(2) || "-",
      sign: p.longitude ? getZodiacFromDegree(p.longitude) : "-",
      retrograde: p.retrograde ? "Yes" : "No",
    }));

    // 🌞 Identify Sun & Moon
    const sun = formatted.find((p) => p.planet.toLowerCase().includes("sun"));
    const moon = formatted.find((p) => p.planet.toLowerCase().includes("moon"));

    const description = `Transit generated for ${name} — personalized based on their date, time, and place of birth.`;

    // 💾 Save to MongoDB
    const newTransit = await Transit.create({
      name,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      transitData: {
        sunTransit: sun?.sign || "-",
        moonTransit: moon?.sign || "-",
        description,
        planets: formatted,
      },
    });

    res.status(201).json({
      success: true,
      message: "✅ Personalized transit data saved successfully!",
      data: newTransit,
    });
  } catch (err) {
    console.error("🔥 Transit Error:", err);
    res.status(500).json({
      success: false,
      message: "Transit calculation failed.",
      error: err.message,
    });
  }
});

/* 📜 GET: Fetch all saved Transits */
router.get("/", async (req, res) => {
  try {
    const transits = await Transit.find().sort({ createdAt: -1 });
    res.json({ success: true, data: transits });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ❌ DELETE: Remove specific transit */
router.delete("/:id", async (req, res) => {
  try {
    await Transit.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
