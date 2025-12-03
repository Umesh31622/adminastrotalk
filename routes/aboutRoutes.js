const express = require("express");
const router = express.Router();
const cloudUpload = require("../middleware/cloudUpload"); // ✅ Cloudinary storage

const upload = cloudUpload("about-us"); // folder name cloudinary me

const { getAbout, updateAbout, deleteAbout } =
  require("../controllers/aboutController");

router.get("/", getAbout);
router.post("/", upload.single("file"), updateAbout); // ⭐ CLOUD UPLOAD
router.delete("/", deleteAbout);

module.exports = router;
