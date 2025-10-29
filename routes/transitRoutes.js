// const express = require("express");
// const router = express.Router();
// const Transit = require("../models/Transit");

// // GET all transits
// router.get("/", async (req, res) => {
//   try {
//     const transits = await Transit.find().sort({ createdAt: -1 });
//     res.json(transits);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // POST calculate new transit
// router.post("/calculate", async (req, res) => {
//   try {
//     const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

//     // Placeholder calculation logic
//     const transitData = {
//       sunTransit: "Example Sun Transit",
//       moonTransit: "Example Moon Transit",
//       description: "This is a sample transit prediction based on DOB & TOB",
//     };

//     const newTransit = new Transit({
//       name,
//       dateOfBirth,
//       timeOfBirth,
//       placeOfBirth,
//       transitData,
//     });

//     await newTransit.save();
//     res.json(newTransit);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // PUT update existing transit
// router.put("/:id", async (req, res) => {
//   try {
//     const updated = await Transit.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE transit
// router.delete("/:id", async (req, res) => {
//   try {
//     await Transit.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Transit = require("../models/Transit");

// 🆕 Calculate & Save Transit
router.post("/calculate", async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

    // Example: Simple transit calculation logic
    const sunTransit = "Leo";  // Replace with real calculation
    const moonTransit = "Cancer";
    const description = "Good time for relationships and career.";

    const newTransit = new Transit({
      name,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      transitData: { sunTransit, moonTransit, description },
    });

    await newTransit.save();
    res.status(201).json(newTransit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate transit" });
  }
});

// 📜 Get all saved transits
router.get("/", async (req, res) => {
  try {
    const transits = await Transit.find().sort({ createdAt: -1 });
    res.json(transits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transits" });
  }
});

// ✏️ Update existing
router.put("/:id", async (req, res) => {
  try {
    const transit = await Transit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(transit);
  } catch (err) {
    res.status(500).json({ error: "Failed to update transit" });
  }
});

// ❌ Delete
router.delete("/:id", async (req, res) => {
  try {
    await Transit.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete transit" });
  }
});

module.exports = router;
