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

module.exports = async (req,res,next)=>{
  try{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if(!user || !user.isAdmin)
      return res.status(403).json({ message: "Admin access required" });

    req.user = user;
    next();
  }catch(err){
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
