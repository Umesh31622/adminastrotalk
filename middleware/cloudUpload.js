// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../config/cloudinary");

// const cloudUpload = (folderName = "general") => {
//   const storage = new CloudinaryStorage({
//     cloudinary,
//     params: (req, file) => ({
//       folder: folderName,
//       resource_type: "auto",

//       // FIXED 🔥 proper clean public_id
//       public_id: `${Date.now()}_${file.originalname
//         .toLowerCase()
//         .replace(/\s+/g, "_")
//         .replace(/[^a-z0-9._-]/g, "")}`,

//       allowed_formats: [
//         "jpg",
//         "jpeg",
//         "png",
//         "webp",
//         "pdf",
//         "mp4",
//         "mp3",
//         "doc",
//         "docx",
//         "txt",
//         "zip",
//       ],
//     }),
//   });

//   return multer({ storage });
// };

// module.exports = cloudUpload;

// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../config/cloudinary");

// const cloudUpload = (folderName = "general") => {
//   const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//       folder: folderName,
//       resource_type: "auto",

//       // Clean public id
//       public_id: (req, file) =>
//         `${Date.now()}_${file.originalname
//           .toLowerCase()
//           .replace(/\s+/g, "_")
//           .replace(/[^a-z0-9._-]/g, "")}`,

//       allowed_formats: [
//         "jpg",
//         "jpeg",
//         "png",
//         "webp",
//         "pdf",
//         "mp4",
//         "mp3",
//         "doc",
//         "docx",
//         "txt",
//         "zip",
//       ],
//     },
//   });

//   return multer({
//     storage,
//     limits: {
//       fileSize: 20 * 1024 * 1024, // 🔥 20MB limit to avoid crashes
//     },
//     fileFilter: (req, file, cb) => {
//       if (!file.mimetype) return cb(new Error("Invalid file"), false);
//       cb(null, true);
//     },
//   });
// };

// module.exports = cloudUpload;

// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../config/cloudinary");

// const cloudUpload = (folderName = "general") => {
//   const storage = new CloudinaryStorage({
//     cloudinary,
//     params: (req, file) => {
//       let resource_type = "image";

//       // Detect type properly
//       if (file.mimetype.includes("pdf")) {
//         resource_type = "raw";
//       } else if (
//         file.mimetype.includes("video") ||
//         file.mimetype.includes("audio")
//       ) {
//         resource_type = "video"; // 🔥 IMPORTANT
//       } else {
//         resource_type = "image";
//       }

//       const sanitizedName = file.originalname
//         .toLowerCase()
//         .replace(/\s+/g, "_")
//         .replace(/[^a-z0-9._-]/g, "");

//       return {
//         folder: folderName,
//         resource_type,
//         public_id: `${Date.now()}_${sanitizedName}`,
//         allowed_formats: [
//           "jpg",
//           "jpeg",
//           "png",
//           "webp",
//           "pdf",
//           "mp4",
//           "mov",
//           "avi",
//           "mp3",
//           "wav",
//           "doc",
//           "docx",
//           "txt",
//           "zip",
//         ],
//       };
//     },
//   });

//   return multer({
//     storage,
//     limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
//     fileFilter: (req, file, cb) => {
//       if (!file.mimetype) return cb(new Error("Invalid file"), false);
//       cb(null, true);
//     },
//   });
// };

// module.exports = cloudUpload;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const cloudUpload = (folderName = "general") => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const cleanName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9._-]/g, "");

      return {
        folder: folderName,
        resource_type: "raw",   // 🔥 FORCES ALL FILE TYPES TO CLOUDINARY
        public_id: `${Date.now()}_${cleanName}`,
      };
    },
  });

  return multer({
    storage,
    limits: { fileSize: 300 * 1024 * 1024 },
  });
};

module.exports = cloudUpload;
