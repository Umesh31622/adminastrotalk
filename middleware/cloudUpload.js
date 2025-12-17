// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../config/cloudinary");

// const cloudUpload = (folder = "know_more") => {
//   const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//       folder,
//       resource_type: "raw", // ✅ PDF MUST be RAW
//       format: "pdf",
//       public_id: `${Date.now()}`,
//     },
//   });

//   return multer({
//     storage,
//     limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
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
