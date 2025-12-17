
// const Content = require("../models/Content");

// // Create Content
// exports.createContent = async (req, res) => {
//   try {
//     const { title, type, tags, access, content, scheduledDate } = req.body;

//     let fileUrl = "";
//     if (req.file) {
//       fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//     }

//     const newContent = new Content({
//       title,
//       type,
//       tags: tags ? tags.split(",") : [],
//       access: access || "free",
//       fileUrl,
//       content,
//       scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
//       uploadedBy: req.user?._id,
//     });

//     await newContent.save();
//     res.status(201).json(newContent);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Get All Content
// exports.getContent = async (req, res) => {
//   try {
//     const contents = await Content.find().sort({ createdAt: -1 });
//     res.json({ data: contents });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Update Content
// exports.updateContent = async (req, res) => {
//   try {
//     const content = await Content.findById(req.params.id);
//     if (!content) return res.status(404).json({ message: "Content not found" });

//     const { title, type, tags, access, content: bodyContent, scheduledDate } = req.body;

//     if (req.file) {
//       content.fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//     }

//     content.title = title || content.title;
//     content.type = type || content.type;
//     content.tags = tags ? tags.split(",") : content.tags;
//     content.access = access || content.access;
//     content.content = bodyContent || content.content;
//     content.scheduledDate = scheduledDate ? new Date(scheduledDate) : content.scheduledDate;

//     await content.save();
//     res.json(content);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Delete Content
// exports.deleteContent = async (req, res) => {
//   try {
//     const content = await Content.findByIdAndDelete(req.params.id);
//     if (!content) return res.status(404).json({ message: "Content not found" });
//     res.json({ message: "Content deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// const Content = require("../models/Content");
// const cloudinary = require("../config/cloudinary");

// // ===============================
// // Get All Content
// // ===============================
// exports.getContent = async (req, res) => {
//   try {
//     const contents = await Content.find().sort({ createdAt: -1 });

//     res.json({ success: true, data: contents });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch content",
//       error: error.message,
//     });
//   }
// };

// // ===============================
// // Create Content (Cloudinary Upload)
// // ===============================
// exports.createContent = async (req, res) => {
//   try {
//     const fileUrl = req.file ? req.file.path : null; // cloudinary URL

//     const newContent = new Content({
//       ...req.body,
//       tags: req.body.tags ? req.body.tags.split(",") : [],
//       fileUrl,
//       scheduledDate: req.body.scheduledDate
//         ? new Date(req.body.scheduledDate)
//         : null,
//     });

//     await newContent.save();

//     res.status(201).json({ success: true, data: newContent });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create content",
//       error: error.message,
//     });
//   }
// };

// // ===============================
// // Get Content By ID
// // ===============================
// exports.getContentById = async (req, res) => {
//   try {
//     const content = await Content.findById(req.params.id);

//     if (!content)
//       return res
//         .status(404)
//         .json({ success: false, message: "Content not found" });

//     res.json({ success: true, data: content });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch content",
//       error: error.message,
//     });
//   }
// };

// // ===============================
// // Update Content (Delete Old + Upload New)
// // ===============================
// exports.updateContent = async (req, res) => {
//   try {
//     let fileUrl = req.body.fileUrl;

//     if (req.file) {
//       fileUrl = req.file.path; // new Cloudinary file

//       // delete old file from cloudinary
//       if (req.body.oldFileUrl) {
//         const publicId = req.body.oldFileUrl.split("/").pop().split(".")[0];

//         await cloudinary.uploader.destroy(publicId, {
//           resource_type: "auto",
//         });
//       }
//     }

//     const updatedContent = await Content.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...req.body,
//         tags: req.body.tags ? req.body.tags.split(",") : [],
//         fileUrl,
//         scheduledDate: req.body.scheduledDate
//           ? new Date(req.body.scheduledDate)
//           : null,
//       },
//       { new: true }
//     );

//     res.json({ success: true, data: updatedContent });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update content",
//       error: error.message,
//     });
//   }
// };

// // ===============================
// // Delete Content (Delete from Cloudinary Too)
// // ===============================
// exports.deleteContent = async (req, res) => {
//   try {
//     const item = await Content.findById(req.params.id);

//     if (!item)
//       return res
//         .status(404)
//         .json({ success: false, message: "Content not found" });

//     if (item.fileUrl) {
//       const publicId = item.fileUrl.split("/").pop().split(".")[0];

//       await cloudinary.uploader.destroy(publicId, {
//         resource_type: "auto",
//       });
//     }

//     await Content.findByIdAndDelete(req.params.id);

//     res.json({ success: true, message: "Content deleted successfully" });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete content",
//       error: error.message,
//     });
//   }
// };

// const Content = require("../models/Content");
// const cloudinary = require("../config/cloudinary");


// // ===============================
// // Get All Content
// // ===============================
// exports.getContent = async (req, res) => {
//   try {
//     const contents = await Content.find().sort({ createdAt: -1 });
//     res.json({ success: true, data: contents });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch content",
//       error: error.message,
//     });
//   }
// };


// // ===============================
// // Create Content (Cloudinary Upload)
// // ===============================
// exports.createContent = async (req, res) => {
//   try {
//     const fileUrl = req.file ? req.file.secure_url : null; 
//     const publicId = req.file ? req.file.filename : null;

//     const newContent = new Content({
//       ...req.body,
//       tags: req.body.tags ? req.body.tags.split(",") : [],
//       fileUrl,
//       publicId,
//       scheduledDate: req.body.scheduledDate
//         ? new Date(req.body.scheduledDate)
//         : null,
//     });

//     await newContent.save();

//     res.status(201).json({ success: true, data: newContent });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create content",
//       error: error.message,
//     });
//   }
// };


// // ===============================
// // Get Content By ID
// // ===============================
// exports.getContentById = async (req, res) => {
//   try {
//     const content = await Content.findById(req.params.id);

//     if (!content)
//       return res
//         .status(404)
//         .json({ success: false, message: "Content not found" });

//     res.json({ success: true, data: content });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch content",
//       error: error.message,
//     });
//   }
// };


// // ===============================
// // Update Content (Delete Old + Upload New)
// // ===============================
// exports.updateContent = async (req, res) => {
//   try {
//     let fileUrl = req.body.fileUrl;
//     let publicId = req.body.publicId;

//     if (req.file) {
//       fileUrl = req.file.secure_url;
//       publicId = req.file.filename;

//       // Delete old file
//       if (req.body.publicId) {
//         await cloudinary.uploader.destroy(req.body.publicId, {
//           resource_type: "auto",
//         });
//       }
//     }

//     const updatedContent = await Content.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...req.body,
//         tags: req.body.tags ? req.body.tags.split(",") : [],
//         fileUrl,
//         publicId,
//         scheduledDate: req.body.scheduledDate
//           ? new Date(req.body.scheduledDate)
//           : null,
//       },
//       { new: true }
//     );

//     res.json({ success: true, data: updatedContent });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update content",
//       error: error.message,
//     });
//   }
// };


// // ===============================
// // Delete Content (Delete from Cloudinary Too)
// // ===============================
// exports.deleteContent = async (req, res) => {
//   try {
//     const item = await Content.findById(req.params.id);

//     if (!item)
//       return res
//         .status(404)
//         .json({ success: false, message: "Content not found" });

//     // Delete from Cloudinary
//     if (item.publicId) {
//       await cloudinary.uploader.destroy(item.publicId, {
//         resource_type: "auto",
//       });
//     }

//     await Content.findByIdAndDelete(req.params.id);

//     res.json({ success: true, message: "Content deleted successfully" });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete content",
//       error: error.message,
//     });
//   }
// };

// const Content = require("../models/Content");
// const cloudinary = require("../config/cloudinary");

// // ================= Get All =================
// exports.getContent = async (req, res) => {
//   try {
//     const contents = await Content.find().sort({ createdAt: -1 });
//     res.json({ success: true, data: contents });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ================= Create =================
// exports.createContent = async (req, res) => {
//   try {
//     const fileUrl = req.file?.path || null;          // <-- REAL CLOUDINARY URL
//     const publicId = req.file?.filename || null;     // <-- REAL PUBLIC ID

//     const newContent = await Content.create({
//       ...req.body,
//       tags: req.body.tags ? req.body.tags.split(",") : [],
//       fileUrl,
//       publicId,
//       scheduledDate: req.body.scheduledDate
//         ? new Date(req.body.scheduledDate)
//         : null,
//     });

//     res.status(201).json({ success: true, data: newContent });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ================= Get By ID =================
// exports.getContentById = async (req, res) => {
//   try {
//     const item = await Content.findById(req.params.id);
//     if (!item)
//       return res.status(404).json({ success: false, message: "Not Found" });

//     res.json({ success: true, data: item });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ================= Update =================
// exports.updateContent = async (req, res) => {
//   try {
//     let fileUrl = req.body.fileUrl;
//     let publicId = req.body.publicId;

//     // If new file uploaded
//     if (req.file) {
//       // Delete old file from cloudinary
//       if (publicId) {
//         await cloudinary.uploader.destroy(publicId, {
//           resource_type: "raw",
//         });
//       }

//       fileUrl = req.file.path;          // cloudinary URL
//       publicId = req.file.filename;     // full public id
//     }

//     const updated = await Content.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...req.body,
//         tags: req.body.tags ? req.body.tags.split(",") : [],
//         fileUrl,
//         publicId,
//         scheduledDate: req.body.scheduledDate
//           ? new Date(req.body.scheduledDate)
//           : null,
//       },
//       { new: true }
//     );

//     res.json({ success: true, data: updated });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ================= Delete =================
// exports.deleteContent = async (req, res) => {
//   try {
//     const item = await Content.findById(req.params.id);
//     if (!item)
//       return res.status(404).json({ success: false, message: "Not Found" });

//     if (item.publicId) {
//       await cloudinary.uploader.destroy(item.publicId, {
//         resource_type: "raw",
//       });
//     }

//     await item.deleteOne();

//     res.json({ success: true, message: "Content Deleted" });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const Content = require("../models/Content");
const cloudinary = require("../config/cloudinary");

exports.getContent = async (req, res) => {
  try {
    const contents = await Content.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE
exports.createContent = async (req, res) => {
  try {
    const fileUrl = req.file?.path || null;
    const publicId = req.file?.public_id || null;   // FIXED

    const newContent = await Content.create({
      ...req.body,
      tags: req.body.tags ? req.body.tags.split(",") : [],
      fileUrl,
      publicId,
      scheduledDate: req.body.scheduledDate
        ? new Date(req.body.scheduledDate)
        : null,
    });

    res.status(201).json({ success: true, data: newContent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET BY ID
exports.getContentById = async (req, res) => {
  try {
    const item = await Content.findById(req.params.id);
    if (!item)
      return res.status(404).json({ success: false, message: "Not Found" });

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updateContent = async (req, res) => {
  try {
    let fileUrl = req.body.fileUrl;
    let publicId = req.body.publicId;

    if (req.file) {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: "auto",
        });
      }

      fileUrl = req.file.path;
      publicId = req.file.public_id;  // FIXED
    }

    const updated = await Content.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        tags: req.body.tags ? req.body.tags.split(",") : [],
        fileUrl,
        publicId,
        scheduledDate: req.body.scheduledDate
          ? new Date(req.body.scheduledDate)
          : null,
      },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteContent = async (req, res) => {
  try {
    const item = await Content.findById(req.params.id);

    if (!item)
      return res.status(404).json({ success: false, message: "Not Found" });

    if (item.publicId) {
      await cloudinary.uploader.destroy(item.publicId, {
        resource_type: "auto",
      });
    }

    await item.deleteOne();

    res.json({ success: true, message: "Content Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
