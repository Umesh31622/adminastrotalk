<<<<<<< HEAD
const router = require("express").Router();
const upload = require("../middlewares/uploadPdf");
const controller = require("../controllers/knowMoreController");

router.post("/", upload.single("pdf"), controller.createKnowMore);
router.get("/", controller.getKnowMore);
router.put("/:id", upload.single("pdf"), controller.updateKnowMore);
router.delete("/:id", controller.deleteKnowMore);

module.exports = router;
=======

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
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
