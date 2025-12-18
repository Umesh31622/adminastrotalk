
const OurClients = require("../models/OurClients");
const cloudinary = require("../config/cloudinary");

// CREATE
exports.createClient = async (req, res) => {
  try {
    const payload = req.body;

    if (req.file) {
      payload.image = req.file.path; // Cloudinary URL
    } else {
      return res.status(400).json({ success: false, error: "Image required" });
    }

    const saved = await OurClients.create(payload);
    res.json({ success: true, message: "Client added", data: saved });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// READ
exports.getClients = async (req, res) => {
  try {
    const clients = await OurClients.find().sort({ createdAt: -1 });
    res.json({ success: true, clients });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// UPDATE
exports.updateClient = async (req, res) => {
  try {
    const client = await OurClients.findById(req.params.id);
    if (!client)
      return res.status(404).json({ success: false, message: "Not found" });

    let payload = req.body;

    // New image uploaded?
    if (req.file) {
      // old Cloudinary file delete
      const publicId = client.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy("our_clients/" + publicId);

      payload.image = req.file.path; // new Cloudinary URL
    }

    const updated = await OurClients.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });

    res.json({ success: true, message: "Updated", data: updated });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE
exports.deleteClient = async (req, res) => {
  try {
    const client = await OurClients.findById(req.params.id);
    if (!client)
      return res.status(404).json({ success: false, message: "Not found" });

    // Delete from cloud
    const publicId = client.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy("our_clients/" + publicId);

    await OurClients.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

