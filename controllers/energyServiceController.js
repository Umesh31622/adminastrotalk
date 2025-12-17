// const EnergyService = require("../models/energyServiceModel");

// // ADD NEW SERVICE
// exports.addService = async (req, res) => {
//   try {
//     const service = await EnergyService.create(req.body);
//     res.json({ status: true, message: "Service added", service });
//   } catch (err) {
//     res.json({ status: false, message: err.message });
//   }
// };

// // GET ALL SERVICES
// exports.getAllServices = async (req, res) => {
//   try {
//     const services = await EnergyService.find().sort({ createdAt: -1 });
//     res.json({ status: true, services });
//   } catch (err) {
//     res.json({ status: false, message: err.message });
//   }
// };

// // DELETE SERVICE
// exports.deleteService = async (req, res) => {
//   try {
//     await EnergyService.findByIdAndDelete(req.params.id);
//     res.json({ status: true, message: "Service deleted" });
//   } catch (err) {
//     res.json({ status: false, message: err.message });
//   }
// };

const EnergyService = require("../models/energyServiceModel");

// ADD NEW SERVICE
exports.addService = async (req, res) => {
  try {
    const service = await EnergyService.create(req.body);
    res.json({ status: true, message: "Service added successfully", service });
  } catch (err) {
    res.json({ status: false, message: err.message });
  }
};

// GET ALL SERVICES
exports.getAllServices = async (req, res) => {
  try {
    const services = await EnergyService.find().sort({ createdAt: -1 });
    res.json({ status: true, services });
  } catch (err) {
    res.json({ status: false, message: err.message });
  }
};

// GET SINGLE SERVICE BY ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await EnergyService.findById(req.params.id);
    if (!service)
      return res.json({ status: false, message: "Service not found" });

    res.json({ status: true, service });
  } catch (err) {
    res.json({ status: false, message: err.message });
  }
};

// UPDATE SERVICE
exports.updateService = async (req, res) => {
  try {
    const updatedService = await EnergyService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedService)
      return res.json({ status: false, message: "Service not found" });

    res.json({
      status: true,
      message: "Service updated successfully",
      updatedService,
    });
  } catch (err) {
    res.json({ status: false, message: err.message });
  }
};

// DELETE SERVICE
exports.deleteService = async (req, res) => {
  try {
    const deleted = await EnergyService.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.json({ status: false, message: "Service not found" });

    res.json({ status: true, message: "Service deleted successfully" });
  } catch (err) {
    res.json({ status: false, message: err.message });
  }
};
