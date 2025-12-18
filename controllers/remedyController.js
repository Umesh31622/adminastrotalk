


const Remedy = require("../models/Remedy");

/**
 * ===============================
 * GET ALL REMEDIES (ADMIN)
 * ===============================
 */
exports.getRemedies = async (req, res) => {
  try {
    const search = req.query.search;

    const query = search
      ? { clientName: { $regex: search, $options: "i" } }
      : {};

    const remedies = await Remedy.find(query).sort({ createdAt: -1 });
    res.json(remedies);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch remedies" });
  }
};

/**
 * ===============================
 * CREATE REMEDY
 * ===============================
 */
exports.createRemedy = async (req, res) => {
  try {
    const {
      clientName,
      email,
      remedyType,
      description,
      status,
      dateOfDoingRemedy,
      dateOfProductDelivery,
    } = req.body;

    if (!clientName || !email || !dateOfDoingRemedy) {
      return res.status(400).json({
        message: "Client Name, Email and Remedy Date required",
      });
    }

    const fileUrl = req.file ? req.file.path : null;

    const remedy = await Remedy.create({
      clientName,
      email,
      remedyType,
      description,
      status,
      dateOfDoingRemedy: new Date(dateOfDoingRemedy),
      dateOfProductDelivery: dateOfProductDelivery
        ? new Date(dateOfProductDelivery)
        : undefined,
      fileUrl,
    });

    res.status(201).json(remedy);
  } catch (err) {
    res.status(500).json({ message: "Failed to create remedy" });
  }
};

/**
 * ===============================
 * UPDATE REMEDY
 * ===============================
 */
exports.updateRemedy = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.dateOfDoingRemedy)
      updateData.dateOfDoingRemedy = new Date(req.body.dateOfDoingRemedy);

    if (req.body.dateOfProductDelivery)
      updateData.dateOfProductDelivery = new Date(
        req.body.dateOfProductDelivery
      );

    if (req.file) updateData.fileUrl = req.file.path;

    const remedy = await Remedy.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(remedy);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

/**
 * ===============================
 * DELETE REMEDY
 * ===============================
 */
exports.deleteRemedy = async (req, res) => {
  await Remedy.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

/**
 * ===============================
 * CALENDAR EVENTS (ADMIN + USER)
 * ===============================
 */
exports.getRemedyCalendar = async (req, res) => {
  try {
    const email = req.query.email; // user panel ke liye

    const query = email ? { email } : {};
    const remedies = await Remedy.find(query);

    const events = [];

    remedies.forEach((r) => {
      // Remedy date
      events.push({
        title: `${r.clientName} – ${r.remedyType}`,
        date: r.dateOfDoingRemedy,
        color: "#4f46e5",
      });

      // Delivery date
      if (r.dateOfProductDelivery) {
        events.push({
          title: `${r.clientName} – Delivery`,
          date: r.dateOfProductDelivery,
          color: "#16a34a",
        });
      }
    });

    res.json({ events });
  } catch (err) {
    res.status(500).json({ message: "Calendar error" });
  }
};

