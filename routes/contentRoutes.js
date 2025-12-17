// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/upload");
// const {
//   createContent,
//   getContent,
//   updateContent,
//   deleteContent,
// } = require("../controllers/contentController");

// // Public Routes
// router.get("/", getContent);

// // File upload routes
// router.post("/", upload.single("file"), createContent);
// router.put("/:id", upload.single("file"), updateContent);
// router.delete("/:id", deleteContent);

// module.exports = router;

// const express = require("express");
// const router = express.Router();

// const cloudUpload = require("../middleware/cloudUpload");
// const upload = cloudUpload("content"); // upload to /content folder on cloudinary

// const {
//   createContent,
//   getContent,
//   getContentById,
//   updateContent,
//   deleteContent,
// } = require("../controllers/contentController");

// // Routes
// router.get("/", getContent);
// router.get("/:id", getContentById);

// router.post("/", upload.single("file"), createContent);
// router.put("/:id", upload.single("file"), updateContent);
// router.delete("/:id", deleteContent);

// module.exports = router;

// const express = require("express");
// const router = express.Router();

// const cloudUpload = require("../middleware/cloudUpload");
// const upload = cloudUpload("content"); // upload to cloudinary/content folder

// const {
//   createContent,
//   getContent,
//   getContentById,
//   updateContent,
//   deleteContent,
// } = require("../controllers/contentController");

// // ========================= Routes =========================

// // Get All Content
// router.get("/", getContent);

// // Get Single Content
// router.get("/:id", getContentById);

// // Create Content
// router.post("/", upload.single("file"), createContent);

// // Update Content
// router.put("/:id", upload.single("file"), updateContent);

// // Delete Content
// router.delete("/:id", deleteContent);

// module.exports = router;

const express = require("express");
const router = express.Router();

const cloudUpload = require("../middleware/cloudUpload");
const upload = cloudUpload("vault-content");

const {
  createContent,
  getContent,
  getContentById,
  updateContent,
  deleteContent,
} = require("../controllers/contentController");

router.get("/", getContent);
router.get("/:id", getContentById);

router.post("/", upload.single("file"), createContent);
router.put("/:id", upload.single("file"), updateContent);
router.delete("/:id", deleteContent);

module.exports = router;
