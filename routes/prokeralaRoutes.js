const express = require("express");
const router = express.Router();
const {
  calculateKundli,
  calculateNumerology,
  calculateCompatibility,
  calculateTransit,
  calculateDasha,
  getZodiacSign,
  getNakshatra,
  getPlanetaryPositions,
  getDailyPrediction,
  getHoroscope,
  calculateManglik,
  getPanchang,
  getGemstoneRecommendation,
  getTransitRemedies,
} = require("../utils/prokeralaApi");

/* =====================================================
   🔯 ASTROLOGY ROUTES (All Prokerala Calculators)
===================================================== */

// 🧭 1️⃣ Kundli (Birth Chart)
router.post("/kundli", async (req, res) => {
  try {
    const result = await calculateKundli(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /kundli:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔢 2️⃣ Numerology
router.post("/numerology", async (req, res) => {
  try {
    const result = await calculateNumerology(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /numerology:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 💞 3️⃣ Compatibility
router.post("/compatibility", async (req, res) => {
  try {
    const result = await calculateCompatibility(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /compatibility:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🌠 4️⃣ Transit Calculator
router.post("/transit", async (req, res) => {
  try {
    const result = await calculateTransit(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /transit:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔮 5️⃣ Dasha
router.post("/dasha", async (req, res) => {
  try {
    const result = await calculateDasha(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /dasha:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ♌ 6️⃣ Zodiac
router.post("/zodiac", async (req, res) => {
  try {
    const result = await getZodiacSign(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /zodiac:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🌟 7️⃣ Nakshatra
router.post("/nakshatra", async (req, res) => {
  try {
    const result = await getNakshatra(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /nakshatra:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🪐 8️⃣ Planetary Positions
router.post("/planetary", async (req, res) => {
  try {
    const result = await getPlanetaryPositions(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /planetary:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🕉 9️⃣ Daily Prediction
router.post("/daily-prediction", async (req, res) => {
  try {
    const result = await getDailyPrediction(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /daily-prediction:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ♈ 🔟 Horoscope
router.post("/horoscope", async (req, res) => {
  try {
    const result = await getHoroscope(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /horoscope:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 💍 11️⃣ Manglik
router.post("/manglik", async (req, res) => {
  try {
    const result = await calculateManglik(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /manglik:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🕉 12️⃣ Panchang
router.post("/panchang", async (req, res) => {
  try {
    const result = await getPanchang(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /panchang:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 💎 13️⃣ Gemstone Recommendation
router.post("/gemstone", async (req, res) => {
  try {
    const result = await getGemstoneRecommendation(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /gemstone:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🧘‍♂️ 14️⃣ Transit Remedies
router.post("/transit-remedies", async (req, res) => {
  try {
    const result = await getTransitRemedies(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /transit-remedies:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
