const express = require("express");
const router = express.Router();
const upload = require("../middleware/cloudUpload")("wealth-pdfs");

const {
  createWealth,
  getWealth,
  deleteWealth,
} = require("../controllers/wealthController");

router.post("/", upload.single("file"), createWealth); // ADMIN
router.get("/", getWealth); // USER
router.delete("/:id", deleteWealth); // ADMIN

module.exports = router;