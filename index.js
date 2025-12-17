const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();
const { google } = require("googleapis");
const qs = require("qs");

const app = express();
app.use(express.json());

// =================== EMAIL SETUP ===================
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// =================== GOOGLE OAUTH ===================
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

if (process.env.GOOGLE_REFRESH_TOKEN) {
  oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
}

const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

// =================== ROUTES ===================

// --- OAuth callback route ---
app.get("/oauth2callback", (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("No code received from Google");

  console.log("⚡ Authorization code received:", code);

  res.send(`
    <h2>Authorization Code Received!</h2>
    <p>Check backend console for the code.</p>
    <pre>${code}</pre>
    <p>Use this code in your refresh token script to generate token.</p>
  `);
});

// --- Simple Test Route ---
app.get("/", (req, res) => res.send("Server is running"));

// --- Create Google Meet Event ---
app.post("/create-meet", async (req, res) => {
  const { summary, description, startTime, endTime, attendees = [] } = req.body;
  try {
    const event = {
      summary,
      description,
      start: { dateTime: startTime },
      end: { dateTime: endTime },
      attendees: attendees.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(2, 12),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    res.json({ hangoutLink: response.data.hangoutLink });
  } catch (err) {
    console.error("❌ Google Meet API Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Send Email Example ---
app.post("/send-email", async (req, res) => {
  const { to, subject, html } = req.body;
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Email Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// =================== START SERVER ===================
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`⚡ Server running at http://localhost:${PORT}`));
