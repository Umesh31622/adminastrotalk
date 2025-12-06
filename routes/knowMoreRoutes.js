
const express = require("express");
const router = express.Router();

const cloudUpload = require("../middleware/cloudUpload");
const {
  uploadKnowMorePDF,
  getAllPDFs,
  updatePDF,
  deletePDF,
} = require("../controllers/knowMoreController");

router.post("/upload", cloudUpload("know_more").single("pdf"), uploadKnowMorePDF);
router.get("/", getAllPDFs);
router.put("/:id", cloudUpload("know_more").single("pdf"), updatePDF);
router.delete("/:id", deletePDF);

module.exports = router;
