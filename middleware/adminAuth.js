
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// module.exports = async (req,res,next)=>{
//   try{
//     const authHeader = req.headers.authorization;
//     if(!authHeader || !authHeader.startsWith("Bearer "))
//       return res.status(401).json({ message: "No token provided" });

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);

//     if(!user || !user.isAdmin)
//       return res.status(403).json({ message: "Admin access required" });

//     req.user = user;
//     next();
//   }catch(err){
//     console.error(err);
//     res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    // 1️⃣ Check if Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "No token provided" });

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id)
      return res.status(401).json({ message: "Token is invalid" });

    // 4️⃣ Fetch user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    // 5️⃣ Check if user is admin (fix applied)
    if (user.role !== "admin")
      return res.status(403).json({ message: "Admin access required" });

    // 6️⃣ Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("Admin auth middleware error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
