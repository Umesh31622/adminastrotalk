const express = require("express");
const router = express.Router();
const axios = require("axios");
const Manglik = require("../models/Manglik");
const { getCoordinates } = require("../utils/geocode");

const PROKERAL_API_URL = "https://api.prokerala.com/v2/astrology/manglik"; // Correct endpoint
const PROKERAL_API_KEY = process.env.PROKERAL_API_KEY;

// Helper function to call Prokerala API
const calculateManglik = async (date, time, latitude, longitude) => {
  try {
    const [year, month, day] = date.split("-").map(Number);       // YYYY-MM-DD
    const [hour, minute] = time.split(":").map(Number);           // HH:MM

    const response = await axios.post(
      PROKERAL_API_URL,
      {
        day,
        month,
        year,
        hour,
        minute,
        latitude,
        longitude
      },
      {
        headers: {
          Authorization: `Bearer ${PROKERAL_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Prokerala API call failed:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// POST /api/manglik/calculate
router.post("/calculate", async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;
    if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth)
      return res.status(400).json({ error: "All fields are required" });

    // Get coordinates of place
    const { latitude, longitude } = await getCoordinates(placeOfBirth);

    // Call Prokerala API
    const result = await calculateManglik(dateOfBirth, timeOfBirth, latitude, longitude);
    if (!result.success) return res.status(500).json({ error: "Prokerala API failed", detail: result.error });

    // Save to DB
    const record = new Manglik({
      name,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      latitude,
      longitude,
      result: result.data
    });
    await record.save();

    res.json({ success: true, data: record });
  } catch (err) {
    console.error("Manglik calculation error:", err.message);
    res.status(500).json({ error: "Calculation failed" });
  }
});

// GET all records
router.get("/", async (req, res) => {
  try {
    const records = await Manglik.find().sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE record
router.delete("/:id", async (req, res) => {
  try {
    await Manglik.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
