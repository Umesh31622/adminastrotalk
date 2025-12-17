<<<<<<< HEAD
=======
// // const multer = require("multer");
// // const { CloudinaryStorage } = require("multer-storage-cloudinary");
// // const cloudinary = require("../config/cloudinary");

// // const cloudUpload = (folderName = "general") => {
// //   const storage = new CloudinaryStorage({
// //     cloudinary,
// //     params: (req, file) => ({
// //       folder: folderName,
// //       resource_type: "auto",

// //       // FIXED 🔥 proper clean public_id
// //       public_id: `${Date.now()}_${file.originalname
// //         .toLowerCase()
// //         .replace(/\s+/g, "_")
// //         .replace(/[^a-z0-9._-]/g, "")}`,

// //       allowed_formats: [
// //         "jpg",
// //         "jpeg",
// //         "png",
// //         "webp",
// //         "pdf",
// //         "mp4",
// //         "mp3",
// //         "doc",
// //         "docx",
// //         "txt",
// //         "zip",
// //       ],
// //     }),
// //   });

// //   return multer({ storage });
// // };

// // module.exports = cloudUpload;

// // const multer = require("multer");
// // const { CloudinaryStorage } = require("multer-storage-cloudinary");
// // const cloudinary = require("../config/cloudinary");

// // const cloudUpload = (folderName = "general") => {
// //   const storage = new CloudinaryStorage({
// //     cloudinary,
// //     params: {
// //       folder: folderName,
// //       resource_type: "auto",

// //       // Clean public id
// //       public_id: (req, file) =>
// //         `${Date.now()}_${file.originalname
// //           .toLowerCase()
// //           .replace(/\s+/g, "_")
// //           .replace(/[^a-z0-9._-]/g, "")}`,

// //       allowed_formats: [
// //         "jpg",
// //         "jpeg",
// //         "png",
// //         "webp",
// //         "pdf",
// //         "mp4",
// //         "mp3",
// //         "doc",
// //         "docx",
// //         "txt",
// //         "zip",
// //       ],
// //     },
// //   });

// //   return multer({
// //     storage,
// //     limits: {
// //       fileSize: 20 * 1024 * 1024, // 🔥 20MB limit to avoid crashes
// //     },
// //     fileFilter: (req, file, cb) => {
// //       if (!file.mimetype) return cb(new Error("Invalid file"), false);
// //       cb(null, true);
// //     },
// //   });
// // };

// // module.exports = cloudUpload;

// // const multer = require("multer");
// // const { CloudinaryStorage } = require("multer-storage-cloudinary");
// // const cloudinary = require("../config/cloudinary");

// // const cloudUpload = (folderName = "general") => {
// //   const storage = new CloudinaryStorage({
// //     cloudinary,
// //     params: (req, file) => {
// //       let resource_type = "image";

// //       // Detect type properly
// //       if (file.mimetype.includes("pdf")) {
// //         resource_type = "raw";
// //       } else if (
// //         file.mimetype.includes("video") ||
// //         file.mimetype.includes("audio")
// //       ) {
// //         resource_type = "video"; // 🔥 IMPORTANT
// //       } else {
// //         resource_type = "image";
// //       }

// //       const sanitizedName = file.originalname
// //         .toLowerCase()
// //         .replace(/\s+/g, "_")
// //         .replace(/[^a-z0-9._-]/g, "");

// //       return {
// //         folder: folderName,
// //         resource_type,
// //         public_id: `${Date.now()}_${sanitizedName}`,
// //         allowed_formats: [
// //           "jpg",
// //           "jpeg",
// //           "png",
// //           "webp",
// //           "pdf",
// //           "mp4",
// //           "mov",
// //           "avi",
// //           "mp3",
// //           "wav",
// //           "doc",
// //           "docx",
// //           "txt",
// //           "zip",
// //         ],
// //       };
// //     },
// //   });

// //   return multer({
// //     storage,
// //     limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
// //     fileFilter: (req, file, cb) => {
// //       if (!file.mimetype) return cb(new Error("Invalid file"), false);
// //       cb(null, true);
// //     },
// //   });
// // };

// // module.exports = cloudUpload;
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../config/cloudinary");

<<<<<<< HEAD
// const cloudUpload = (folder = "know_more") => {
//   const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//       folder,
//       resource_type: "raw", // ✅ PDF MUST be RAW
//       format: "pdf",
//       public_id: `${Date.now()}`,
=======
// const cloudUpload = (folderName = "general") => {
//   const storage = new CloudinaryStorage({
//     cloudinary,
//     params: async (req, file) => {
//       const cleanName = file.originalname
//         .toLowerCase()
//         .replace(/\s+/g, "_")
//         .replace(/[^a-z0-9._-]/g, "");

//       return {
//         folder: folderName,
//         resource_type: "raw",   // 🔥 FORCES ALL FILE TYPES TO CLOUDINARY
//         public_id: `${Date.now()}_${cleanName}`,
//       };
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
//     },
//   });

//   return multer({
//     storage,
<<<<<<< HEAD
//     limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
=======
//     limits: { fileSize: 300 * 1024 * 1024 },
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
//   });
// };

// module.exports = cloudUpload;

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const cloudUpload = (folderName = "general") => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
      let resourceType = "auto"; // auto = images + videos + pdf + raw

      // PDF → RAW
      if (file.mimetype === "application/pdf") {
        resourceType = "raw";
      }

      // Videos
      if (file.mimetype.startsWith("video/")) {
        resourceType = "video";
      }

      // Images
      if (file.mimetype.startsWith("image/")) {
        resourceType = "image";
      }

      const cleanName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9._-]/g, "");

      return {
        folder: folderName,
        resource_type: resourceType,
        type: "upload",
        public_id: `${Date.now()}_${cleanName}`,
      };
    }
  });

  return multer({
    storage,
    limits: { fileSize: 200 * 1024 * 1024 }, // 200MB total
  });
};

module.exports = cloudUpload;
<<<<<<< HEAD
=======

>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
