

const jwt = require("jsonwebtoken");
const UserWeb = require("../models/userwebUser");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserWeb.findById(decoded.id).select("-password");
    req.user = user;

    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
