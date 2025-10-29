const express = require("express");
const { createSubmission, getAllSubmissions } = require("../controllers/submissionController");
const router = express.Router();

router.post("/", createSubmission);
router.get("/", getAllSubmissions);

module.exports = router;
