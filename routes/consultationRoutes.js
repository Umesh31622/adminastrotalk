

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

const express = require("express");
const router = express.Router();
const {
  getConsultations,
  createConsultation,
  updateConsultation,
  deleteConsultation,
} = require("../controllers/consultationController");

router.get("/", getConsultations);
router.post("/", createConsultation); // Auto real Google Meet link + email
router.put("/:id", updateConsultation);
router.delete("/:id", deleteConsultation);

module.exports = router;
