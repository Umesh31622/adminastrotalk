


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

// // ================= SOCKET.IO =================
// const io = socketio(server, {
//   cors: {
//     origin: ["https://frontendastro-1.onrender.com"],
//     credentials: true,
//   },
// });

// // ================= CORS =================
// const allowedOrigins = ["https://frontendastro-1.onrender.com"];
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
//       return callback(new Error("Not allowed by CORS"));
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );
// app.options("*", cors());

// // ================= MIDDLEWARE =================
// app.use(helmet());
// app.use(compression());
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));

// // ================= MONGODB CONNECTION =================
// const PORT = process.env.PORT || 7000;
// mongoose.set("strictQuery", false);
// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/astroApp", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

// // ================= RAZORPAY CONFIG =================
// let razorpay;
// try {
//   razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_SECRET,
//   });
//   app.locals.razorpay = razorpay;
//   console.log("💳 Razorpay initialized successfully");
// } catch (err) {
//   console.error("❌ Razorpay initialization failed:", err.message);
// }

// // ================= SOCKET.IO EVENTS =================
// io.on("connection", (socket) => {
//   console.log("⚡ User connected:", socket.id);

//   socket.on("sendManualMessage", (data) => {
//     io.emit("newMessage", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//   });
// });
// app.set("io", io);

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

// // ================= CONTENT VAULT =================
// const { auth, admin } = require("./middleware/auth");
// const upload = require("./middleware/upload");
// const { createContent, getContent } = require("./controllers/contentController");
// app.post("/api/vault", auth, admin, upload.single("file"), createContent);
// app.get("/api/vault", auth, getContent);

// // ================= STATIC UPLOADS =================
// app.use(
//   "/uploads",
//   express.static(path.resolve(process.env.UPLOAD_PATH || "./uploads"))
// );

// // ================= HEALTH CHECK =================
// app.get("/api/health", (req, res) =>
//   res.json({ status: "✅ OK", time: new Date().toISOString() })
// );

// // ================= GOOGLE OAUTH =================
// const oAuth2Client = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   process.env.REDIRECT_URI
// );

// // Step 1: Redirect user to Google consent screen
// app.get("/auth", (req, res) => {
//   const scopes = [
//     "https://www.googleapis.com/auth/calendar",
//     "https://www.googleapis.com/auth/calendar.events",
//     "https://www.googleapis.com/auth/meetings.space.created",
//     "https://www.googleapis.com/auth/userinfo.email",
//     "https://www.googleapis.com/auth/userinfo.profile",
//   ];

//   const url = oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     prompt: "consent",
//     scope: scopes,
//   });

//   res.redirect(url);
// });

// // Step 2: Handle OAuth2 callback
// app.get("/oauth2callback", async (req, res) => {
//   const code = req.query.code;
//   if (!code) return res.status(400).send("No authorization code found");

//   try {
//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens);

//     console.log("✅ Tokens:", tokens);

//     res.send(`
//       <h3>✅ Authentication successful!</h3>
//       <p>Copy your refresh token and add it to .env file:</p>
//       <pre>GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}</pre>
//     `);
//   } catch (err) {
//     console.error("❌ Error in OAuth callback:", err.message);
//     res.status(500).send("Error retrieving tokens");
//   }
// });

// // ================= ROOT ROUTE =================
// app.get("/", (req, res) => res.send("🚀 MERN Astrology Backend Running"));

// // ================= 404 HANDLER =================
// app.use("/api/*", (req, res) =>
//   res.status(404).json({ success: false, error: "API route not found" })
// );

// // ================= GLOBAL ERROR HANDLER =================
// app.use((err, req, res, next) => {
//   console.error("🔥 Global Error:", err.stack || err);
//   res.status(err.status || 500).json({
//     success: false,
//     error: err.message || "Internal Server Error",
//   });
// });

// // ================= CRON JOB =================
// schedule.scheduleJob("0 9 * * *", async () => {
//   const { sendScheduledReminders } = require("./services/automationService");
//   await sendScheduledReminders();
//   console.log("📅 Automated reminders sent at 9 AM");
// });

// // ================= SERVE FRONTEND IN PRODUCTION =================
// if (process.env.NODE_ENV === "production") {
//   const frontendPath = path.join(__dirname, "frontend", "build");
//   app.use(express.static(frontendPath));
//   app.get(/^\/(?!api).*/, (req, res) =>
//     res.sendFile(path.join(frontendPath, "index.html"))
//   );
// }

// // ================= START SERVER =================
// server.listen(PORT, () =>
//   console.log(
//     `🌐 Server running on port ${PORT} in ${
//       process.env.NODE_ENV || "development"
//     } mode`
//   )
// );

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
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

// ================= SOCKET.IO =================
const io = socketio(server, {
  cors: {
    origin: ["https://frontendastro-1.onrender.com", "http://localhost:3000"],
    credentials: true,
  },
});

// ================= CORS =================
const allowedOrigins = [
  "https://frontendastro-1.onrender.com",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());

// ================= MIDDLEWARE =================
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ================= MONGODB CONNECTION =================
const PORT = process.env.PORT || 7000;
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/astroApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

// ================= RAZORPAY CONFIG =================
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
  app.locals.razorpay = razorpay;
  console.log("💳 Razorpay initialized successfully");
} catch (err) {
  console.error("❌ Razorpay initialization failed:", err.message);
}

// ================= SOCKET.IO EVENTS =================
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("sendManualMessage", (data) => {
    io.emit("newMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});
app.set("io", io);

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

// ================= CONTENT VAULT =================
const { auth, admin } = require("./middleware/auth");
const upload = require("./middleware/upload");
const { createContent, getContent } = require("./controllers/contentController");
app.post("/api/vault", auth, admin, upload.single("file"), createContent);
app.get("/api/vault", auth, getContent);

// ================= STATIC UPLOADS =================
app.use(
  "/uploads",
  express.static(path.resolve(process.env.UPLOAD_PATH || "./uploads"))
);

// ================= HEALTH CHECK =================
app.get("/api/health", (req, res) =>
  res.json({ status: "✅ OK", time: new Date().toISOString() })
);

// ================= GOOGLE OAUTH =================
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Step 1: Redirect user to Google consent screen
app.get("/auth", (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/meetings.space.created",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });

  res.redirect(url);
});

// Step 2: Handle OAuth2 callback
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("No authorization code found");

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    console.log("✅ Tokens:", tokens);

    res.send(`
      <h3>✅ Authentication successful!</h3>
      <p>Copy your refresh token and add it to .env file:</p>
      <pre>GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}</pre>
    `);
  } catch (err) {
    console.error("❌ Error in OAuth callback:", err.message);
    res.status(500).send("Error retrieving tokens");
  }
});

// ================= ROOT ROUTE =================
app.get("/", (req, res) => res.send("🚀 MERN Astrology Backend Running"));

// ================= 404 HANDLER =================
app.use("/api/*", (req, res) =>
  res.status(404).json({ success: false, error: "API route not found" })
);

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

// ================= CRON JOB =================
schedule.scheduleJob("0 9 * * *", async () => {
  const { sendScheduledReminders } = require("./services/automationService");
  await sendScheduledReminders();
  console.log("📅 Automated reminders sent at 9 AM");
});

// ================= SERVE FRONTEND IN PRODUCTION =================
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend", "build");
  app.use(express.static(frontendPath));
  app.get(/^\/(?!api).*/, (req, res) =>
    res.sendFile(path.join(frontendPath, "index.html"))
  );
}

// ================= START SERVER =================
server.listen(PORT, () =>
  console.log(
    `🌐 Server running on port ${PORT} in ${
      process.env.NODE_ENV || "development"
    } mode`
  )
);
