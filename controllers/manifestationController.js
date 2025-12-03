const ManifestationService = require("../models/manifestationModel");

// ADD NEW
exports.addService = async (req, res) => {
  try {
    const service = await ManifestationService.create(req.body);
    res.json({ status: true, message: "Service added", service });
  } catch (e) {
    res.json({ status: false, message: e.message });
  }
};

// GET ALL - Manifestation + Wellbeing
exports.getAll = async (req, res) => {
  try {
    const manifestation = await ManifestationService.find({ category: "manifestation" });
    const wellbeing = await ManifestationService.find({ category: "well-being" });

    res.json({ status: true, manifestation, wellbeing });
  } catch (e) {
    res.json({ status: false, message: e.message });
  }
};

// UPDATE
exports.updateService = async (req, res) => {
  try {
    const updated = await ManifestationService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ status: true, message: "Updated", service: updated });
  } catch (e) {
    res.json({ status: false, message: e.message });
  }
};

// DELETE
exports.deleteService = async (req, res) => {
  try {
    await ManifestationService.findByIdAndDelete(req.params.id);
    res.json({ status: true, message: "Deleted" });
  } catch (e) {
    res.json({ status: false, message: e.message });
  }
};
