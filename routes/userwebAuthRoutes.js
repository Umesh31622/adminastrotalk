
const express = require("express");
const router = express.Router();
const auth = require("../controllers/userwebAuthController");
const userwebAuth = require("../middleware/userwebAuthMiddleware");

// REGISTER
router.post("/register", auth.registerUser);

// LOGIN
router.post("/login", auth.loginUser);

// ME (Protected Route)
router.get("/me", userwebAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
