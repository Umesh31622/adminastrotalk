
const express = require("express");
const router = express.Router();

const {
  createConsultation,
  getConsultations,
  getUserConsultations,
  updateConsultation,
  deleteConsultation,
} = require("../controllers/consultationController");

// USER
router.get("/user/:email", getUserConsultations);
router.post("/", createConsultation);

// ADMIN
router.get("/", getConsultations);
router.put("/:id", updateConsultation);
router.delete("/:id", deleteConsultation);

module.exports = router;

