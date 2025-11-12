const About = require("../models/About");

// 🪐 Get About Us
exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(200).json({
        message: "No About Us content found.",
        data: { title: "About Us", content: "", image: "" },
      });
    }
    res.status(200).json(about);
  } catch (err) {
    res.status(500).json({ message: "Error fetching About Us", error: err.message });
  }
};

// 🪐 Update or Create About Us
exports.updateAbout = async (req, res) => {
  try {
    const { title, content } = req.body;
    let image = "";

    if (req.file) {
      image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    let about = await About.findOne();
    if (!about) about = new About({ title, content, image });
    else {
      about.title = title || about.title;
      about.content = content || about.content;
      if (image) about.image = image;
    }

    await about.save();
    res.status(200).json({ message: "✅ About Us updated successfully", data: about });
  } catch (err) {
    res.status(500).json({ message: "Error updating About Us", error: err.message });
  }
};
