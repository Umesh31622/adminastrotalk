
const express = require("express");
const router = express.Router();
const { createForm, getAllForms, deleteForm } = require("../controllers/formController");

router.post("/", createForm);
router.get("/", getAllForms);
router.delete("/:id", deleteForm);

module.exports = router;
