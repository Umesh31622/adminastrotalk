

// const express = require("express");
// const router = express.Router();
// const {
//   getConsultations,
//   createConsultation,
//   updateConsultation,
//   deleteConsultation,
// } = require("../controllers/consultationController");

// router.get("/", getConsultations);
// router.post("/", createConsultation); // Auto link + email
// router.put("/:id", updateConsultation);
// router.delete("/:id", deleteConsultation);

// module.exports = router;

<<<<<<< HEAD
// const express = require("express");
// const router = express.Router();
// const {
//   getConsultations,
//   createConsultation,
//   updateConsultation,
//   deleteConsultation,
// } = require("../controllers/consultationController");

// router.get("/", getConsultations);
// router.post("/", createConsultation); // Auto real Google Meet link + email
// router.put("/:id", updateConsultation);
// router.delete("/:id", deleteConsultation);

// module.exports = router;
const express = require("express");
const router = express.Router();

const {
  createConsultation,
  getConsultations,
  getUserConsultations,
=======
const express = require("express");
const router = express.Router();
const {
  getConsultations,
  createConsultation,
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
  updateConsultation,
  deleteConsultation,
} = require("../controllers/consultationController");

<<<<<<< HEAD
// USER
router.get("/user/:email", getUserConsultations);
router.post("/", createConsultation);

// ADMIN
router.get("/", getConsultations);
=======
router.get("/", getConsultations);
router.post("/", createConsultation); // Auto real Google Meet link + email
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
router.put("/:id", updateConsultation);
router.delete("/:id", deleteConsultation);

module.exports = router;
