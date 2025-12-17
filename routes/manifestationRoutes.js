<<<<<<< HEAD
// const router = require("express").Router();
// const {
//   addService,
//   getAll,
//   updateService,
//   deleteService,
// } = require("../controllers/manifestationController");

// router.post("/add", addService);
// router.get("/all", getAll);
// router.put("/update/:id", updateService);
// router.delete("/delete/:id", deleteService);

// module.exports = router;
const express = require("express");
const router = express.Router();

=======
const router = require("express").Router();
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
const {
  addService,
  getAll,
  updateService,
  deleteService,
} = require("../controllers/manifestationController");

<<<<<<< HEAD
// ➕ Add new manifestation / well-being service
router.post("/add", addService);

// 📥 Get all services (manifestation + well-being)
router.get("/all", getAll);

// ✏️ Update service by ID
router.put("/update/:id", updateService);

// 🗑️ Delete service by ID
=======
router.post("/add", addService);
router.get("/all", getAll);
router.put("/update/:id", updateService);
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
router.delete("/delete/:id", deleteService);

module.exports = router;
