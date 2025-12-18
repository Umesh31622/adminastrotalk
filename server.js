require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const socketio = require("socket.io");
const helmet = require("helmet");
const compression = require("compression");
const schedule = require("node-schedule");
const Razorpay = require("razorpay");
const { google } = require("googleapis");

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://frontendastro-1.onrender.com",
       "https://websitemernastro.vercel.app/",
    ],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("sendManualMessage", (data) => {
    io.emit("newMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});


const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "https://frontendastro-1.onrender.com",
   "https://websitemernastro.vercel.app/",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* ======================================================
   MIDDLEWARE
====================================================== */
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


const PORT = process.env.PORT || 7000;

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/astroApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) =>
    console.error("❌ MongoDB connection failed:", err.message)
  );


try {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
  app.locals.razorpay = razorpay;
  console.log("💳 Razorpay initialized");
} catch (err) {
  console.error("❌ Razorpay init failed:", err.message);
}


app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/clients", require("./routes/clients"));
app.use("/api/astrologers", require("./routes/astrologerRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/remedies", require("./routes/remedyRoutes"));
app.use("/api/consultations", require("./routes/consultationRoutes"));
app.use("/api/transactions", require("./routes/transaction"));
app.use("/api/feedbacks", require("./routes/feedbackRoutes"));
app.use("/api/calculators", require("./routes/calculatorRoutes"));
app.use("/api/kundlis", require("./routes/kundliRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/forms", require("./routes/formRoutes"));
app.use("/api/submissions", require("./routes/submissionRoutes"));
app.use("/api/communication", require("./routes/communicationRoutes"));
app.use("/api/trigger", require("./routes/triggers"));
app.use("/api/templates", require("./routes/templates"));
app.use("/api/content", require("./routes/contentRoutes"));
app.use("/api/manglik", require("./routes/manglikRoute"));
app.use("/api/numerology", require("./routes/numerologyRoutes"));
app.use("/api/compatibility", require("./routes/compatibility"));
app.use("/api/transits", require("./routes/transitRoutes"));
app.use("/api/dashas", require("./routes/dashaRoutes"));
app.use("/api/zodiac", require("./routes/zodiacRoutes"));
app.use("/api/nakshatra", require("./routes/nakshatraRoutes"));
app.use("/api/planetary", require("./routes/planetaryRoutes"));
app.use("/api/daily-predictions", require("./routes/dailyPredictionRoutes"));
app.use("/api/horoscopes", require("./routes/horoscopeRoutes"));
app.use("/api/panchang", require("./routes/panchangRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/subscriptions", require("./routes/subscriptionRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/discounts", require("./routes/discountRoutes"));
app.use("/api/prokerala", require("./routes/prokeralaRoutes"));
app.use("/api/userweb/auth", require("./routes/userwebAuthRoutes"));
app.use("/api/userweb", require("./routes/userwebRoutes"));
app.use("/api/energy-services", require("./routes/energyServiceRoutes"));
app.use("/api/manifestation", require("./routes/manifestationRoutes"));
app.use("/wallet", require("./routes/walletRoutes"));
app.use("/bookings", require("./routes/bookingRoutes"));
app.use("/user-reports", require("./routes/userReportRoutes"));
app.use("/api/userweb/devices", require("./routes/deviceRoutes"));
app.use("/api/userweb/activity", require("./routes/activityRoutes"));
// app.use("/api/know-more", require("./routes/knowMoreRoutes"));
app.use("/api/faqs", require("./routes/faqRoutes"));
app.use("/api/about", require("./routes/aboutRoutes"));
app.use("/api/careers", require("./routes/careerRoutes"));
app.use("/api/dashboard", require("./routes/dashboardStats"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/our-clients", require("./routes/ourClientsRoutes"));
app.use("/api/remedy-journey", require("./routes/remedyJourney.routes"));
app.use("/api/experience", require("./routes/experienceRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/wealth", require("./routes/wealthRoutes"));



app.use(
  "/api/admin-notifications",
  require("./routes/adminNotificationRoutes")
);


app.get("/api/health", (req, res) =>
  res.json({ status: "OK", time: new Date().toISOString() })
);

app.get("/", (req, res) =>
  res.send("🚀 MERN Astrology Backend Running")
);


app.use("/api/*", (req, res) =>
  res.status(404).json({ success: false, error: "API route not found" })
);

app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});


schedule.scheduleJob("0 9 * * *", async () => {
  const { sendScheduledReminders } = require("./services/automationService");
  await sendScheduledReminders();
  console.log("📅 General reminders sent at 9 AM");
});

schedule.scheduleJob("0 9 * * *", async () => {
  const {
    runBirthdayAnniversaryAutomation,
  } = require("./services/relationshipAutomationService");

  const io = app.get("io");
  await runBirthdayAnniversaryAutomation(io);

  console.log("🎯 Birthday / Anniversary automation executed");
});


server.listen(PORT, () =>
  console.log(
    `🌐 Server running on port ${PORT} (${process.env.NODE_ENV || "development"})`
  )
);


app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("No authorization code received.");

  res.send(`
    <h2>Authorization Successful 🎉</h2>
    <p>Copy this code and paste it into your terminal:</p>
    <textarea style="width:100%;height:100px;">${code}</textarea>
  `);
});


