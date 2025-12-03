const express = require("express");
const router = express.Router();
const { getDiscounts, createDiscount } = require("../controllers/discountController");

router.get("/", getDiscounts);
router.post("/", createDiscount);

module.exports = router;
