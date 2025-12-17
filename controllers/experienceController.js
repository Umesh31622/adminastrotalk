const Experience = require("../models/Experience");
const cloudinary = require("cloudinary").v2;

/* ================= UPLOAD EXPERIENCE PDF ================= */
exports.uploadExperience = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file required" });
    }

    const record = await Experience.create({
      title: req.body.title,
      description: req.body.description,
      pdfUrl: req.file.path,       // ✅ correct cloudinary URL
      cloudinaryId: req.file.filename, // ✅ public_id
    });

    res.status(201).json({
      success: true,
      message: "Experience uploaded",
      data: record,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

/* ================= GET ALL ================= */
exports.getExperiences = async (req, res) => {
  try {
    const data = await Experience.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

/* ================= DELETE ================= */
exports.deleteExperience = async (req, res) => {
  try {
    const record = await Experience.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Not found" });

    await cloudinary.uploader.destroy(record.cloudinaryId, {
      resource_type: "raw",
    });

    await record.deleteOne();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
