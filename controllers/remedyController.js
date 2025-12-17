
// const Remedy = require("../models/Remedy");

<<<<<<< HEAD
// /**
//  * ===============================
//  * GET ALL REMEDIES
//  * ===============================
//  */
// exports.getRemedies = async (req, res) => {
//   try {
//     const search = req.query.search;

//     const query = search
//       ? { clientName: { $regex: search, $options: "i" } }
//       : {};

//     const remedies = await Remedy.find(query).sort({ createdAt: -1 });

//     res.json(remedies);
//   } catch (err) {
//     res.status(500).json({
//       message: "Failed to fetch remedies",
//       error: err.message,
//     });
//   }
// };

// /**
//  * ===============================
//  * CREATE REMEDY
//  * ===============================
//  */
// exports.createRemedy = async (req, res) => {
//   try {
//     const {
//       clientName,
//       email,
//       remedyType,
//       description,
//       status,
//       dateOfDoingRemedy,
//       dateOfProductDelivery,
//     } = req.body;

//     // ✅ Required validation
//     if (!clientName || !email || !dateOfDoingRemedy) {
//       return res.status(400).json({
//         message: "Client Name, Email and Date of Doing Remedy are required",
//       });
//     }

//     const fileUrl = req.file ? req.file.path : null;

//     const remedy = await Remedy.create({
=======
// // GET all remedies (optional search)
// exports.getRemedies = async (req, res) => {
//   try {
//     const { search } = req.query;
//     let query = {};
//     if (search) {
//       query.clientName = { $regex: search, $options: "i" };
//     }
//     const remedies = await Remedy.find(query).sort({ createdAt: -1 });
//     res.json(remedies);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch remedies", error });
//   }
// };

// // CREATE new remedy
// exports.createRemedy = async (req, res) => {
//   try {
//     const { clientName, email, remedyType, description, status } = req.body;
//     if (!clientName || !email) {
//       return res.status(400).json({ message: "Client Name and Email are required" });
//     }

//     const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

//     const remedy = new Remedy({
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
//       clientName,
//       email,
//       remedyType,
//       description,
//       status,
<<<<<<< HEAD
//       dateOfDoingRemedy: new Date(dateOfDoingRemedy), // ✅ main date
//       dateOfProductDelivery: dateOfProductDelivery
//         ? new Date(dateOfProductDelivery)
//         : undefined,
//       fileUrl,
//     });

//     res.status(201).json(remedy);
//   } catch (err) {
//     res.status(500).json({
//       message: "Failed to create remedy",
//       error: err.message,
//     });
//   }
// };

// /**
//  * ===============================
//  * UPDATE REMEDY
//  * ===============================
//  */
// exports.updateRemedy = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const updateData = {
//       clientName: req.body.clientName,
//       email: req.body.email,
//       remedyType: req.body.remedyType,
//       description: req.body.description,
//       status: req.body.status,
//     };

//     // ✅ Date of Doing Remedy
//     if (req.body.dateOfDoingRemedy) {
//       updateData.dateOfDoingRemedy = new Date(
//         req.body.dateOfDoingRemedy
//       );
//     }

//     // ✅ Date of Product Delivery
//     if (req.body.dateOfProductDelivery) {
//       updateData.dateOfProductDelivery = new Date(
//         req.body.dateOfProductDelivery
//       );
//     }

//     // ✅ File update
//     if (req.file) {
//       updateData.fileUrl = req.file.path;
//     }

//     const updatedRemedy = await Remedy.findByIdAndUpdate(
//       id,
//       updateData,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!updatedRemedy) {
//       return res.status(404).json({
//         message: "Remedy not found",
//       });
//     }

//     res.json(updatedRemedy);
//   } catch (err) {
//     res.status(500).json({
//       message: "Failed to update remedy",
//       error: err.message,
//     });
//   }
// };

// /**
//  * ===============================
//  * DELETE REMEDY
//  * ===============================
//  */
// exports.deleteRemedy = async (req, res) => {
//   try {
//     const remedy = await Remedy.findByIdAndDelete(req.params.id);

//     if (!remedy) {
//       return res.status(404).json({
//         message: "Remedy not found",
//       });
//     }

//     res.json({
//       message: "Remedy deleted successfully",
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Failed to delete remedy",
//       error: err.message,
//     });
//   }
// };
const Remedy = require("../models/Remedy");

/**
 * ===============================
 * GET ALL REMEDIES (ADMIN)
 * ===============================
 */
exports.getRemedies = async (req, res) => {
  try {
    const search = req.query.search;

=======
//       fileUrl,
//     });

//     await remedy.save();
//     res.status(201).json(remedy);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create remedy", error });
//   }
// };

// // UPDATE remedy
// exports.updateRemedy = async (req, res) => {
//   try {
//     const remedy = await Remedy.findById(req.params.id);
//     if (!remedy) return res.status(404).json({ message: "Remedy not found" });

//     const { clientName, email, remedyType, description, status } = req.body;

//     remedy.clientName = clientName || remedy.clientName;
//     remedy.email = email || remedy.email;
//     remedy.remedyType = remedyType || remedy.remedyType;
//     remedy.description = description || remedy.description;
//     remedy.status = status || remedy.status;

//     if (req.file) {
//       remedy.fileUrl = `/uploads/${req.file.filename}`;
//     }

//     const updated = await remedy.save();
//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update remedy", error });
//   }
// };

// // DELETE remedy
// exports.deleteRemedy = async (req, res) => {
//   try {
//     await Remedy.findByIdAndDelete(req.params.id);
//     res.json({ message: "Remedy deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete remedy", error });
//   }
// };

const Remedy = require("../models/Remedy");

// GET all remedies
exports.getRemedies = async (req, res) => {
  try {
    const search = req.query.search;
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
    const query = search
      ? { clientName: { $regex: search, $options: "i" } }
      : {};

    const remedies = await Remedy.find(query).sort({ createdAt: -1 });
    res.json(remedies);
  } catch (err) {
<<<<<<< HEAD
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
=======
    res.status(500).json({ message: "Failed to fetch remedies", error: err.message });
  }
};

// CREATE remedy
exports.createRemedy = async (req, res) => {
  try {
    const { clientName, email, remedyType, description, status } = req.body;

    if (!clientName || !email) {
      return res.status(400).json({ message: "Client Name and Email are required" });
    }

    const fileUrl = req.file ? req.file.path : null; // CLOUDINARY URL
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a

    const remedy = await Remedy.create({
      clientName,
      email,
      remedyType,
      description,
      status,
<<<<<<< HEAD
      dateOfDoingRemedy: new Date(dateOfDoingRemedy),
      dateOfProductDelivery: dateOfProductDelivery
        ? new Date(dateOfProductDelivery)
        : undefined,
=======
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
      fileUrl,
    });

    res.status(201).json(remedy);
  } catch (err) {
<<<<<<< HEAD
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
=======
    res.status(500).json({ message: "Failed to create remedy", error: err.message });
  }
};

// UPDATE remedy
exports.updateRemedy = async (req, res) => {
  try {
    const id = req.params.id;

    const updateData = {
      clientName: req.body.clientName,
      email: req.body.email,
      remedyType: req.body.remedyType,
      description: req.body.description,
      status: req.body.status,
    };

    if (req.file) {
      updateData.fileUrl = req.file.path; // CLOUDINARY URL
    }

    const updated = await Remedy.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Remedy not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update remedy", error: err.message });
  }
};

// DELETE remedy
exports.deleteRemedy = async (req, res) => {
  try {
    const remedy = await Remedy.findByIdAndDelete(req.params.id);
    if (!remedy) return res.status(404).json({ message: "Remedy not found" });

    res.json({ message: "Remedy deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete remedy", error: err.message });
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
  }
};
