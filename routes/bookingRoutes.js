const express = require("express");
const router = express.Router();
const { getMyBookings } = require("../controllers/bookingController");

// GET USER WISE BOOKINGS
router.get("/:userId", getMyBookings);

module.exports = router;
