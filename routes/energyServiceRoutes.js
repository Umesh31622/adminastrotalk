
const router = require("express").Router();
const {
  addService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/energyServiceController");

// CREATE
router.post("/add", addService);

// READ
router.get("/all", getAllServices);
router.get("/:id", getServiceById);

// UPDATE
router.put("/update/:id", updateService);

// DELETE
router.delete("/delete/:id", deleteService);

module.exports = router;
