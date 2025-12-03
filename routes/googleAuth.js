const express = require("express");
const { google } = require("googleapis");
require("dotenv").config();

const router = express.Router();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// STEP 1: Redirect user to Google consent screen
router.get("/auth", (req, res) => {
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

// STEP 2: Handle OAuth2 callback
router.get("/oauth2callback", async (req, res) => {
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

module.exports = router;
