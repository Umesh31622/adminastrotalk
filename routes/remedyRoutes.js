// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/upload");
// const Remedy = require("../models/Remedy");

// // GET all remedies with optional search
// router.get("/", async (req, res) => {
//   try {
//     const search = req.query.search;
//     const query = search ? { clientName: { $regex: search, $options: "i" } } : {};
//     const remedies = await Remedy.find(query).sort({ createdAt: -1 });
//     res.json(remedies);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// });

// // GET single remedy by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const remedy = await Remedy.findById(req.params.id);
//     if (!remedy) return res.status(404).json({ message: "Remedy not found" });
//     res.json(remedy);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// });

// // CREATE remedy
// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     const { clientName, email, remedyType, description, status } = req.body;
//     if (!clientName || !email) {
//       return res.status(400).json({ message: "Client Name and Email are required" });
//     }

//     const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

//     const remedy = new Remedy({
//       clientName,
//       email,
//       remedyType,
//       description,
//       status,
//       fileUrl,
//     });

//     await remedy.save();
//     res.status(201).json(remedy);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// });

// // UPDATE remedy
// router.put("/:id", upload.single("file"), async (req, res) => {
//   try {
//     const { clientName, email, remedyType, description, status } = req.body;

//     const updateData = {
//       ...(clientName && { clientName }),
//       ...(email && { email }),
//       ...(remedyType && { remedyType }),
//       ...(description && { description }),
//       ...(status && { status }),
//     };

//     if (req.file) updateData.fileUrl = `/uploads/${req.file.filename}`;

//     const remedy = await Remedy.findByIdAndUpdate(req.params.id, updateData, { new: true });
//     if (!remedy) return res.status(404).json({ message: "Remedy not found" });

//     res.json(remedy);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// });

// // DELETE remedy
// router.delete("/:id", async (req, res) => {
//   try {
//     const remedy = await Remedy.findByIdAndDelete(req.params.id);
//     if (!remedy) return res.status(404).json({ message: "Remedy not found" });

//     res.json({ message: "Remedy deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const cloudUpload = require("../middleware/cloudUpload")("remedies");
const {
  getRemedies,
  createRemedy,
  updateRemedy,
  deleteRemedy,
} = require("../controllers/remedyController");

router.get("/", getRemedies);
router.post("/", cloudUpload.single("file"), createRemedy);
router.put("/:id", cloudUpload.single("file"), updateRemedy);
router.delete("/:id", deleteRemedy);

module.exports = router;
