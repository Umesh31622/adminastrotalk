const express = require("express");
const router = express.Router();
const Numerology = require("../models/Numerology");

// ===== Helper Functions =====
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
  const total = letters
    .split("")
    .reduce((sum, ch) => sum + (letterToNumber[ch] || 0), 0);
  return reduceNumber(total);
};

const calculateSoulUrge = (name) => {
  const vowels = name.toUpperCase().replace(/[^AEIOU]/g, "");
  const total = vowels
    .split("")
    .reduce((sum, ch) => sum + (letterToNumber[ch] || 0), 0);
  return reduceNumber(total);
};

const calculatePersonality = (name) => {
  const consonants = name
    .toUpperCase()
    .replace(/[AEIOU]/g, "")
    .replace(/[^A-Z]/g, "");
  const total = consonants
    .split("")
    .reduce((sum, ch) => sum + (letterToNumber[ch] || 0), 0);
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

// ===== CRUD Routes =====

// ➕ Create / Calculate
router.post("/calculate", async (req, res) => {
  try {
    const { name, dateOfBirth } = req.body;

    const lifePathNumber = calculateLifePath(dateOfBirth);
    const destinyNumber = calculateDestiny(name);
    const soulUrgeNumber = calculateSoulUrge(name);
    const personalityNumber = calculatePersonality(name);
    const description = getDescription(lifePathNumber);

    const numerology = new Numerology({
      name,
      dateOfBirth,
      lifePathNumber,
      destinyNumber,
      soulUrgeNumber,
      personalityNumber,
      description,
    });

    await numerology.save();
    res.json({ success: true, numerology });
  } catch (err) {
    console.error("❌ Error calculating numerology:", err);
    res.status(500).json({ success: false, message: "Calculation failed" });
  }
});

// 📋 Get All
router.get("/", async (req, res) => {
  const numerologies = await Numerology.find().sort({ createdAt: -1 });
  res.json(numerologies);
});

// ✏️ Update
router.put("/:id", async (req, res) => {
  try {
    const updated = await Numerology.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

// ❌ Delete
router.delete("/:id", async (req, res) => {
  await Numerology.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Deleted successfully" });
});

module.exports = router;
