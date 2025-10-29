// const Trigger = require('../models/Trigger');
// const Template = require('../models/Template');
// const messageController = require('./messageController');

// exports.createTrigger = async (req, res) => {
//   const t = await Trigger.create(req.body);
//   res.json(t);
// };

// exports.getTriggers = async (req, res) => {
//   const triggers = await Trigger.find().populate('template').sort({createdAt:-1});
//   res.json(triggers);
// };

// // simple function to fire trigger programmatically
// exports.fireTrigger = async ({ event, payload }) => {
//   // find triggers for this event
//   const triggers = await Trigger.find({ event, active: true }).populate('template');
//   for (const trig of triggers) {
//     const channel = trig.channel;
//     const template = trig.template;
//     // merge payload into template variables
//     try {
//       await messageController.sendMessage({
//         body: {
//           to: payload.to,
//           channel,
//           templateId: template._id,
//           variables: payload.variables || payload
//         }
//       }, { json: ()=>{} }); // we call internal; note: in production structure this should be shared service
//     } catch (err) {
//       console.error('Trigger firing error', err);
//     }
//   }
// };

const Trigger = require("../models/Trigger");
const Template = require("../models/Template");

// Create or update trigger
exports.createTrigger = async (req, res) => {
  try {
    const { eventType } = req.params;
    const { templateId } = req.body;

    if (!templateId) return res.status(400).json({ success: false, message: "templateId required" });

    // Check if template exists
    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({ success: false, message: "Template not found" });

    // Upsert trigger (create if not exists, update if exists)
    const trigger = await Trigger.findOneAndUpdate(
      { eventType },
      { templateId, createdBy: req.user?._id || null },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: trigger });
  } catch (err) {
    console.error("Trigger Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all triggers
exports.getTriggers = async (req, res) => {
  try {
    const triggers = await Trigger.find().populate("templateId").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: triggers });
  } catch (err) {
    console.error("Get Triggers Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete a trigger
exports.deleteTrigger = async (req, res) => {
  try {
    const { eventType } = req.params;
    const deleted = await Trigger.findOneAndDelete({ eventType });
    if (!deleted) return res.status(404).json({ success: false, message: "Trigger not found" });
    res.json({ success: true, message: "Trigger deleted" });
  } catch (err) {
    console.error("Delete Trigger Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
