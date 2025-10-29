
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
const express = require("express");
const router = express.Router();
const Kundli = require("../models/Kundli");
const axios = require("axios");

// POST - Calculate and save Kundli
router.post("/calculate", async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

    
    const kundliData = {
      sunSign: "Leo",
      moonSign: "Scorpio",
      ascendant: "Virgo",
      description: "Strong leadership and deep emotional intelligence",
    };

    const kundli = new Kundli({
      name,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      kundliData,
    });

    await kundli.save();

    res.json({
      success: true,
      message: "Kundli calculated and saved successfully!",
      kundli,
    });
  } catch (err) {
    console.error("❌ Error calculating Kundli:", err);
    res.status(500).json({ success: false, message: "Calculation failed." });
  }
});


router.get("/", async (req, res) => {
  try {
    const kundlis = await Kundli.find().sort({ createdAt: -1 });
    res.json(kundlis);
  } catch (err) {
    res.status(500).json({ message: "Error fetching kundlis" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    await Kundli.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting kundli" });
  }
});

module.exports = router;
