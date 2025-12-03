// backend/controllers/uploadController.js
const Upload = require("../models/Upload");

exports.getUploads = async (req, res) => {
  try {
    const uploads = await Upload.find();
    res.status(200).json({ uploads });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUpload = async (req, res) => {
  try {
    const { uploaderName, fileName, status } = req.body;
    if (!uploaderName || !fileName) return res.status(400).json({ message: "Missing fields" });

    const upload = await Upload.create({ uploaderName, fileName, status: status || "Pending" });
    res.status(201).json({ upload });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
