
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
