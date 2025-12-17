// const RemedyJourney = require("../models/RemedyJourney");

// /* GET ALL */
// exports.getAll = async (req, res) => {
//   try {
//     const data = await RemedyJourney.find()
//       .populate("user", "name email phone")
//       .sort({ createdAt: -1 });

//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* CREATE */
// exports.create = async (req, res) => {
//   try {
//     const remedy = await RemedyJourney.create(req.body);
//     res.status(201).json(remedy);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* UPDATE STATUS */
// exports.updateStatus = async (req, res) => {
//   try {
//     const updated = await RemedyJourney.findByIdAndUpdate(
//       req.params.id,
//       {
//         status: req.body.status,
//         lastActivity: new Date(),
//       },
//       { new: true }
//     );

//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* DELETE */
// exports.remove = async (req, res) => {
//   try {
//     await RemedyJourney.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ================= USER PANEL ================= */
// /* GET LOGGED-IN USER REMEDIES */
// exports.getUserRemedies = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     const data = await RemedyJourney.find({ user: userId })
//       .populate("user", "name email phone")
//       .sort({ createdAt: -1 });

//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
const RemedyJourney = require("../models/RemedyJourney");

/* ================= ADMIN ================= */

/* GET ALL */
exports.getAll = async (req, res) => {
  try {
    const data = await RemedyJourney.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* CREATE */
exports.create = async (req, res) => {
  try {
    const remedy = await RemedyJourney.create(req.body);
    res.status(201).json(remedy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE STATUS */
exports.updateStatus = async (req, res) => {
  try {
    const updated = await RemedyJourney.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        lastActivity: new Date(),
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE */
exports.remove = async (req, res) => {
  try {
    await RemedyJourney.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= USER PANEL ================= */
/* GET USER REMEDIES BY EMAIL */
exports.getUserRemediesByEmail = async (req, res) => {
  try {
    const email = req.params.email;

    const data = await RemedyJourney.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    const filtered = data.filter(
      (r) => r.user && r.user.email === email
    );

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
