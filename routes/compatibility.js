
// const router = require("express").Router();
// const axios = require("axios");
// const Compatibility = require("../models/Compatibility");
// const { calculateCompatibility } = require("../utils/prokeralaApi");

// console.log("✅ Compatibility route loaded successfully");

// // 🌍 Helper: Get coordinates using OpenCage API
// async function getCoordinates(place) {
//   try {
//     const res = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
//       params: {
//         q: place,
//         key: process.env.OPENCAGE_API_KEY,
//         limit: 1,
//       },
//     });

//     if (res.data.results.length > 0) {
//       const { lat, lng } = res.data.results[0].geometry;
//       return { latitude: lat, longitude: lng };
//     }
//   } catch (err) {
//     console.error(`❌ Geocode failed for ${place}:`, err.message);
//   }

//   // fallback coordinates
//   return place.toLowerCase().includes("hisar")
//     ? { latitude: 29.1539, longitude: 75.7229 }
//     : { latitude: 29.3258, longitude: 76.3108 };
// }

// // 🧪 Test Route
// router.get("/test", (req, res) =>
//   res.json({ success: true, message: "Compatibility route working fine ✅" })
// );

// // =========================================================
// // 🔮 POST → Calculate Compatibility (Prokerala Advanced)
// // =========================================================
// router.post("/calculate", async (req, res) => {
//   try {
//     const {
//       boyName,
//       boyDob,
//       boyTob,
//       boyPlace,
//       girlName,
//       girlDob,
//       girlTob,
//       girlPlace,
//     } = req.body;

//     console.log("🟢 Incoming Body:", req.body);

//     // Validate required fields
//     if (
//       !boyName ||
//       !boyDob ||
//       !boyTob ||
//       !boyPlace ||
//       !girlName ||
//       !girlDob ||
//       !girlTob ||
//       !girlPlace
//     ) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Get coordinates
//     const maleCoords = await getCoordinates(boyPlace);
//     const femaleCoords = await getCoordinates(girlPlace);

//     // Format into Date objects
//     const boyDate = new Date(`${boyDob}T${boyTob}:00+05:30`);
//     const girlDate = new Date(`${girlDob}T${girlTob}:00+05:30`);

//     const male = {
//       year: boyDate.getFullYear(),
//       month: boyDate.getMonth() + 1,
//       day: boyDate.getDate(),
//       hour: boyDate.getHours(),
//       minute: boyDate.getMinutes(),
//       latitude: Number(maleCoords.latitude),
//       longitude: Number(maleCoords.longitude),
//     };

//     const female = {
//       year: girlDate.getFullYear(),
//       month: girlDate.getMonth() + 1,
//       day: girlDate.getDate(),
//       hour: girlDate.getHours(),
//       minute: girlDate.getMinutes(),
//       latitude: Number(femaleCoords.latitude),
//       longitude: Number(femaleCoords.longitude),
//     };

//     // Call Prokerala API
//     const result = await calculateCompatibility({ male, female });

//     if (!result.success) {
//       console.error("❌ Prokerala API Error:", result.error);
//       return res
//         .status(502)
//         .json({ error: "Prokerala API failed", details: result.error });
//     }

//     // ✅ Extract deeply nested values safely
//     const raw = result.data?.raw || result.data;
//     const report = raw?.matching_report || raw;

//     const score =
//       report?.total_points ||
//       report?.obtained_points ||
//       raw?.total_points ||
//       0;

//     const maxScore =
//       report?.maximum_points ||
//       raw?.maximum_points ||
//       36;

//     let message =
//       report?.message?.description ||
//       report?.message ||
//       report?.match_result ||
//       "Compatibility calculated successfully ✅";

//     if (typeof message === "object") {
//       message = message?.description || JSON.stringify(message);
//     }

//     console.log(`💞 Compatibility Result → ${score}/${maxScore}: ${message}`);

//     // Save to MongoDB
//     const record = await Compatibility.create({
//       boyName,
//       boyDob,
//       boyTob,
//       boyPlace,
//       girlName,
//       girlDob,
//       girlTob,
//       girlPlace,
//       score,
//       message,
//     });

//     // Final response
//     res.json({
//       success: true,
//       record,
//       source: "Prokerala",
//       score,
//       message,
//     });
//   } catch (err) {
//     console.error("❌ Compatibility Error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // =========================================================
// // 🧾 GET → Fetch all saved compatibility records
// // =========================================================
// router.get("/", async (req, res) => {
//   try {
//     const data = await Compatibility.find().sort({ createdAt: -1 });
//     res.json(data);
//   } catch (err) {
//     console.error("❌ Fetch failed:", err.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // =========================================================
// // ♻️ PUT → Recalculate or Update existing record
// // =========================================================
// router.put("/:id", async (req, res) => {
//   try {
//     const {
//       boyName,
//       boyDob,
//       boyTob,
//       boyPlace,
//       girlName,
//       girlDob,
//       girlTob,
//       girlPlace,
//     } = req.body;

//     const maleCoords = await getCoordinates(boyPlace);
//     const femaleCoords = await getCoordinates(girlPlace);

//     const boyDate = new Date(`${boyDob}T${boyTob}:00+05:30`);
//     const girlDate = new Date(`${girlDob}T${girlTob}:00+05:30`);

//     const male = {
//       year: boyDate.getFullYear(),
//       month: boyDate.getMonth() + 1,
//       day: boyDate.getDate(),
//       hour: boyDate.getHours(),
//       minute: boyDate.getMinutes(),
//       latitude: Number(maleCoords.latitude),
//       longitude: Number(maleCoords.longitude),
//     };

//     const female = {
//       year: girlDate.getFullYear(),
//       month: girlDate.getMonth() + 1,
//       day: girlDate.getDate(),
//       hour: girlDate.getHours(),
//       minute: girlDate.getMinutes(),
//       latitude: Number(femaleCoords.latitude),
//       longitude: Number(femaleCoords.longitude),
//     };

//     const result = await calculateCompatibility({ male, female });

//     if (!result.success) {
//       return res
//         .status(502)
//         .json({ error: "Prokerala API failed", details: result.error });
//     }

//     const raw = result.data?.raw || result.data;
//     const report = raw?.matching_report || raw;

//     const score =
//       report?.total_points ||
//       report?.obtained_points ||
//       raw?.total_points ||
//       0;

//     let message =
//       report?.message?.description ||
//       report?.message ||
//       report?.match_result ||
//       "Compatibility updated successfully ✅";

//     if (typeof message === "object") {
//       message = message?.description || JSON.stringify(message);
//     }

//     const updated = await Compatibility.findByIdAndUpdate(
//       req.params.id,
//       {
//         boyName,
//         boyDob,
//         boyTob,
//         boyPlace,
//         girlName,
//         girlDob,
//         girlTob,
//         girlPlace,
//         score,
//         message,
//       },
//       { new: true }
//     );

//     res.json({ success: true, updated, score, message });
//   } catch (err) {
//     console.error("❌ Update failed:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // =========================================================
// // ❌ DELETE → Remove a record
// // =========================================================
// router.delete("/:id", async (req, res) => {
//   try {
//     await Compatibility.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
//   } catch (err) {
//     console.error("❌ Delete failed:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


// const router = require("express").Router();
// const axios = require("axios");
// const Compatibility = require("../models/Compatibility");
// const { calculateCompatibility } = require("../utils/prokeralaApi");

// console.log("✅ Compatibility route loaded successfully");

// // 🌍 Get coordinates (with fallback)
// async function getCoordinates(place) {
//   try {
//     const res = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
//       params: { q: place, key: process.env.OPENCAGE_API_KEY, limit: 1 },
//     });
//     if (res.data.results.length > 0) {
//       const { lat, lng } = res.data.results[0].geometry;
//       return { latitude: lat, longitude: lng };
//     }
//   } catch (err) {
//     console.error(`❌ Geocode failed for ${place}:`, err.message);
//   }

//   return place.toLowerCase().includes("hisar")
//     ? { latitude: 29.1539, longitude: 75.7229 }
//     : { latitude: 29.3258, longitude: 76.3108 };
// }

// // 🧪 Test route
// router.get("/test", (req, res) =>
//   res.json({ success: true, message: "Compatibility route working fine ✅" })
// );

// // =========================================================
// // 🔮 Calculate Compatibility
// // =========================================================
// router.post("/calculate", async (req, res) => {
//   try {
//     const { boyName, boyDob, boyTob, boyPlace, girlName, girlDob, girlTob, girlPlace } = req.body;
//     console.log("🟢 Incoming Body:", req.body);

//     if (!boyName || !boyDob || !boyTob || !boyPlace || !girlName || !girlDob || !girlTob || !girlPlace) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const maleCoords = await getCoordinates(boyPlace);
//     const femaleCoords = await getCoordinates(girlPlace);

//     const boyDate = new Date(`${boyDob}T${boyTob}:00+05:30`);
//     const girlDate = new Date(`${girlDob}T${girlTob}:00+05:30`);

//     const male = {
//       year: boyDate.getFullYear(),
//       month: boyDate.getMonth() + 1,
//       day: boyDate.getDate(),
//       hour: boyDate.getHours(),
//       minute: boyDate.getMinutes(),
//       latitude: Number(maleCoords.latitude),
//       longitude: Number(maleCoords.longitude),
//     };

//     const female = {
//       year: girlDate.getFullYear(),
//       month: girlDate.getMonth() + 1,
//       day: girlDate.getDate(),
//       hour: girlDate.getHours(),
//       minute: girlDate.getMinutes(),
//       latitude: Number(femaleCoords.latitude),
//       longitude: Number(femaleCoords.longitude),
//     };

//     // 🔮 Calculate compatibility
//     const result = await calculateCompatibility({ male, female });

//     if (!result.success) {
//       console.error("❌ Prokerala API Error:", result.error);
//       return res.status(502).json({ error: "Prokerala API failed", details: result.error });
//     }

//     // ✅ Extract correct score + message
//     const { score, maxScore, message, kutas, boyDosha, girlDosha } = result.data;

//     // 🧾 Log
//     console.log(`💞 Compatibility Result → ${score}/${maxScore}: ${message}`);

//     // Save to MongoDB
//     const record = await Compatibility.create({
//       boyName,
//       boyDob,
//       boyTob,
//       boyPlace,
//       girlName,
//       girlDob,
//       girlTob,
//       girlPlace,
//       score,
//       message,
//     });

//     // Send full response
//     res.json({
//       success: true,
//       source: "Prokerala",
//       score,
//       maxScore,
//       message,
//       kutas,
//       boyDosha,
//       girlDosha,
//       record,
//     });
//   } catch (err) {
//     console.error("❌ Compatibility Error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

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
