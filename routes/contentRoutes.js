
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
