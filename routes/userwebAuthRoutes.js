// // const express = require("express");
// // const router = express.Router();
// // const auth = require("../controllers/userwebAuthController");

// // router.post("/send-otp", auth.sendOtpUserWeb);
// // router.post("/verify-otp", auth.verifyOtpUserWeb);

// // module.exports = router;

// // const express = require("express");
// // const router = express.Router();
// // const auth = require("../controllers/userwebAuthController");
// // const UserWeb = require("../models/userwebUser");

// // // ⭐ NEW: Check if user exists (required for login/signup separation)
// // router.post("/check-user", async (req, res) => {
// //   try {
// //     const { email } = req.body;
// //     if (!email) return res.json({ exists: false });

// //     const user = await UserWeb.findOne({ email });
// //     res.json({ exists: !!user });
// //   } catch (err) {
// //     res.json({ exists: false });
// //   }
// // });

// // // SEND OTP
// // router.post("/send-otp", auth.sendOtpUserWeb);

// // // VERIFY OTP
// // router.post("/verify-otp", auth.verifyOtpUserWeb);

// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const auth = require("../controllers/userwebAuthController");
// const userwebAuth = require("../middleware/userwebAuthMiddleware");
// const UserWeb = require("../models/userwebUser");

// // Check user
// router.post("/check-user", async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await UserWeb.findOne({ email });
//     res.json({ exists: !!user });
//   } catch {
//     res.json({ exists: false });
//   }
// });

// // Send OTP
// router.post("/send-otp", auth.sendOtpUserWeb);

// // Verify OTP
// router.post("/verify-otp", auth.verifyOtpUserWeb);

// // ⭐ Logged-in user
// router.get("/me", userwebAuth, (req, res) => {
//   res.json({ success: true, user: req.user });
// });

// module.exports = router;

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

