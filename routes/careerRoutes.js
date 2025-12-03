// backend/routes/careerRoutes.js
const express = require("express");
const router = express.Router();

const {
  getCareers,
  addCareer,
  deleteCareer,
} = require("../controllers/careerController");

// Routes
router.get("/", getCareers);
router.post("/", addCareer);
router.delete("/:id", deleteCareer);

module.exports = router;
