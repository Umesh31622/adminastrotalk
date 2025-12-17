<<<<<<< HEAD
const KnowMore = require("../models/KnowMore");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

/* CREATE */
exports.createKnowMore = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "PDF required" });

    const upload = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "know-more-pdfs",
    });

    fs.unlinkSync(req.file.path);

    const doc = await KnowMore.create({
      title: req.body.title,
      pdfUrl: upload.secure_url,
      publicId: upload.public_id,
    });

    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* READ */
exports.getKnowMore = async (req, res) => {
  const data = await KnowMore.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
};

/* UPDATE */
exports.updateKnowMore = async (req, res) => {
  try {
    const item = await KnowMore.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    if (req.file) {
      await cloudinary.uploader.destroy(item.publicId, {
        resource_type: "raw",
      });

      const upload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "raw",
        folder: "know-more-pdfs",
      });

      fs.unlinkSync(req.file.path);

      item.pdfUrl = upload.secure_url;
      item.publicId = upload.public_id;
    }

    item.title = req.body.title || item.title;
    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE */
exports.deleteKnowMore = async (req, res) => {
  const item = await KnowMore.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });

  await cloudinary.uploader.destroy(item.publicId, {
    resource_type: "raw",
  });
  await item.deleteOne();

  res.json({ success: true, message: "Deleted" });
};
=======

// // const KnowMore = require("../models/KnowMore");
// // const cloudinary = require("cloudinary").v2;


// // exports.uploadKnowMorePDF = async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ message: "PDF file is required." });
// //     }

// //     const pdfUrl =
// //       req.file.path ||
// //       req.file.secure_url ||
// //       req.file.url ||
// //       (req.file.uploadInfo ? req.file.uploadInfo.secure_url : null);

// //     const cloudinaryId = req.file.filename || req.file.public_id;

// //     if (!pdfUrl) {
// //       return res.status(400).json({ message: "Cloudinary upload failed." });
// //     }

// //     const record = await KnowMore.create({
// //       title: req.body.title,
// //       pdfUrl,
// //       cloudinaryId,
// //     });

// //     res.status(201).json({ success: true, data: record });
// //   } catch (error) {
// //     console.error("Upload Error:", error);
// //     res.status(500).json({ message: "Server Error" });
// //   }
// // };

// // // READ – Get All PDFs
// // exports.getAllPDFs = async (req, res) => {
// //   try {
// //     const data = await KnowMore.find().sort({ createdAt: -1 });
// //     res.json({ success: true, data });
// //   } catch (err) {
// //     res.status(500).json({ message: "Fetch failed" });
// //   }
// // };

// // // UPDATE – Update Title and/or Replace PDF
// // exports.updatePDF = async (req, res) => {
// //   try {
// //     const record = await KnowMore.findById(req.params.id);
// //     if (!record) return res.status(404).json({ message: "Record not found" });

// //     let updatedData = { title: req.body.title || record.title };

// //     // If user uploads a new PDF
// //     if (req.file) {
// //       // Delete old file from Cloudinary
// //       await cloudinary.uploader.destroy(record.cloudinaryId, {
// //         resource_type: "raw",
// //       });

// //       const newUrl =
// //         req.file.path ||
// //         req.file.secure_url ||
// //         req.file.url ||
// //         (req.file.uploadInfo ? req.file.uploadInfo.secure_url : null);

// //       updatedData.pdfUrl = newUrl;
// //       updatedData.cloudinaryId = req.file.filename || req.file.public_id;
// //     }

// //     const updatedRecord = await KnowMore.findByIdAndUpdate(
// //       req.params.id,
// //       updatedData,
// //       { new: true }
// //     );

// //     res.json({ success: true, data: updatedRecord });
// //   } catch (error) {
// //     console.error("Update Error:", error);
// //     res.status(500).json({ message: "Update failed" });
// //   }
// // };

// // // DELETE – Remove PDF from DB + Cloudinary
// // exports.deletePDF = async (req, res) => {
// //   try {
// //     const record = await KnowMore.findById(req.params.id);
// //     if (!record) return res.status(404).json({ message: "Record not found" });

// //     await cloudinary.uploader.destroy(record.cloudinaryId, {
// //       resource_type: "raw",
// //     });

// //     await record.deleteOne();

// //     res.json({ success: true, message: "PDF deleted successfully" });
// //   } catch (error) {
// //     console.error("Delete Error:", error);
// //     res.status(500).json({ message: "Delete failed" });
// //   }
// // };

// const KnowMore = require("../models/KnowMore");
// const cloudinary = require("cloudinary").v2;

// /* ============================================
//    CREATE → Upload PDF
// ============================================ */
// exports.uploadKnowMorePDF = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "PDF file is required." });
//     }

//     // Extract Cloudinary URL + public_id
//     const pdfUrl =
//       req.file.secure_url ||
//       req.file.path ||
//       req.file.url ||
//       (req.file.uploadInfo ? req.file.uploadInfo.secure_url : null);

//     const cloudinaryId = req.file.public_id;

//     if (!pdfUrl || !cloudinaryId) {
//       return res.status(400).json({ message: "Cloudinary upload failed." });
//     }

//     const record = await KnowMore.create({
//       title: req.body.title,
//       pdfUrl,
//       cloudinaryId,
//     });

//     res.status(201).json({
//       success: true,
//       message: "PDF uploaded successfully",
//       data: record,
//     });

//   } catch (error) {
//     console.error("UPLOAD ERROR:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };



// /* ============================================
//    READ → Get All PDFs
// ============================================ */
// exports.getAllPDFs = async (req, res) => {
//   try {
//     const data = await KnowMore.find().sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data,
//     });

//   } catch (error) {
//     console.error("FETCH ERROR:", error);
//     res.status(500).json({ message: "Failed to fetch PDF list" });
//   }
// };



// /* ============================================
//    UPDATE → Update Title + Replace PDF
// ============================================ */
// exports.updatePDF = async (req, res) => {
//   try {
//     const record = await KnowMore.findById(req.params.id);

//     if (!record) {
//       return res.status(404).json({ message: "Record not found" });
//     }

//     let updatedData = {
//       title: req.body.title || record.title,
//     };

//     // If user uploads new file
//     if (req.file) {
//       // Delete old Cloudinary file
//       await cloudinary.uploader.destroy(record.cloudinaryId, {
//         resource_type: "raw",
//       });

//       const newUrl =
//         req.file.secure_url ||
//         req.file.path ||
//         req.file.url ||
//         (req.file.uploadInfo ? req.file.uploadInfo.secure_url : null);

//       updatedData.pdfUrl = newUrl;
//       updatedData.cloudinaryId = req.file.public_id;
//     }

//     const updatedRecord = await KnowMore.findByIdAndUpdate(
//       req.params.id,
//       updatedData,
//       { new: true }
//     );

//     res.json({
//       success: true,
//       message: "PDF updated successfully",
//       data: updatedRecord,
//     });

//   } catch (error) {
//     console.error("UPDATE ERROR:", error);
//     res.status(500).json({ message: "Update failed" });
//   }
// };



// /* ============================================
//    DELETE → Delete PDF From DB + Cloudinary
// ============================================ */
// exports.deletePDF = async (req, res) => {
//   try {
//     const record = await KnowMore.findById(req.params.id);

//     if (!record) {
//       return res.status(404).json({ message: "Record not found" });
//     }

//     // Delete file from Cloudinary
//     await cloudinary.uploader.destroy(record.cloudinaryId, {
//       resource_type: "raw",
//     });

//     // Remove from database
//     await record.deleteOne();

//     res.json({
//       success: true,
//       message: "PDF deleted successfully",
//     });

//   } catch (error) {
//     console.error("DELETE ERROR:", error);
//     res.status(500).json({ message: "Delete failed" });
//   }
// };

const KnowMore = require("../models/KnowMore");
const cloudinary = require("cloudinary").v2;

/* =============================
   CREATE → Upload PDF
============================= */
exports.uploadKnowMorePDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "PDF file is required." });

    const pdfUrl = req.file.path; // Cloudinary URL
    const cloudinaryId = req.file.filename; // Correct public_id

    const record = await KnowMore.create({
      title: req.body.title,
      pdfUrl,
      cloudinaryId,
    });

    res.status(201).json({
      success: true,
      message: "PDF uploaded successfully",
      data: record,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =============================
   READ → Get All
============================= */
exports.getAllPDFs = async (req, res) => {
  try {
    const data = await KnowMore.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch PDF list" });
  }
};

/* =============================
   UPDATE → Title + Replace PDF
============================= */
exports.updatePDF = async (req, res) => {
  try {
    const record = await KnowMore.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    let updatedData = {
      title: req.body.title || record.title,
    };

    // If new file is uploaded
    if (req.file) {
      // delete old cloudinary file
      await cloudinary.uploader.destroy(record.cloudinaryId, {
        resource_type: "raw",
      });

      updatedData.pdfUrl = req.file.path;
      updatedData.cloudinaryId = req.file.filename;
    }

    const updated = await KnowMore.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.json({
      success: true,
      message: "PDF updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

/* =============================
   DELETE → Delete Cloudinary + DB
============================= */
exports.deletePDF = async (req, res) => {
  try {
    const record = await KnowMore.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    await cloudinary.uploader.destroy(record.cloudinaryId, {
      resource_type: "raw",
    });

    await record.deleteOne();

    res.json({ success: true, message: "PDF deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
