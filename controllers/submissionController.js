

const Submission = require("../models/Submission");

exports.createSubmission = async (req, res) => {
  try {
    const { formId, serviceId, userEmail, data } = req.body;
    if (!formId || !data) 
      return res.status(400).json({ success: false, error: "Form ID and data required" });

    const submission = await Submission.create({ formId, serviceId, userEmail, data });
    res.status(201).json({ success: true, submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("formId", "title")      // only get title for form
      .populate("serviceId", "name");   // only get name for service
    res.json({ success: true, submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

