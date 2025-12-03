// backend/routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const { getUploads, createUpload } = require("../controllers/uploadController");

router.get("/", getUploads); // GET all uploads
router.post("/", createUpload); // POST new upload

module.exports = router;
