// const ManifestationService = require("../models/manifestationModel");

// // ADD NEW
// exports.addService = async (req, res) => {
//   try {
//     const service = await ManifestationService.create(req.body);
//     res.json({ status: true, message: "Service added", service });
//   } catch (e) {
//     res.json({ status: false, message: e.message });
//   }
// };

// // GET ALL - Manifestation + Wellbeing
// exports.getAll = async (req, res) => {
//   try {
//     const manifestation = await ManifestationService.find({ category: "manifestation" });
//     const wellbeing = await ManifestationService.find({ category: "well-being" });

//     res.json({ status: true, manifestation, wellbeing });
//   } catch (e) {
//     res.json({ status: false, message: e.message });
//   }
// };

// // UPDATE
// exports.updateService = async (req, res) => {
//   try {
//     const updated = await ManifestationService.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json({ status: true, message: "Updated", service: updated });
//   } catch (e) {
//     res.json({ status: false, message: e.message });
//   }
// };

// // DELETE
// exports.deleteService = async (req, res) => {
//   try {
//     await ManifestationService.findByIdAndDelete(req.params.id);
//     res.json({ status: true, message: "Deleted" });
//   } catch (e) {
//     res.json({ status: false, message: e.message });
//   }
// };
const ManifestationService = require("../models/manifestationModel");

/**
 * =========================
 * ADD NEW SERVICE
 * =========================
 */
exports.addService = async (req, res) => {
  try {
    const {
      label,
      description,
      fullDesc,
      deliverable,
      price,
      category,
    } = req.body;

    // ✅ BASIC VALIDATION
    if (!label || price === undefined) {
      return res.json({
        status: false,
        message: "Label and Price are required",
      });
    }

    if (isNaN(price)) {
      return res.json({
        status: false,
        message: "Price must be a number",
      });
    }

    const service = await ManifestationService.create({
      label,
      description,
      fullDesc,
      deliverable,
      price: Number(price), // ✅ ensure number
      category,
    });

    res.json({
      status: true,
      message: "Service added successfully",
      service,
    });
  } catch (e) {
    res.json({
      status: false,
      message: e.message,
    });
  }
};

/**
 * =========================
 * GET ALL SERVICES
 * (Manifestation + Well-being)
 * =========================
 */
exports.getAll = async (req, res) => {
  try {
    const manifestation = await ManifestationService.find({
      category: "manifestation",
    }).sort({ createdAt: -1 });

    const wellbeing = await ManifestationService.find({
      category: "well-being",
    }).sort({ createdAt: -1 });

    res.json({
      status: true,
      manifestation,
      wellbeing,
    });
  } catch (e) {
    res.json({
      status: false,
      message: e.message,
    });
  }
};

/**
 * =========================
 * UPDATE SERVICE
 * =========================
 */
exports.updateService = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // ✅ ensure price remains number
    if (updateData.price !== undefined) {
      if (isNaN(updateData.price)) {
        return res.json({
          status: false,
          message: "Price must be a number",
        });
      }
      updateData.price = Number(updateData.price);
    }

    const updated = await ManifestationService.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.json({
        status: false,
        message: "Service not found",
      });
    }

    res.json({
      status: true,
      message: "Service updated successfully",
      service: updated,
    });
  } catch (e) {
    res.json({
      status: false,
      message: e.message,
    });
  }
};

/**
 * =========================
 * DELETE SERVICE
 * =========================
 */
exports.deleteService = async (req, res) => {
  try {
    const deleted = await ManifestationService.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
      return res.json({
        status: false,
        message: "Service not found",
      });
    }

    res.json({
      status: true,
      message: "Service deleted successfully",
    });
  } catch (e) {
    res.json({
      status: false,
      message: e.message,
    });
  }
};
