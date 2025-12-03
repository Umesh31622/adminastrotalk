
// const Remedy = require("../models/Remedy");

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
//       clientName,
//       email,
//       remedyType,
//       description,
//       status,
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
    const query = search
      ? { clientName: { $regex: search, $options: "i" } }
      : {};

    const remedies = await Remedy.find(query).sort({ createdAt: -1 });
    res.json(remedies);
  } catch (err) {
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

    const remedy = await Remedy.create({
      clientName,
      email,
      remedyType,
      description,
      status,
      fileUrl,
    });

    res.status(201).json(remedy);
  } catch (err) {
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
  }
};
