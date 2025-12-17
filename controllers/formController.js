
// const Form = require("../models/Form");

// // Create a new form
// exports.createForm = async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const form = await Form.create({ title, fields });
//     res.status(201).json({ success: true, form });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // Get all forms
// exports.getAllForms = async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.json({ success: true, forms });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // Delete a form by ID
// exports.deleteForm = async (req, res) => {
//   try {
//     const form = await Form.findById(req.params.id);
//     if (!form) return res.status(404).json({ success: false, message: "Form not found" });

//     await Form.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: "Form deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };
const Form = require("../models/Form");

// Create form
exports.createForm = async (req, res) => {
  try {
    const { title, serviceId, fields } = req.body;

    if (!title || !fields || !Array.isArray(fields))
      return res.status(400).json({ success: false, message: "Invalid data" });

    const form = await Form.create({ title, serviceId, fields });
    res.status(201).json({ success: true, form });
  } catch (err) {
    console.error("Form creation error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// Get all forms
exports.getAllForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.json({ success: true, forms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete form
exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ success: false, message: "Form not found" });
    await Form.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Form deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
