// const express = require("express");
// const router = express.Router();
// const DailyPrediction = require("../models/DailyPrediction");

// // GET all predictions
// router.get("/", async (req, res) => {
//   try {
//     const predictions = await DailyPrediction.find().sort({ date: -1 });
//     res.json(predictions);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // POST new prediction
// router.post("/", async (req, res) => {
//   try {
//     const { date, title, description, effect } = req.body;
//     if (!date || !title || !description)
//       return res.status(400).json({ error: "All fields are required" });

//     const newPrediction = new DailyPrediction({ date, title, description, effect });
//     await newPrediction.save();
//     res.status(201).json(newPrediction);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // PUT: update prediction
// router.put("/:id", async (req, res) => {
//   try {
//     const { date, title, description, effect } = req.body;
//     const updatedPrediction = await DailyPrediction.findByIdAndUpdate(
//       req.params.id,
//       { date, title, description, effect },
//       { new: true }
//     );
//     res.json(updatedPrediction);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // DELETE: remove prediction
// router.delete("/:id", async (req, res) => {
//   try {
//     await DailyPrediction.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const axios = require("axios");
const DailyPrediction = require("../models/DailyPrediction");

// ===============================
// 🌟 Prokerala API Configuration
// ===============================
const PROKERALA_BASE_URL = "https://api.prokerala.com/v2/astrology/daily-horoscope";
const CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;

// ===============================
// 🔑 Get Access Token from Prokerala
// ===============================
async function getAccessToken() {
  try {
    const res = await axios.post(
      "https://api.prokerala.com/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return res.data.access_token;
  } catch (err) {
    console.error("❌ Failed to get access token:", err.response?.data || err.message);
    throw new Error("Failed to fetch Prokerala token");
  }
}

// ===============================
// 🔮 Fetch Daily Horoscope from Prokerala
// ===============================
async function fetchDailyHoroscope(sign, date = new Date().toISOString().slice(0, 10)) {
  try {
    const token = await getAccessToken();

    const response = await axios.get(PROKERALA_BASE_URL, {
      params: {
        sign: sign.toLowerCase(),
        date,
        scope: "daily",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data?.data || response.data;
    return {
      sign: sign.toUpperCase(),
      date,
      prediction: data.prediction || {},
    };
  } catch (err) {
    console.error("🔥 Prokerala API Error:", err.response?.data || err.message);
    throw new Error("Failed to fetch daily horoscope from Prokerala");
  }
}

// ===============================
// 🧾 POST → Fetch & Save Horoscope
// ===============================
router.post("/fetch", async (req, res) => {
  try {
    const { sign } = req.body;
    if (!sign) {
      return res.status(400).json({ success: false, message: "Zodiac sign is required" });
    }

    const date = new Date().toISOString().slice(0, 10);
    const data = await fetchDailyHoroscope(sign, date);

    // Save to MongoDB
    const saved = await DailyPrediction.create({
      date: data.date,
      title: `Daily Horoscope for ${data.sign}`,
      description: data.prediction.general || "No description available",
      effect: `❤️ Love: ${data.prediction.love || "N/A"} | 💼 Career: ${
        data.prediction.career || "N/A"
      } | 💰 Finance: ${data.prediction.finance || "N/A"} | 🧘 Health: ${
        data.prediction.health || "N/A"
      }`,
    });

    res.status(201).json({
      success: true,
      message: "✅ Daily horoscope fetched successfully!",
      data: saved,
    });
  } catch (err) {
    console.error("❌ Error fetching horoscope:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// 📜 GET → All Saved Predictions
// ===============================
router.get("/", async (req, res) => {
  try {
    const predictions = await DailyPrediction.find().sort({ createdAt: -1 });
    res.json({ success: true, data: predictions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// 🗑️ DELETE → Remove by ID
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    await DailyPrediction.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Prediction deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
