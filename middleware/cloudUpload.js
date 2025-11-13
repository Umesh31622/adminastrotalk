
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const cloudUpload = (folderName = "general") => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => ({
      folder: folderName,
      resource_type: "auto",

      // FIXED 🔥 proper clean public_id
      public_id: `${Date.now()}_${file.originalname
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9._-]/g, "")}`,

      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "webp",
        "pdf",
        "mp4",
        "mp3",
        "doc",
        "docx",
        "txt",
        "zip",
      ],
    }),
  });

  return multer({ storage });
};

module.exports = cloudUpload;
