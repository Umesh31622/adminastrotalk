
// const express = require("express");
// const axios = require("axios");
// const router = express.Router();
// const Kundli = require("../models/Kundli");

// const PROKERALA_API_KEY = process.env.PROKERALA_API_KEY;

// // Create & calculate Kundli
// router.post("/calculate", async (req, res) => {
//   try {
//     const { name, dateOfBirth, timeOfBirth, placeOfBirth, latitude, longitude, timezone } = req.body;

//     // Call Prokerala API for birth chart
//     const response = await axios.get(
//       `https://api.prokerala.com/v2/astrology/birth-chart`,
//       {
//         params: {
//           datetime: `${dateOfBirth}T${timeOfBirth}`,
//           coordinates: `${latitude},${longitude}`,
//           ayanamsa: 1,
//         },
//         headers: {
//           Authorization: `Bearer ${PROKERALA_API_KEY}`,
//         },
//       }
//     );

//     const data = response.data.data;

//     // Example extracted values
//     const newKundli = new Kundli({
//       name,
//       dateOfBirth,
//       timeOfBirth,
//       placeOfBirth,
//       zodiac: data.sun_sign || "Unknown",
//       lagna: data.ascendant?.name || "Unknown",
//       moonSign: data.moon_sign || "Unknown",
//       nakshatra: data.moon_nakshatra?.name || "Unknown",
//       kundliDetails: data,
//     });

//     await newKundli.save();
//     res.json(newKundli);
//   } catch (err) {
//     console.error("Kundli calculation failed:", err.response?.data || err.message);
//     res.status(500).json({ error: "Kundli calculation failed", details: err.message });
//   }
// });

// // Read all Kundlis
// router.get("/", async (req, res) => {
//   try {
//     const kundlis = await Kundli.find().sort({ createdAt: -1 });
//     res.json(kundlis);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching Kundlis" });
//   }
// });

// // Update Kundli
// router.put("/:id", async (req, res) => {
//   try {
//     const updated = await Kundli.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: "Error updating Kundli" });
//   }
// });

// // Delete Kundli
// router.delete("/:id", async (req, res) => {
//   try {
//     await Kundli.findByIdAndDelete(req.params.id);
//     res.json({ message: "Kundli deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Error deleting Kundli" });
//   }
// });

// module.exports = router;

// routes/kundliRoutes.js
// const express = require("express");
// const router = express.Router();
// const ctrl = require("../controllers/kundliController");

// router.post("/calculate", ctrl.calculateKundli);
// router.get("/", ctrl.getAllKundlis);
// router.get("/:id", ctrl.getKundliById);
// router.put("/:id", ctrl.updateKundli);
// router.delete("/:id", ctrl.deleteKundli);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Kundli = require("../models/Kundli");
// const axios = require("axios");

// // POST - Calculate and save Kundli
// router.post("/calculate", async (req, res) => {
//   try {
//     const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

    
//     const kundliData = {
//       sunSign: "Leo",
//       moonSign: "Scorpio",
//       ascendant: "Virgo",
//       description: "Strong leadership and deep emotional intelligence",
//     };

//     const kundli = new Kundli({
//       name,
//       dateOfBirth,
//       timeOfBirth,
//       placeOfBirth,
//       kundliData,
//     });

//     await kundli.save();

//     res.json({
//       success: true,
//       message: "Kundli calculated and saved successfully!",
//       kundli,
//     });
//   } catch (err) {
//     console.error("❌ Error calculating Kundli:", err);
//     res.status(500).json({ success: false, message: "Calculation failed." });
//   }
// });


// router.get("/", async (req, res) => {
//   try {
//     const kundlis = await Kundli.find().sort({ createdAt: -1 });
//     res.json(kundlis);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching kundlis" });
//   }
// });


// router.delete("/:id", async (req, res) => {
//   try {
//     await Kundli.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting kundli" });
//   }
// });

// module.exports = router;const express = require("express");


// const express = require("express");
// const router = express.Router();
// const Kundli = require("../models/Kundli");
// const { calculateKundli } = require("../utils/prokeralaApi");
// const axios = require("axios");

// /* 🌍 Get coordinates from place name */
// async function getCoordinates(place) {
//   try {
//     const res = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
//       params: {
//         q: place,
//         key: process.env.OPENCAGE_API_KEY,
//         limit: 1,
//       },
//     });
//     if (res.data.results?.length) {
//       const { lat, lng } = res.data.results[0].geometry;
//       return { latitude: lat, longitude: lng };
//     }
//   } catch (err) {
//     console.error("❌ Location fetch failed:", err.message);
//   }
//   // fallback to Hisar
//   return { latitude: 29.1539, longitude: 75.7229 };
// }

// /* 🌞 Zodiac mapping by 30° each segment */
// function getZodiacFromDegree(deg) {
//   const zodiacs = [
//     "Aries ♈", "Taurus ♉", "Gemini ♊", "Cancer ♋",
//     "Leo ♌", "Virgo ♍", "Libra ♎", "Scorpio ♏",
//     "Sagittarius ♐", "Capricorn ♑", "Aquarius ♒", "Pisces ♓",
//   ];
//   const index = Math.floor((deg % 360) / 30);
//   return zodiacs[index] || "-";
// }

// /* 🌌 POST → Calculate & Save Kundli */
// router.post("/calculate", async (req, res) => {
//   try {
//     const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

//     if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth)
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required.",
//       });

//     const { latitude, longitude } = await getCoordinates(placeOfBirth);

//     // 🔮 Fetch data from Prokerala
//     const result = await calculateKundli({
//       date: dateOfBirth,
//       time: timeOfBirth,
//       latitude,
//       longitude,
//       endpoint: "/extended-birth-chart",
//     });

//     if (!result.success)
//       return res.status(502).json({
//         success: false,
//         message: "Prokerala API failed.",
//         error: result.error,
//       });

//     // 🧠 Extract nested data safely
//     const raw = result.data;
//     const data =
//       raw?.data?.output ||
//       raw?.data?.data?.output ||
//       raw?.output ||
//       raw?.chart ||
//       raw?.data?.chart ||
//       raw?.data ||
//       raw;

//     // 🌍 Detect planets and houses arrays
//     const planets =
//       data?.planet_positions ||
//       data?.planets ||
//       data?.planet_position ||
//       data?.planet_data ||
//       data?.grahas ||
//       [];
//     const houses =
//       data?.house_positions ||
//       data?.houses ||
//       data?.house_data ||
//       data?.bhavas ||
//       [];

//     console.log("✅ Extracted from Prokerala:", {
//       planets: planets.length,
//       houses: houses.length,
//       keys: Object.keys(data || {}),
//     });

//     // 🪔 Format planetary details
//     const formattedPlanets = planets.map((p) => ({
//       name: p.name || p.planet_name || "-",
//       degree: p.longitude ? p.longitude.toFixed(2) : "-",
//       sign: p.longitude ? getZodiacFromDegree(p.longitude) : "-",
//       house: p.house || p.house_id || "-",
//       info: p.longitude
//         ? `${p.name || p.planet_name} in ${getZodiacFromDegree(p.longitude)} (House ${p.house || "-"}) – ${p.longitude.toFixed(2)}°`
//         : "-",
//     }));

//     // 🏠 Format houses
//     const formattedHouses = houses.map((h, i) => ({
//       house: i + 1,
//       startDegree:
//         h.start_degree?.toFixed(2) ||
//         h.longitude?.toFixed(2) ||
//         "-",
//       sign: getZodiacFromDegree(h.start_degree || h.longitude || 0),
//       info: `House ${i + 1} → ${getZodiacFromDegree(
//         h.start_degree || h.longitude || 0
//       )} starts at ${h.start_degree?.toFixed(2) || h.longitude?.toFixed(2) || "-"}`,
//     }));

//     // 🌞 Save structured Kundli data
//     const kundliData = {
//       sunSign: data.sun_sign || "-",
//       moonSign: data.moon_sign || "-",
//       ascendant: data.ascendant?.name || data.ascendant_sign || "-",
//       planets: formattedPlanets,
//       houses: formattedHouses,
//       description: "Detailed planetary & house data fetched from Prokerala.",
//     };

//     // 💾 Save to DB
//     const kundli = await Kundli.create({
//       name,
//       dateOfBirth,
//       timeOfBirth,
//       placeOfBirth,
//       kundliData,
//     });

//     res.json({
//       success: true,
//       message: "✅ Kundli calculated and saved successfully!",
//       kundli,
//     });
//   } catch (err) {
//     console.error("🔥 Kundli Error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Kundli calculation failed",
//       error: err.message,
//     });
//   }
// });

// /* 📜 GET → All Kundlis */
// router.get("/", async (req, res) => {
//   try {
//     const kundlis = await Kundli.find().sort({ createdAt: -1 });
//     res.json({ success: true, data: kundlis });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// /* 🗑️ DELETE */
// router.delete("/:id", async (req, res) => {
//   try {
//     await Kundli.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: "Deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// module.exports = router;

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
