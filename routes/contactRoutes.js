const express = require("express");
const router = express.Router();

const {
  createContact,
  getAllContacts,
  getOneContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

router.post("/", createContact);
router.get("/", getAllContacts);
router.get("/:id", getOneContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

module.exports = router;
