const router = require("express").Router();
const {
  addService,
  getAll,
  updateService,
  deleteService,
} = require("../controllers/manifestationController");

router.post("/add", addService);
router.get("/all", getAll);
router.put("/update/:id", updateService);
router.delete("/delete/:id", deleteService);

module.exports = router;
