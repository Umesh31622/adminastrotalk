// // require("dotenv").config();
// // const express = require("express");
// // const mongoose = require("mongoose");
// // const cors = require("cors");
// // const path = require("path");
// // const morgan = require("morgan");
// // const http = require("http");
// // const socketio = require("socket.io");
// // const helmet = require("helmet");
// // const compression = require("compression");
// // const schedule = require("node-schedule");
// // const Razorpay = require("razorpay");
// // const { google } = require("googleapis");

// // const app = express();
// // const server = http.createServer(app);
// // const io = socketio(server, {
// //   cors: {
// //     origin: ["http://localhost:3000", "https://frontendastro-1.onrender.com"],
// //     credentials: true,
// //   },
// // });

// // // ================= CORS =================
// // const allowedOrigins = [
// //   "http://localhost:3000",
// //   "https://frontendastro-1.onrender.com",
// // ];

// // app.use(
// //   cors({
// //     origin: (origin, callback) => {
// //       if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
// //       return callback(new Error("Not allowed by CORS"));
// //     },
// //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// //     allowedHeaders: ["Content-Type", "Authorization"],
// //     credentials: true,
// //   })
// // );
// // app.options("*", cors());

// // // ================= Middleware =================
// // app.use(helmet());
// // app.use(compression());
// // app.use(express.json({ limit: "50mb" }));
// // app.use(express.urlencoded({ extended: true }));
// // app.use(morgan("dev"));

// // // ================= MongoDB Connection =================
// // const PORT = process.env.PORT || 7000;

// // mongoose.set("strictQuery", false);
// // mongoose
// //   .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/astroApp", {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //   })
// //   .then(() => console.log("✅ MongoDB connected"))
// //   .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

// // // ================= Razorpay =================
// // let razorpay;

// // try {
// //   const keyId = process.env.RAZORPAY_KEY_ID;
// //   const keySecret = process.env.RAZORPAY_SECRET;

// //   if (!keyId || !keySecret) {
// //     throw new Error("❌ Missing Razorpay keys in .env");
// //   }

// //   razorpay = new Razorpay({
// //     key_id: keyId,
// //     key_secret: keySecret,
// //   });

// //   app.locals.razorpay = razorpay;

// //   console.log(`💳 Razorpay initialized successfully with key: ${keyId}`);
// // } catch (err) {
// //   console.error("❌ Razorpay initialization failed:", err.message);
// // }

// // // ================= Socket.IO =================
// // io.on("connection", (socket) => {
// //   console.log("⚡ User connected:", socket.id);

// //   socket.on("sendManualMessage", (data) => {
// //     io.emit("newMessage", data);
// //   });

// //   socket.on("disconnect", () => {
// //     console.log("❌ User disconnected:", socket.id);
// //   });
// // });

// // app.set("io", io);

// // // ================= ROUTES =================
// // app.use("/api/auth", require("./routes/auth"));
// // app.use("/api/orders", require("./routes/orders"));
// // app.use("/api/clients", require("./routes/clients"));
// // app.use("/api/astrologers", require("./routes/astrologerRoutes"));
// // app.use("/api/reports", require("./routes/reportRoutes"));
// // app.use("/api/remedies", require("./routes/remedyRoutes"));
// // app.use("/api/consultations", require("./routes/consultationRoutes"));
// // app.use("/api/transactions", require("./routes/transaction"));
// // app.use("/api/feedbacks", require("./routes/feedbackRoutes"));
// // app.use("/api/calculators", require("./routes/calculatorRoutes"));
// // app.use("/api/kundlis", require("./routes/kundliRoutes"));
// // app.use("/api/services", require("./routes/serviceRoutes"));
// // app.use("/api/forms", require("./routes/formRoutes"));
// // app.use("/api/submissions", require("./routes/submissionRoutes"));
// // app.use("/api/communication", require("./routes/communicationRoutes"));
// // app.use("/api/trigger", require("./routes/triggers"));
// // app.use("/api/templates", require("./routes/templates"));
// // app.use("/api/content", require("./routes/contentRoutes"));
// // app.use("/api/manglik", require("./routes/manglikRoute"));
// // app.use("/api/numerology", require("./routes/numerologyRoutes"));
// // app.use("/api/compatibility", require("./routes/compatibility"));
// // app.use("/api/transits", require("./routes/transitRoutes"));
// // app.use("/api/dashas", require("./routes/dashaRoutes"));
// // app.use("/api/zodiac", require("./routes/zodiacRoutes"));
// // app.use("/api/nakshatra", require("./routes/nakshatraRoutes"));
// // app.use("/api/planetary", require("./routes/planetaryRoutes"));
// // app.use("/api/daily-predictions", require("./routes/dailyPredictionRoutes"));
// // app.use("/api/horoscopes", require("./routes/horoscopeRoutes"));
// // app.use("/api/panchang", require("./routes/panchangRoutes"));
// // app.use("/api/search", require("./routes/searchRoutes"));
// // app.use("/api/subscriptions", require("./routes/subscriptionRoutes"));
// // app.use("/api/payments", require("./routes/paymentRoutes"));
// // app.use("/api/discounts", require("./routes/discountRoutes"));
// // app.use("/api/prokerala", require("./routes/prokeralaRoutes"));
// // app.use("/api/about", require("./routes/aboutRoutes"));
// // app.use("/api/careers", require("./routes/careerRoutes"));
// // app.use("/api/dashboard", require("./routes/dashboardStats"));
// // app.use("/api/contact", require("./routes/contactRoutes"));

// // // ⭐ NEW Cloudinary Based Route
// // app.use("/api/our-clients", require("./routes/ourClientsRoutes"));

// // // ================= Health Check =================
// // app.get("/api/health", (req, res) =>
// //   res.json({ status: "✅ OK", time: new Date().toISOString() })
// // );

// // // ================= GOOGLE OAUTH SETUP =================
// // const oAuth2Client = new google.auth.OAuth2(
// //   process.env.CLIENT_ID,
// //   process.env.CLIENT_SECRET,
// //   process.env.REDIRECT_URI
// // );

// // app.get("/auth", (req, res) => {
// //   const scopes = [
// //     "https://www.googleapis.com/auth/calendar",
// //     "https://www.googleapis.com/auth/calendar.events",
// //     "https://www.googleapis.com/auth/meetings.space.created",
// //     "https://www.googleapis.com/auth/userinfo.email",
// //     "https://www.googleapis.com/auth/userinfo.profile",
// //   ];

// //   const url = oAuth2Client.generateAuthUrl({
// //     access_type: "offline",
// //     prompt: "consent",
// //     scope: scopes,
// //   });

// //   res.redirect(url);
// // });

// // app.get("/oauth2callback", async (req, res) => {
// //   const code = req.query.code;
// //   if (!code) return res.status(400).send("No authorization code found");

// //   try {
// //     const { tokens } = await oAuth2Client.getToken(code);
// //     oAuth2Client.setCredentials(tokens);

// //     res.send(`
// //       <h3>✅ Authentication successful!</h3>
// //       <p>Copy your refresh token:</p>
// //       <pre>GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}</pre>
// //     `);
// //   } catch (err) {
// //     console.error("❌ Google OAuth error:", err.message);
// //     res.status(500).send("Error retrieving tokens");
// //   }
// // });

// // // ================= Root =================
// // app.get("/", (req, res) => res.send("🚀 MERN Astrology Backend Running"));

// // // ================= 404 Handler =================
// // app.use("/api/*", (req, res) =>
// //   res.status(404).json({ success: false, error: "API route not found" })
// // );

// // // ================= Global Error =================
// // app.use((err, req, res, next) => {
// //   console.error("🔥 Global Error:", err.stack || err);
// //   res.status(err.status || 500).json({
// //     success: false,
// //     error: err.message || "Internal Server Error",
// //   });
// // });

// // // ================= Cron =================
// // schedule.scheduleJob("0 9 * * *", async () => {
// //   const { sendScheduledReminders } = require("./services/automationService");
// //   await sendScheduledReminders();
// //   console.log("📅 Automated reminders sent at 9 AM");
// // });

// // // ================= Start Server =================
// // server.listen(PORT, () =>
// //   console.log(`🌐 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`)
// // );

// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");
// const morgan = require("morgan");
// const http = require("http");
// const socketio = require("socket.io");
// const helmet = require("helmet");
// const compression = require("compression");
// const schedule = require("node-schedule");
// const Razorpay = require("razorpay");
// const { google } = require("googleapis");

// const app = express();
// const server = http.createServer(app);

// // ================= Socket.IO =================
// const io = socketio(server, {
//   cors: {
//     origin: ["http://localhost:3000", "https://frontendastro-1.onrender.com"],
//     credentials: true,
//   },
// });
// app.set("io", io);

// io.on("connection", (socket) => {
//   console.log("⚡ User connected:", socket.id);

//   socket.on("sendManualMessage", (data) => {
//     io.emit("newMessage", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//   });
// });

// // ================= CORS =================
// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://localhost:3001",
//   "http://localhost:3002",
//   "https://frontendastro-1.onrender.com",
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
//       return callback(new Error("Not allowed by CORS"));
//     },
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// // ================= Middleware =================
// app.use(helmet());
// app.use(compression());
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));

// // ================= MongoDB Connection =================
// const PORT = process.env.PORT || 7000;

// mongoose.set("strictQuery", false);
// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/astroApp", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

// // ================= Razorpay =================
// let razorpay;
// try {
//   const keyId = process.env.RAZORPAY_KEY_ID;
//   const keySecret = process.env.RAZORPAY_SECRET;

//   if (!keyId || !keySecret) throw new Error("Missing Razorpay keys");

//   razorpay = new Razorpay({
//     key_id: keyId,
//     key_secret: keySecret,
//   });

//   app.locals.razorpay = razorpay;
//   console.log(`💳 Razorpay initialized successfully with key: ${keyId}`);
// } catch (err) {
//   console.error("❌ Razorpay initialization failed:", err.message);
// }

// // ================= ROUTES =================
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/orders", require("./routes/orders"));
// app.use("/api/clients", require("./routes/clients"));
// app.use("/api/astrologers", require("./routes/astrologerRoutes"));
// app.use("/api/reports", require("./routes/reportRoutes"));
// app.use("/api/remedies", require("./routes/remedyRoutes"));
// app.use("/api/consultations", require("./routes/consultationRoutes"));
// app.use("/api/transactions", require("./routes/transaction"));
// app.use("/api/feedbacks", require("./routes/feedbackRoutes"));
// app.use("/api/calculators", require("./routes/calculatorRoutes"));
// app.use("/api/kundlis", require("./routes/kundliRoutes"));
// app.use("/api/services", require("./routes/serviceRoutes"));
// app.use("/api/forms", require("./routes/formRoutes"));
// app.use("/api/submissions", require("./routes/submissionRoutes"));
// app.use("/api/communication", require("./routes/communicationRoutes"));
// app.use("/api/trigger", require("./routes/triggers"));
// app.use("/api/templates", require("./routes/templates"));
// app.use("/api/content", require("./routes/contentRoutes"));
// app.use("/api/manglik", require("./routes/manglikRoute"));
// app.use("/api/numerology", require("./routes/numerologyRoutes"));
// app.use("/api/compatibility", require("./routes/compatibility"));
// app.use("/api/transits", require("./routes/transitRoutes"));
// app.use("/api/dashas", require("./routes/dashaRoutes"));
// app.use("/api/zodiac", require("./routes/zodiacRoutes"));
// app.use("/api/nakshatra", require("./routes/nakshatraRoutes"));
// app.use("/api/planetary", require("./routes/planetaryRoutes"));
// app.use("/api/daily-predictions", require("./routes/dailyPredictionRoutes"));
// app.use("/api/horoscopes", require("./routes/horoscopeRoutes"));
// app.use("/api/panchang", require("./routes/panchangRoutes"));
// app.use("/api/search", require("./routes/searchRoutes"));
// app.use("/api/subscriptions", require("./routes/subscriptionRoutes"));
// app.use("/api/payments", require("./routes/paymentRoutes"));
// app.use("/api/discounts", require("./routes/discountRoutes"));
// app.use("/api/prokerala", require("./routes/prokeralaRoutes"));
// app.use("/api/userweb/auth", require("./routes/userwebAuthRoutes"));
// app.use("/api/userweb", require("./routes/userwebRoutes"));
// app.use("/api/energy-services", require("./routes/energyServiceRoutes"));
// app.use("/api/manifestation", require("./routes/manifestationRoutes"));
// app.use("/wallet", require("./routes/walletRoutes"));
// app.use("/bookings", require("./routes/bookingRoutes"));
// app.use("/user-reports", require("./routes/userReportRoutes"));
// app.use("/api/userweb/devices", require("./routes/deviceRoutes"));
// app.use("/api/userweb/activity", require("./routes/activityRoutes"));


// // ⭐ Your About Route — WORKING PERFECT NOW
// app.use("/api/about", require("./routes/aboutRoutes"));

// app.use("/api/careers", require("./routes/careerRoutes"));
// app.use("/api/dashboard", require("./routes/dashboardStats"));
// app.use("/api/contact", require("./routes/contactRoutes"));
// app.use("/api/our-clients", require("./routes/ourClientsRoutes"));

// // ================= Health Check =================
// app.get("/api/health", (req, res) =>
//   res.json({ status: "OK", time: new Date().toISOString() })
// );

// // ================= Root =================
// app.get("/", (req, res) => res.send("🚀 MERN Astrology Backend Running"));

// // ================= 404 =================
// app.use("/api/*", (req, res) =>
//   res.status(404).json({ success: false, error: "API route not found" })
// );

// // ================= Global Error Handler =================
// app.use((err, req, res, next) => {
//   console.error("🔥 Global Error:", err.stack || err);
//   res.status(err.status || 500).json({
//     success: false,
//     error: err.message || "Internal Server Error",
//   });
// });

// // ================= Cron Jobs =================
// schedule.scheduleJob("0 9 * * *", async () => {
//   const { sendScheduledReminders } = require("./services/automationService");
//   await sendScheduledReminders();
//   console.log("📅 Automated reminders sent at 9 AM");
// });

// // ================= Start Server =================
// server.listen(PORT, () =>
//   console.log(`🌐 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`)
// );
// // ================= Google OAuth2 Callback (Required for Refresh Token) =================
// app.get("/oauth2callback", async (req, res) => {
//   const code = req.query.code;

//   if (!code) {
//     return res.send("No authorization code received.");
//   }

//   res.send(`
//     <h2>Authorization Successful 🎉</h2>
//     <p>Copy this code and paste it into your terminal:</p>
//     <textarea style="width:100%;height:100px;">${code}</textarea>
//   `);
// });

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

// ================= SOCKET.IO FIX =================
const io = socketio(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://frontendastro-1.onrender.com",
      "https://frontendastro-three.vercel.app",
      "https://websitemernastro.vercel.app",
      "https://adminastrotalk-1.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST"]
  },
  transports: ["websocket"], // ⭐ 100% FIX for Render
  allowEIO3: true
});

app.set("io", io);

// Socket listeners
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("sendManualMessage", (data) => {
    io.emit("newMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ================= CORS FIX =================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "https://frontendastro-1.onrender.com",
  "https://frontendastro-three.vercel.app",
  "https://websitemernastro.vercel.app",
  "https://adminastrotalk-1.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ================= SECURITY FIX =================
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

app.use(compression());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ================= MONGO CONNECTION =================
const PORT = process.env.PORT || 7000;

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// ================= RAZORPAY =================
let razorpay;
try {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_SECRET;

  if (!keyId || !keySecret) throw new Error("Missing Razorpay Keys");

  razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  app.locals.razorpay = razorpay;
  console.log("💳 Razorpay initialized");
} catch (err) {
  console.error("❌ Razorpay Error:", err.message);
}

// ================= ROUTES =================
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
app.use("/api/about", require("./routes/aboutRoutes"));
app.use("/api/careers", require("./routes/careerRoutes"));
app.use("/api/dashboard", require("./routes/dashboardStats"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/our-clients", require("./routes/ourClientsRoutes"));
app.use("/api/know-more", require("./routes/knowMoreRoutes"));
app.use("/api/faqs", require("./routes/faqRoutes"));

// ================= STATUS =================
app.get("/api/health", (req, res) =>
  res.json({ status: "OK", time: new Date().toISOString() })
);

app.get("/", (req, res) => res.send("🚀 MERN Astrology Backend Running"));

// ================= 404 =================
app.use("/api/*", (req, res) =>
  res.status(404).json({ success: false, error: "API route not found" })
);

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

// ================= CRON =================
schedule.scheduleJob("0 9 * * *", async () => {
  const { sendScheduledReminders } = require("./services/automationService");
  await sendScheduledReminders();
  console.log("📅 Automated reminders sent at 9 AM");
});

// ================= SERVER START =================
server.listen(PORT, () =>
  console.log(`🌐 Server running on port ${PORT}`)
);

// ================= OAuth =================
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.send("No authorization code received.");
  }

  res.send(`
    <h2>Authorization Successful 🎉</h2>
    <p>Copy this code and paste it into your terminal:</p>
    <textarea style="width:100%;height:100px;">${code}</textarea>
  `);
});




