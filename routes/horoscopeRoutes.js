// const express = require("express");
// const router = express.Router();
// const Horoscope = require("../models/Horoscope");

// // Helper: very basic placeholder calculation (replace with real astro logic or API)
// function basicHoroscopeCalc({ dateOfBirth, timeOfBirth }) {
//   // This is simplistic: derive a "sunSign" from month/day only.
//   // Replace with Swiss Ephemeris or external API for real accuracy.
//   const birthDate = new Date(`${dateOfBirth}T${timeOfBirth}`);
//   const day = birthDate.getUTCDate();
//   const month = birthDate.getUTCMonth() + 1;

//   let sunSign = "";
//   if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) sunSign = "Aries";
//   else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) sunSign = "Taurus";
//   else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) sunSign = "Gemini";
//   else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) sunSign = "Cancer";
//   else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) sunSign = "Leo";
//   else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) sunSign = "Virgo";
//   else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) sunSign = "Libra";
//   else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) sunSign = "Scorpio";
//   else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) sunSign = "Sagittarius";
//   else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) sunSign = "Capricorn";
//   else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) sunSign = "Aquarius";
//   else sunSign = "Pisces";

//   // Very simple placeholders:
//   const moonSign = "Moon-" + sunSign; // placeholder
//   const ascendant = "Asc-" + sunSign; // placeholder

//   const description = `Sun: ${sunSign}. Moon likely ${moonSign}. Ascendant approx ${ascendant}. (Basic calc — replace with real algorithm/API)`;

//   return { sunSign, moonSign, ascendant, description };
// }

// // POST /api/horoscopes/calculate  => calculate & save
// router.post("/calculate", async (req, res) => {
//   try {
//     const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;
//     if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // Run calculation (replace with your real logic if available)
//     const calc = basicHoroscopeCalc({ dateOfBirth, timeOfBirth });

//     const newHoroscope = new Horoscope({
//       name,
//       dateOfBirth,
//       timeOfBirth,
//       placeOfBirth,
//       sunSign: calc.sunSign,
//       moonSign: calc.moonSign,
//       ascendant: calc.ascendant,
//       description: calc.description,
//     });

//     await newHoroscope.save();
//     res.status(201).json(newHoroscope);
//   } catch (err) {
//     console.error("Horoscope calculate error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // GET /api/horoscopes  => list all
// router.get("/", async (req, res) => {
//   try {
//     const list = await Horoscope.find().sort({ createdAt: -1 });
//     res.json(list);
//   } catch (err) {
//     console.error("Horoscope list error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // PUT /api/horoscopes/:id => update (recalculate if date/time changed)
// router.put("/:id", async (req, res) => {
//   try {
//     const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;
//     let updatedFields = { name, dateOfBirth, timeOfBirth, placeOfBirth };

//     // If date/time present, re-run basic calc
//     if (dateOfBirth && timeOfBirth) {
//       const calc = basicHoroscopeCalc({ dateOfBirth, timeOfBirth });
//       updatedFields = {
//         ...updatedFields,
//         sunSign: calc.sunSign,
//         moonSign: calc.moonSign,
//         ascendant: calc.ascendant,
//         description: calc.description,
//       };
//     }

//     const updated = await Horoscope.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
//     res.json(updated);
//   } catch (err) {
//     console.error("Horoscope update error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // DELETE /api/horoscopes/:id => delete
// router.delete("/:id", async (req, res) => {
//   try {
//     await Horoscope.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
//   } catch (err) {
//     console.error("Horoscope delete error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;
// routes/horoscopeRoutes.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Horoscope = require("../models/Horoscope"); // MongoDB model

// Load environment variables
const {
  PROKERALA_CLIENT_ID,
  PROKERALA_CLIENT_SECRET,
  PROKERALA_TOKEN_URL,
  PROKERALA_BASE_URL,
} = process.env;

// ---------- Helper: Get Prokerala Access Token ----------
async function getAccessToken() {
  try {
    const res = await axios.post(
      PROKERALA_TOKEN_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: PROKERALA_CLIENT_ID,
        client_secret: PROKERALA_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return res.data.access_token;
  } catch (err) {
    console.error("❌ Failed to get access token:", err.response?.data || err.message);
    throw new Error("Failed to get Prokerala access token");
  }
}

// ---------- @POST Calculate & Save Horoscope ----------
router.post("/calculate", async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;
    if (!dateOfBirth || !timeOfBirth || !placeOfBirth) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const token = await getAccessToken();

    // API call to Prokerala Horoscope endpoint
    const response = await axios.get(`${PROKERALA_BASE_URL}/astrology/horoscope/daily`, {
      params: {
        datetime: `${dateOfBirth}T${timeOfBirth}`,
        coordinates: placeOfBirth, // or lat/long if you have it
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    const horoscopeData = {
      name,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      result: response.data,
    };

    const saved = await Horoscope.create(horoscopeData);
    res.json(saved);
  } catch (err) {
    console.error("🔥 Horoscope calculation failed:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Horoscope calculation failed" });
  }
});

// ---------- @GET All Horoscopes ----------
router.get("/", async (req, res) => {
  try {
    const data = await Horoscope.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch horoscopes" });
  }
});

// ---------- @PUT Update Horoscope ----------
router.put("/:id", async (req, res) => {
  try {
    const updated = await Horoscope.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
});

// ---------- @DELETE Horoscope ----------
router.delete("/:id", async (req, res) => {
  try {
    await Horoscope.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
});

module.exports = router;
