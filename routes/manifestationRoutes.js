
const express = require("express");
const router = express.Router();

const {
  addService,
  getAll,
  updateService,
  deleteService,
} = require("../controllers/manifestationController");

// ➕ Add new manifestation / well-being service
router.post("/add", addService);

// 📥 Get all services (manifestation + well-being)
router.get("/all", getAll);

// ✏️ Update service by ID
router.put("/update/:id", updateService);

// 🗑️ Delete service by ID
router.delete("/delete/:id", deleteService);

module.exports = router;
