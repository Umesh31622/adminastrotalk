const Service = require("../models/Service");

// Create Service
exports.createService = async (req, res) => {
  try {
    const mediaFiles = req.files ? req.files.map(f => f.filename) : [];
    const service = await Service.create({ ...req.body, media: mediaFiles });
    res.status(201).json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get All Services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update Service
exports.updateService = async (req, res) => {
  try {
    const mediaFiles = req.files ? req.files.map(f => f.filename) : [];
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...(mediaFiles.length > 0 && { media: mediaFiles }) },
      { new: true }
    );
    res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete Service
exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
