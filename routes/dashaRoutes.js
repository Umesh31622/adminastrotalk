// const express = require("express");
// const router = express.Router();
// const Dasha = require("../models/Dasha");

// // 🆕 Calculate & Save Dasha
// router.post("/calculate", async (req, res) => {
//   try {
//     const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

//     // 🌟 Dasha calculation logic (replace with real astrology logic)
//     const dashaData = {
//       mahadasha: "Ketu",
//       antardasha: "Venus",
//       description: "This is an example Dasha calculation.",
//     };

//     const newDasha = new Dasha({
//       name,
//       dateOfBirth,
//       timeOfBirth,
//       placeOfBirth,
//       dashaData,
//     });

//     await newDasha.save();
//     res.status(201).json(newDasha);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to calculate Dasha" });
//   }
// });

// // 🔄 Update Dasha
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedDasha = await Dasha.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updatedDasha);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update Dasha" });
//   }
// });

// // 🗑 Delete Dasha
// router.delete("/:id", async (req, res) => {
//   try {
//     await Dasha.findByIdAndDelete(req.params.id);
//     res.json({ message: "Dasha deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete Dasha" });
//   }
// });

// // 📄 Get All Dashas
// router.get("/", async (req, res) => {
//   try {
//     const dashas = await Dasha.find().sort({ createdAt: -1 });
//     res.json(dashas);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch dashas" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Dasha = require("../models/Dasha");
const axios = require("axios");
const { calculateDasha } = require("../utils/prokeralaApi");

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

/* 🧮 Calculate & Save Dasha */
router.post("/calculate", async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

    if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const { latitude, longitude } = await getCoordinates(placeOfBirth);
    console.log(`🪔 Calculating Dasha for ${name} (${latitude}, ${longitude})`);

    const result = await calculateDasha({
      date: dateOfBirth,
      time: timeOfBirth,
      latitude,
      longitude,
    });

    if (!result.success) {
      console.error("❌ Prokerala Dasha API failed:", result.error);
      return res.status(502).json({
        error: "Prokerala API failed.",
        detail: result.error,
      });
    }

    const dashaData = result.data;

    const newDasha = await Dasha.create({
      name,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      dashaData,
    });

    res.status(201).json(newDasha);
  } catch (err) {
    console.error("🔥 Dasha Error:", err);
    res.status(500).json({ error: "Dasha calculation failed", detail: err.message });
  }
});

/* 📜 Get All Dashas (returns clean array directly) */
router.get("/", async (req, res) => {
  try {
    const dashas = await Dasha.find().sort({ createdAt: -1 });
    res.json(dashas); // 👈 Clean direct array
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashas" });
  }
});

/* 🔄 Update Dasha */
router.put("/:id", async (req, res) => {
  try {
    const updatedDasha = await Dasha.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedDasha);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Dasha" });
  }
});

/* ❌ Delete Dasha */
router.delete("/:id", async (req, res) => {
  try {
    await Dasha.findByIdAndDelete(req.params.id);
    res.json({ message: "Dasha deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Dasha" });
  }
});

module.exports = router;
