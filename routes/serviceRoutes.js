
const express = require("express");
const {
  createService,
  getAllServices,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const upload = require("../middleware/upload");

const router = express.Router();

// CRUD Routes with image upload
router.post("/", upload.array("media", 5), createService);
router.put("/:id", upload.array("media", 5), updateService);
router.get("/", getAllServices);
router.delete("/:id", deleteService);

module.exports = router;
