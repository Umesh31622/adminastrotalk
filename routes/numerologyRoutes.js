const express = require("express");
const router = express.Router();
const axios = require("axios");
const Numerology = require("../models/Numerology");
const { calculateNumerology } = require("../utils/prokeralaApi");

/* ===================================================
   🔢 LOCAL CALCULATION HELPERS (Fallback if API fails)
=================================================== */
const letterToNumber = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

const reduceNumber = (num) => {
  while (num > 9 && ![11, 22, 33].includes(num)) {
    num = String(num)
      .split("")
      .reduce((a, b) => a + Number(b), 0);
  }
  return num;
};

const calculateLifePath = (dob) => {
  const digits = dob.replace(/[^0-9]/g, "").split("").map(Number);
  return reduceNumber(digits.reduce((a, b) => a + b, 0));
};

const calculateDestiny = (name) => {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, "");
  const total = letters.split("").reduce((sum, ch) => sum + (letterToNumber[ch] || 0), 0);
  return reduceNumber(total);
};

const calculateSoulUrge = (name) => {
  const vowels = name.toUpperCase().replace(/[^AEIOU]/g, "");
  const total = vowels.split("").reduce((sum, ch) => sum + (letterToNumber[ch] || 0), 0);
  return reduceNumber(total);
};

const calculatePersonality = (name) => {
  const consonants = name.toUpperCase().replace(/[AEIOU]/g, "").replace(/[^A-Z]/g, "");
  const total = consonants.split("").reduce((sum, ch) => sum + (letterToNumber[ch] || 0), 0);
  return reduceNumber(total);
};

const getDescription = (num) => {
  const meanings = {
    1: "Leader, ambitious, and independent.",
    2: "Diplomatic, sensitive, and cooperative.",
    3: "Creative, joyful, and expressive.",
    4: "Disciplined, grounded, and hardworking.",
    5: "Adventurous, curious, and freedom-loving.",
    6: "Caring, nurturing, and responsible.",
    7: "Analytical, spiritual, and introspective.",
    8: "Powerful, ambitious, and practical.",
    9: "Compassionate, wise, and humanitarian.",
    11: "Visionary, spiritual, and intuitive.",
    22: "Master builder and practical visionary.",
    33: "Master healer and compassionate guide.",
  };
  return meanings[num] || "Unique personality with balanced traits.";
};

/* ===================================================
   ⚙️ POST → Calculate Numerology (with Prokerala Integration)
=================================================== */
router.post("/calculate", async (req, res) => {
  try {
    const { name, dateOfBirth } = req.body;

    if (!name || !dateOfBirth)
      return res.status(400).json({ success: false, message: "Name and Date of Birth are required" });

    console.log("🔮 Fetching Numerology from Prokerala...");

    // 🔹 Step 1: Try Prokerala API first
    const apiResult = await calculateNumerology({ name, date: dateOfBirth });

    let numerologyData = {};
    if (apiResult.success && apiResult.data) {
      const data = apiResult.data?.data?.output || apiResult.data?.output || apiResult.data;

      numerologyData = {
        lifePathNumber: data.life_path_number || data.life_path || "-",
        destinyNumber: data.destiny_number || data.destiny || "-",
        soulUrgeNumber: data.soul_urge_number || data.soul_urge || "-",
        personalityNumber: data.personality_number || data.personality || "-",
        description: data.description || getDescription(data.life_path_number),
      };

      console.log("✅ Numerology data fetched from Prokerala API.");
    } else {
      // 🔸 Step 2: Fallback to local calculation
      console.warn("⚠️ Prokerala API failed, using local fallback...");

      numerologyData = {
        lifePathNumber: calculateLifePath(dateOfBirth),
        destinyNumber: calculateDestiny(name),
        soulUrgeNumber: calculateSoulUrge(name),
        personalityNumber: calculatePersonality(name),
        description: getDescription(calculateLifePath(dateOfBirth)),
      };
    }

    // 💾 Save to MongoDB
    const numerology = await Numerology.create({
      name,
      dateOfBirth,
      ...numerologyData,
    });

    res.json({
      success: true,
      source: apiResult.success ? "Prokerala" : "Local",
      numerology,
    });
  } catch (err) {
    console.error("🔥 Numerology Error:", err);
    res.status(500).json({ success: false, message: "Numerology calculation failed", error: err.message });
  }
});

/* ===================================================
   📜 GET → All Numerology Entries
=================================================== */
router.get("/", async (req, res) => {
  try {
    const numerologies = await Numerology.find().sort({ createdAt: -1 });
    res.json({ success: true, data: numerologies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ===================================================
   🗑️ DELETE
=================================================== */
router.delete("/:id", async (req, res) => {
  try {
    await Numerology.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
