
const router = require("express").Router();
const axios = require("axios");
const Compatibility = require("../models/Compatibility");
const { calculateCompatibility } = require("../utils/prokeralaApi");

console.log("✅ Compatibility route loaded successfully");

// 🌍 Get coordinates from OpenCage API
async function getCoordinates(place) {
  try {
    const res = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
      params: {
        q: place,
        key: process.env.OPENCAGE_API_KEY,
        limit: 1,
      },
    });

    if (res.data.results.length > 0) {
      const { lat, lng } = res.data.results[0].geometry;
      return { latitude: lat, longitude: lng };
    }
  } catch (err) {
    console.error(`❌ Geocode failed for ${place}:`, err.message);
  }

  // 🔁 Fallback coordinates (in case API fails)
  if (place.toLowerCase().includes("hisar"))
    return { latitude: 29.1539, longitude: 75.7229 };
  if (place.toLowerCase().includes("jind"))
    return { latitude: 29.3258, longitude: 76.3108 };
  if (place.toLowerCase().includes("delhi"))
    return { latitude: 28.6139, longitude: 77.209 };
  return { latitude: 28.6, longitude: 77.2 }; // default India center
}

// 🧪 Test route
router.get("/test", (req, res) =>
  res.json({ success: true, message: "Compatibility API working fine ✅" })
);

// =========================================================
// 🔮 POST → Calculate Compatibility & Save in DB
// =========================================================
router.post("/calculate", async (req, res) => {
  try {
    const {
      boyName,
      boyDob,
      boyTob,
      boyPlace,
      girlName,
      girlDob,
      girlTob,
      girlPlace,
    } = req.body;

    console.log("🟢 Incoming Body:", req.body);

    // Validation
    if (
      !boyName ||
      !boyDob ||
      !boyTob ||
      !boyPlace ||
      !girlName ||
      !girlDob ||
      !girlTob ||
      !girlPlace
    ) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    // 📍 Get coordinates for both
    const maleCoords = await getCoordinates(boyPlace);
    const femaleCoords = await getCoordinates(girlPlace);

    const boyDate = new Date(`${boyDob}T${boyTob}:00+05:30`);
    const girlDate = new Date(`${girlDob}T${girlTob}:00+05:30`);

    const male = {
      year: boyDate.getFullYear(),
      month: boyDate.getMonth() + 1,
      day: boyDate.getDate(),
      hour: boyDate.getHours(),
      minute: boyDate.getMinutes(),
      latitude: Number(maleCoords.latitude),
      longitude: Number(maleCoords.longitude),
    };

    const female = {
      year: girlDate.getFullYear(),
      month: girlDate.getMonth() + 1,
      day: girlDate.getDate(),
      hour: girlDate.getHours(),
      minute: girlDate.getMinutes(),
      latitude: Number(femaleCoords.latitude),
      longitude: Number(femaleCoords.longitude),
    };

    // 🔮 Call Prokerala API
    const result = await calculateCompatibility({ male, female });

    if (!result.success) {
      console.error("❌ Prokerala API Error:", result.error);
      return res
        .status(502)
        .json({ success: false, error: "Prokerala API failed" });
    }

    // ✅ Extract result data
    const { score, maxScore, message, kutas, boyDosha, girlDosha } =
      result.data;

    console.log(`💞 Compatibility → ${score}/${maxScore}: ${message}`);

    // ✅ Save record in MongoDB
    const record = await Compatibility.create({
      boyName,
      boyDob,
      boyTob,
      boyPlace,
      girlName,
      girlDob,
      girlTob,
      girlPlace,
      score,
      message,
    });

    res.json({
      success: true,
      source: "Prokerala",
      score,
      maxScore,
      message,
      kutas,
      boyDosha,
      girlDosha,
      record,
    });
  } catch (err) {
    console.error("❌ Compatibility Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// =========================================================
// 📜 GET → All Records
// =========================================================
router.get("/", async (req, res) => {
  try {
    const records = await Compatibility.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch records" });
  }
});

// =========================================================
// 🗑️ DELETE → Remove record
// =========================================================
router.delete("/:id", async (req, res) => {
  try {
    await Compatibility.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

