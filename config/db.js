// // const mongoose = require('mongoose');

// // const connectDB = async (uri) => {
// //   try {
// //     await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// //     console.log('MongoDB connected');
// //   } catch (err) {
// //     console.error('MongoDB connection error:', err);
// //     process.exit(1);
// //   }
// // };

// // module.exports = connectDB;
// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// module.exports = cloudinary;
const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/astrochat");
  console.log("MongoDB Connected");
};

module.exports = connectDB;
