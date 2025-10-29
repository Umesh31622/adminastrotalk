// const express = require("express");
// const router = express.Router();
// const Panchang = require("../models/Panchang");

// // ➕ Create
// router.post("/", async (req, res) => {
//   try {
//     const data = await Panchang.create(req.body);
//     res.status(201).json(data);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to create Panchang entry" });
//   }
// });

// // 📄 Read All
// router.get("/", async (req, res) => {
//   try {
//     const list = await Panchang.find().sort({ createdAt: -1 });
//     res.json(list);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch Panchang entries" });
//   }
// });

// // ✏️ Update
// router.put("/:id", async (req, res) => {
//   try {
//     const updated = await Panchang.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update Panchang entry" });
//   }
// });

// // ❌ Delete
// router.delete("/:id", async (req, res) => {
//   try {
//     await Panchang.findByIdAndDelete(req.params.id);
//     res.json({ message: "Panchang entry deleted" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete entry" });
//   }
// });

// module.exports = router;
// routes/panchangRoutes.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

// Token cache for Prokerala
let tokenCache = { token: null, expiry: null };

async function getProkeralaToken() {
  const now = Date.now();
  if (tokenCache.token && tokenCache.expiry > now) return tokenCache.token;

  const res = await axios.post(
    process.env.PROKERALA_TOKEN_URL,
    `grant_type=client_credentials&client_id=${process.env.PROKERALA_CLIENT_ID}&client_secret=${process.env.PROKERALA_CLIENT_SECRET}`,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  tokenCache.token = res.data.access_token;
  tokenCache.expiry = now + res.data.expires_in * 1000 - 60000;
  return tokenCache.token;
}

// POST /api/panchang
router.post("/", async (req, res) => {
  try {
    const { city, date } = req.body;
    if (!city || !date) return res.status(400).json({ error: "City and Date required" });

    // Get lat/lon from city using OpenCage
    const geoRes = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${process.env.OPENCAGE_API_KEY}`
    );

    if (!geoRes.data.results.length) return res.status(400).json({ error: "Invalid city" });
    const { lat, lng } = geoRes.data.results[0].geometry;

    const token = await getProkeralaToken();

    const panchangRes = await axios.get(
      `${process.env.PROKERALA_BASE_URL}/panchang/daily`,
      {
        params: { date, latitude: lat, longitude: lng },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    res.json(panchangRes.data);
  } catch (err) {
    console.error("❌ Panchang Error:", err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || "Something went wrong" });
  }
});

module.exports = router;
