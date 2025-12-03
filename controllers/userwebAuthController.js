// const UserWeb = require("../models/userwebUser");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");


// // ================= SEND OTP =================
// exports.sendOtpUserWeb = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email)
//       return res.status(400).json({ success: false, message: "Email is required" });

//     let user = await UserWeb.findOne({ email });

//     // If user does not exist, create user auto
//     if (!user) {
//       user = await UserWeb.create({ email });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     user.otp = otp;
//     user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min expiry
//     await user.save();

//     // Email Transport
//     const transporter = nodemailer.createTransport({
//       service: process.env.SMTP_SERVICE || "gmail",
//       auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
//     });

//     await transporter.sendMail({
//       from: process.env.SMTP_USER,
//       to: email,
//       subject: "Your OTP for Login",
//       text: `Your OTP is ${otp}. Valid for 5 minutes.`,
//     });

//     res.json({ success: true, message: "OTP sent successfully" });

//   } catch (err) {
//     console.error("Send OTP Error:", err);
//     res.status(500).json({ success: false, message: "Server error sending OTP" });
//   }
// };


// // ================= VERIFY OTP =================
// exports.verifyOtpUserWeb = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp)
//       return res.status(400).json({ success: false, message: "Email and OTP required" });

//     const user = await UserWeb.findOne({ email });

//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found" });

//     // OTP validation
//     if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < Date.now()) {
//       return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
//     }

//     // Clear OTP
//     user.otp = null;
//     user.otpExpiry = null;
//     await user.save();

//     // Token
//     const token = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       success: true,
//       message: "Login Successful",
//       token,
//       user: { id: user._id, email: user.email, name: user.name }
//     });

//   } catch (err) {
//     console.error("Verify OTP Error:", err);
//     res.status(500).json({ success: false, message: "Server error verifying OTP" });
//   }
// };

const UserWeb = require("../models/userwebUser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ================= SEND OTP =================
exports.sendOtpUserWeb = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ success: false, message: "Email is required" });

    let user = await UserWeb.findOne({ email });

    // Auto-create user
    if (!user) {
      user = await UserWeb.create({ email });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    // ⭐ FIXED: Proper Gmail SMTP Transport (100% Working)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,            // smtp.gmail.com
      port: process.env.EMAIL_PORT,            // 587
      secure: false,                           // Gmail for port 587
      auth: {
        user: process.env.EMAIL_USER,          // Gmail ID
        pass: process.env.EMAIL_PASS           // Gmail App Password
      }
    });

    await transporter.sendMail({
      from: `"Astro App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Login",
      html: `
        <h3>Your OTP Login Code</h3>
        <p>Your OTP is: <b style="font-size:20px">${otp}</b></p>
        <p>OTP is valid for 5 minutes.</p>
      `,
    });

    res.json({ success: true, message: "OTP sent successfully" });

  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ success: false, message: "Server error sending OTP" });
  }
};

// ================= VERIFY OTP =================
exports.verifyOtpUserWeb = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ success: false, message: "Email and OTP required" });

    const user = await UserWeb.findOne({ email });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login Successful",
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });

  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ success: false, message: "Server error verifying OTP" });
  }
};
