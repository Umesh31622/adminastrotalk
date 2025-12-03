const About = require("../models/About");

// 🟢 GET About
exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(200).json({
        message: "No About Us found",
        data: { title: "", content: "", image: "" },
      });
    }

    res.status(200).json(about);
  } catch (err) {
    res.status(500).json({ message: "Error fetching About Us", error: err.message });
  }
};

// 🟡 UPDATE/CREATE About
exports.updateAbout = async (req, res) => {
  try {
    const { title, content } = req.body;

    let image = "";

    // ⭐ FIXED FOR CLOUDINARY
    if (req.file) {
      image = req.file.path || req.file.secure_url;
    }

    let about = await About.findOne();

    if (!about) {
      about = new About({ title, content, image });
    } else {
      about.title = title || about.title;
      about.content = content || about.content;

      if (image) about.image = image; // overwrite only if new file
    }

    await about.save();

    return res.status(200).json({
      message: "About updated successfully",
      data: about,
    });

  } catch (err) {
    res.status(500).json({ message: "Error updating About Us", error: err.message });
  }
};

// 🔴 DELETE
exports.deleteAbout = async (req, res) => {
  try {
    await About.deleteMany({});
    res.status(200).json({ message: "About Us deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting About Us", error: err.message });
  }
};
