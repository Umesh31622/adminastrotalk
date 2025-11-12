

const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createContent,
  getContent,
  updateContent,
  deleteContent,
} = require("../controllers/contentController");

// Public Routes
router.get("/", getContent);

// File upload routes
router.post("/", upload.single("file"), createContent);
router.put("/:id", upload.single("file"), updateContent);
router.delete("/:id", deleteContent);

module.exports = router;
