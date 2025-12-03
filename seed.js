require("dotenv").config();
const mongoose = require("mongoose");
const SubscriptionPlan = require("./models/SubscriptionPlan");
const Referral = require("./models/Referral");
const User = require("./models/User");

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/astroApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

async function seed() {
  try {
    // Clear old data
    await SubscriptionPlan.deleteMany({});
    await Referral.deleteMany({});

    // Seed subscription plans
    const plans = await SubscriptionPlan.insertMany([
      { name: "Basic Plan", amount: 10, interval: "monthly" },
      { name: "Pro Plan", amount: 25, interval: "monthly" },
      { name: "Premium Plan", amount: 50, interval: "monthly" },
    ]);
    console.log("✅ Subscription Plans seeded:", plans);

    // Find or create sample user
    let user = await User.findOne({ email: "Rinku123@gmail.com" });
    if (!user) {
      user = await User.create({
        name: "Rinku",
        email: "Rinku123@gmail.com",
        password: "test123",
      });
      console.log("✅ Sample user created:", user);
    }

    // Seed referrals
    const referrals = await Referral.insertMany([
      { code: "REF123", user: user._id, approved: false },
      { code: "REF456", user: user._id, approved: true },
    ]);
    console.log("✅ Referrals seeded:", referrals);

    console.log("🎉 Seeding completed successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
