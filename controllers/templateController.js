// const Template = require('../models/Template');

// exports.createTemplate = async (req, res) => {
//   const { name, type, subject, body, variables } = req.body;
//   try {
//     const t = await Template.create({
//       name, type, subject, body, variables, createdBy: req.user?._id
//     });
//     res.json(t);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getTemplates = async (req, res) => {
//   const templates = await Template.find().sort({createdAt:-1});
//   res.json(templates);
// };

// exports.updateTemplate = async (req, res) => {
//   const { id } = req.params;
//   const upd = await Template.findByIdAndUpdate(id, req.body, { new: true });
//   res.json(upd);
// };

// exports.deleteTemplate = async (req, res) => {
//   const { id } = req.params;
//   await Template.findByIdAndDelete(id);
//   res.json({ success: true });
// };


const Template = require("../models/Template");

// Create a new template
exports.createTemplate = async (req, res) => {
  try {
    const { name, type, subject, body, variables } = req.body;

    if (!name || !type || !body) {
      return res
        .status(400)
        .json({ success: false, message: "Name, type, and body are required." });
    }

    const template = await Template.create({
      name,
      type,
      subject,
      body,
      variables,
      createdBy: req.user?._id || null,
    });

    res.status(201).json({
      success: true,
      message: "Template saved successfully.",
      data: template,
    });
  } catch (err) {
    console.error("❌ Template Save Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: err.message });
  }
};

// Get all templates
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: templates });
  } catch (err) {
    console.error("❌ Get Templates Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: err.message });
  }
};

// Update a template
exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Template.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Template not found." });

    res.json({ success: true, message: "Template updated.", data: updated });
  } catch (err) {
    console.error("❌ Update Template Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: err.message });
  }
};

// Delete a template
exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Template.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Template not found." });

    res.json({ success: true, message: "Template deleted successfully." });
  } catch (err) {
    console.error("❌ Delete Template Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: err.message });
  }
};
