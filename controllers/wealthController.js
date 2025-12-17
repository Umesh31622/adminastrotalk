const Wealth = require("../models/WealthContent");
const cloudinary = require("../config/cloudinary");

/* CREATE (ADMIN) */
exports.createWealth = async (req, res) => {
  try {
    const fileUrl = req.file?.path;
    const publicId = req.file?.public_id;

    const item = await Wealth.create({
      title: req.body.title,
      description: req.body.description,
      fileUrl,
      publicId,
    });

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* GET (USER) */
exports.getWealth = async (req, res) => {
  try {
    const items = await Wealth.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* DELETE (ADMIN) */
exports.deleteWealth = async (req, res) => {
  try {
    const item = await Wealth.findById(req.params.id);
    if (item.publicId) {
      await cloudinary.uploader.destroy(item.publicId);
    }
    await item.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};