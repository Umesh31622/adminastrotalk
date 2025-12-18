const express = require("express");
const router = express.Router();

const cloudUpload = require("../middleware/cloudUpload");
const {
  uploadExperience,
  getExperiences,
  deleteExperience,
} = require("../controllers/experienceController");
router.post(
  "/upload",
  cloudUpload("experience").single("pdf"),
  uploadExperience
);

router.get("/", getExperiences);
router.delete("/:id", deleteExperience);

module.exports = router;
