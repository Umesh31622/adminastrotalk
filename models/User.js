

// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["admin","member"], default: "member" },
// });

// // Hash password before save
// userSchema.pre("save", async function(next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    phone: {
      type: String,
      required: true, // 📲 required for SMS / WhatsApp
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },

    // ================= Relationship Intelligence =================
    dob: {
      type: Date, // 🎂 Birthday
    },

    anniversary: {
      type: Date, // 💍 Anniversary
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);

