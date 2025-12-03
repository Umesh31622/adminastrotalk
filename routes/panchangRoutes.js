// const express = require("express");
// const router = express.Router();
// const axios = require("axios");
// const { callProkeralaAPI } = require("../utils/prokeralaApi");
// require("dotenv").config();

// /* ============================================================
//    🪔 PANCHANG (Prokerala Free Plan - Correct Endpoint)
// ============================================================ */
// router.post("/", async (req, res) => {
//   try {
//     const { city, date } = req.body;

//     if (!city || !date)
//       return res.status(400).json({ error: "City and Date are required." });

//     console.log("📥 Panchang Request:", { city, date });

//     // 1️⃣ Get latitude & longitude via OpenCage
//     const geoRes = await axios.get(
//       `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
//         city
//       )}&key=${process.env.OPENCAGE_API_KEY}`
//     );

//     if (!geoRes.data.results.length)
//       return res.status(400).json({ error: "Invalid city name." });

//     const { lat, lng } = geoRes.data.results[0].geometry;
//     console.log(`📍 ${city.toUpperCase()} → ${lat}, ${lng}`);

//     // 2️⃣ Format datetime and coordinates
//     const datetime = `${date}T05:30:00+05:30`; // ISO 8601 format (IST)
//     const coordinates = `${parseFloat(lat).toFixed(2)},${parseFloat(lng).toFixed(2)}`;

//     // 3️⃣ Panchang API parameters
//     const params = {
//       datetime,
//       coordinates,
//       ayanamsa: 1, // Lahiri
//     };

//     console.log("🪔 Fetching Panchang →", params);

//     // ✅ Correct endpoint (no /daily)
//     const result = await callProkeralaAPI("/panchang", { method: "get", params });

//     if (!result.success) {
//       console.error("❌ Panchang API failed:", result.error);
//       return res.status(502).json({ error: result.error });
//     }

//     const data = result.data?.data || result.data;
//     console.log("✅ Panchang data received!");

//     // 4️⃣ Extract summary info
//     const summary = {
//       date,
//       sunrise: data.sunrise,
//       sunset: data.sunset,
//       weekday: data.weekday?.name,
//       tithi: data.tithi?.name,
//       nakshatra: data.nakshatra?.name,
//       yoga: data.yoga?.name,
//       karana: data.karana?.name,
//       moonrise: data.moonrise,
//       moonset: data.moonset,
//       fasting: data.fasting?.type || "—",
//     };

//     return res.json(summary);
//   } catch (err) {
//     console.error("🔥 Panchang Error:", err.response?.data || err.message);
//     res.status(err.response?.status || 500).json({
//       error:
//         err.response?.data?.error ||
//         err.response?.data?.errors ||
//         err.message ||
//         "Failed to fetch Panchang data.",
//     });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const axios = require("axios");
const { callProkeralaAPI } = require("../utils/prokeralaApi");
const Panchang = require("../models/Panchang");
require("dotenv").config();

/* ============================================================
   ⚡ SIMPLE CITY COORDINATE CACHE (reduce API calls)
============================================================ */
const cityCache = {};

/* ============================================================
   🌞 1️⃣ GET all stored Panchang records
============================================================ */
router.get("/", async (req, res) => {
  try {
    const records = await Panchang.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error("🔥 Fetch Panchang error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================
   🌙 2️⃣ GET Panchang by ID
============================================================ */
router.get("/:id", async (req, res) => {
  try {
    const record = await Panchang.findById(req.params.id);
    if (!record) return res.status(404).json({ error: "Panchang not found" });
    res.json(record);
  } catch (err) {
    console.error("🔥 Get Panchang by ID error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================
   🪔 3️⃣ POST - Fetch live Panchang + Save to DB
============================================================ */
router.post("/", async (req, res) => {
  try {
    const { city, date } = req.body;

    if (!city || !date)
      return res.status(400).json({ error: "City and Date are required." });

    console.log("📥 Panchang Request:", { city, date });

    /* -------------------- 🗺️ Get Coordinates -------------------- */
    let lat, lng;

    if (cityCache[city]) {
      ({ lat, lng } = cityCache[city]);
      console.log("📍 Using cached coordinates:", cityCache[city]);
    } else {
      const geoRes = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          city
        )}&key=${process.env.OPENCAGE_API_KEY}`
      );

      if (!geoRes.data.results.length)
        return res.status(400).json({ error: "Invalid city name." });

      const loc = geoRes.data.results[0].geometry;
      lat = parseFloat(loc.lat).toFixed(2);
      lng = parseFloat(loc.lng).toFixed(2);
      cityCache[city] = { lat, lng };
      console.log("✅ Coordinates fetched:", cityCache[city]);
    }

    const datetime = `${date}T05:30:00+05:30`;
    const coordinates = `${lat},${lng}`;

    /* -------------------- 🧭 Call Prokerala API -------------------- */
    const params = { datetime, coordinates, ayanamsa: 1 };
    console.log("🪔 Fetching Panchang →", params);

    const result = await callProkeralaAPI("/panchang", { method: "get", params });

    if (!result.success) {
      console.error("❌ Panchang API failed:", result.error);
      return res.status(502).json({ error: result.error });
    }

    // 🌍 Handle nested data safely
    const data =
      result?.data?.data?.data ||
      result?.data?.data ||
      result?.data ||
      {};

    console.log("✅ Panchang data received sample:", Object.keys(data));

    /* -------------------- 🪄 Helper for flexible extraction -------------------- */
    const pickName = (value) => {
      if (!value) return "—";
      if (Array.isArray(value)) return value[0]?.name || "—";
      if (typeof value === "object") return value.name || "—";
      return value;
    };

    const pickPeriod = (value) => {
      if (!Array.isArray(value) || !value[0]) return "—";
      return `${value[0]?.start || "—"} → ${value[0]?.end || "—"}`;
    };

    /* -------------------- 🌞 Extract useful fields -------------------- */
    const summary = {
      city: city.toUpperCase(),
      date,
      sunrise: data.sunrise || "—",
      sunset: data.sunset || "—",
      weekday: data.weekday?.name || data.weekday || "—",
      tithi: pickName(data.tithi),
      tithi_period: pickPeriod(data.tithi),
      nakshatra: pickName(data.nakshatra),
      nakshatra_period: pickPeriod(data.nakshatra),
      yoga: pickName(data.yoga),
      yoga_period: pickPeriod(data.yoga),
      karana: pickName(data.karana),
      karana_period: pickPeriod(data.karana),
      moonrise: data.moonrise || "—",
      moonset: data.moonset || "—",
      fasting: data.fasting?.type || data.fasting || "—",
    };

    console.log("🌅 Panchang Summary:", summary);

    /* -------------------- 💾 Save + Respond -------------------- */
    const saved = await Panchang.create(summary);
    res.status(201).json(saved);
  } catch (err) {
    console.error("🔥 Panchang Error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error:
        err.response?.data?.error ||
        err.response?.data?.errors ||
        err.message ||
        "Failed to fetch Panchang data.",
    });
  }
});

/* ============================================================
   ✏️ 4️⃣ PUT - Update Panchang by ID
============================================================ */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Panchang.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Panchang not found" });
    res.json(updated);
  } catch (err) {
    console.error("🔥 Update Panchang error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================
   ❌ 5️⃣ DELETE Panchang by ID
============================================================ */
router.delete("/:id", async (req, res) => {
  try {
    await Panchang.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("🔥 Delete Panchang error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
