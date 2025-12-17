// const mongoose = require("mongoose");

// const userwebSchema = new mongoose.Schema({
//   name: { type: String, default: "" },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, default: "" },
//   password: { type: String, default: "" }, // optional if using OTP
//   profileImage: { type: String, default: "" },

//   gender: { type: String, default: "" },
//   dob: { type: String, default: "" },
//   timeOfBirth: { type: String, default: "" },
//   placeOfBirth: { type: String, default: "" },
//   location: { type: String, default: "" },

//   // OTP fields for email-based OTP login
//   otp: { type: String },
//   otpExpiry: { type: Date },

//   kundli: {
//     moonSign: String,
//     ascendant: String,
//     nakshatra: String,
//     dasha: String,
//     kundliStatus: { type: String, default: "Not Generated" },
//     savedReports: [{ type: String }],
//   },

//   orders: [
//     {
//       orderId: String,
//       serviceName: String,
//       amount: Number,
//       date: String,
//       status: String,
//       transactionId: String,
//     },
//   ],

//   remedies: [
//     {
//       title: String,
//       description: String,
//       status: String, // Active / Completed
//       startDate: String,
//       endDate: String,
//     },
//   ],

//   payments: [
//     {
//       paymentId: String,
//       amount: Number,
//       method: String,
//       status: String,
//       date: String,
//     },
//   ],

//   wallet: {
//     balance: { type: Number, default: 0 },
//     history: [
//       {
//         amount: Number,
//         type: String, // Add / Deduct
//         date: String,
//         note: String,
//       },
//     ],
//   },

//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("UserWeb", userwebSchema);



const mongoose = require("mongoose");

const userwebSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: "" },
  password: { type: String, required: true }, // REQUIRED NOW

  profileImage: { type: String, default: "" },

  gender: { type: String, default: "" },
  dob: { type: String, default: "" },
  timeOfBirth: { type: String, default: "" },
  placeOfBirth: { type: String, default: "" },
  location: { type: String, default: "" },

  kundli: {
    moonSign: String,
    ascendant: String,
    nakshatra: String,
    dasha: String,
    kundliStatus: { type: String, default: "Not Generated" },
    savedReports: [{ type: String }],
  },

  wallet: {
    balance: { type: Number, default: 0 },
    history: [
      {
        amount: Number,
        type: String,
        date: String,
        note: String,
      },
    ],
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserWeb", userwebSchema);
<<<<<<< HEAD
=======

>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
