const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { getAbout, updateAbout } = require("../controllers/aboutController");

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router.get("/", getAbout);
router.post("/", upload.single("file"), updateAbout);

module.exports = router;
