const KnowMore = require("../models/KnowMore");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

/* CREATE */
exports.createKnowMore = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "PDF required" });

    const upload = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "know-more-pdfs",
    });

    fs.unlinkSync(req.file.path);

    const doc = await KnowMore.create({
      title: req.body.title,
      pdfUrl: upload.secure_url,
      publicId: upload.public_id,
    });

    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* READ */
exports.getKnowMore = async (req, res) => {
  const data = await KnowMore.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
};

/* UPDATE */
exports.updateKnowMore = async (req, res) => {
  try {
    const item = await KnowMore.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    if (req.file) {
      await cloudinary.uploader.destroy(item.publicId, {
        resource_type: "raw",
      });

      const upload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "raw",
        folder: "know-more-pdfs",
      });

      fs.unlinkSync(req.file.path);

      item.pdfUrl = upload.secure_url;
      item.publicId = upload.public_id;
    }

    item.title = req.body.title || item.title;
    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE */
exports.deleteKnowMore = async (req, res) => {
  const item = await KnowMore.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });

  await cloudinary.uploader.destroy(item.publicId, {
    resource_type: "raw",
  });
  await item.deleteOne();

  res.json({ success: true, message: "Deleted" });
};
