
const Content = require("../models/Content");

// Create Content
exports.createContent = async (req, res) => {
  try {
    const { title, type, tags, access, content, scheduledDate } = req.body;

    let fileUrl = "";
    if (req.file) {
      fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const newContent = new Content({
      title,
      type,
      tags: tags ? tags.split(",") : [],
      access: access || "free",
      fileUrl,
      content,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      uploadedBy: req.user?._id,
    });

    await newContent.save();
    res.status(201).json(newContent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get All Content
exports.getContent = async (req, res) => {
  try {
    const contents = await Content.find().sort({ createdAt: -1 });
    res.json({ data: contents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Content
exports.updateContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: "Content not found" });

    const { title, type, tags, access, content: bodyContent, scheduledDate } = req.body;

    if (req.file) {
      content.fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    content.title = title || content.title;
    content.type = type || content.type;
    content.tags = tags ? tags.split(",") : content.tags;
    content.access = access || content.access;
    content.content = bodyContent || content.content;
    content.scheduledDate = scheduledDate ? new Date(scheduledDate) : content.scheduledDate;

    await content.save();
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Content
exports.deleteContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) return res.status(404).json({ message: "Content not found" });
    res.json({ message: "Content deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
