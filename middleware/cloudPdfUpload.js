// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../config/cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     if (!file.originalname.toLowerCase().endsWith(".pdf")) {
//       throw new Error("Only PDF allowed");
//     }

//     return {
//       folder: "know_more_pdfs",
//       resource_type: "raw",          // 🔥 MUST
//       public_id: `${Date.now()}_${file.originalname.replace(".pdf", "")}`,
//       format: "pdf",
//     };
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 },
// });

// module.exports = upload;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "know_more_pdfs",
    resource_type: "raw",   // ✅ PDF
    format: "pdf",
    public_id: () => Date.now(), // ✅ simple
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    // ✅ yahin validation
    if (
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      cb(null, true);
    } else {
      cb(null, false); // ❌ reject silently
    }
  },
});

module.exports = upload;
