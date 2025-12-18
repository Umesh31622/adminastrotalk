
const Content = require("../models/Content");
const cloudinary = require("../config/cloudinary");

exports.getContent = async (req, res) => {
  try {
    const contents = await Content.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE
exports.createContent = async (req, res) => {
  try {
    const fileUrl = req.file?.path || null;
    const publicId = req.file?.public_id || null;   // FIXED

    const newContent = await Content.create({
      ...req.body,
      tags: req.body.tags ? req.body.tags.split(",") : [],
      fileUrl,
      publicId,
      scheduledDate: req.body.scheduledDate
        ? new Date(req.body.scheduledDate)
        : null,
    });

    res.status(201).json({ success: true, data: newContent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET BY ID
exports.getContentById = async (req, res) => {
  try {
    const item = await Content.findById(req.params.id);
    if (!item)
      return res.status(404).json({ success: false, message: "Not Found" });

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updateContent = async (req, res) => {
  try {
    let fileUrl = req.body.fileUrl;
    let publicId = req.body.publicId;

    if (req.file) {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: "auto",
        });
      }

      fileUrl = req.file.path;
      publicId = req.file.public_id;  // FIXED
    }

    const updated = await Content.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        tags: req.body.tags ? req.body.tags.split(",") : [],
        fileUrl,
        publicId,
        scheduledDate: req.body.scheduledDate
          ? new Date(req.body.scheduledDate)
          : null,
      },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteContent = async (req, res) => {
  try {
    const item = await Content.findById(req.params.id);

    if (!item)
      return res.status(404).json({ success: false, message: "Not Found" });

    if (item.publicId) {
      await cloudinary.uploader.destroy(item.publicId, {
        resource_type: "auto",
      });
    }

    await item.deleteOne();

    res.json({ success: true, message: "Content Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

