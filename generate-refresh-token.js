
const { google } = require("googleapis");
const readline = require("readline");
require("dotenv").config();

// ======= OAuth2 Client =======
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// ======= Scopes for Calendar + Google Meet =======
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",            
  "https://www.googleapis.com/auth/calendar.events",     
  "https://www.googleapis.com/auth/calendar.events.owned"
];

// ======= Generate Auth URL =======
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent",
});

console.log("\n🔗 Visit this URL to authorize the app:");
console.log(authUrl);
console.log("\nAfter granting access, copy the 'code' from the redirected URL.\n");

// ======= Read code from terminal =======
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Paste the code here: ", async (code) => {
  rl.close();

  if (!code) {
    console.log("❌ No code provided. Exiting.");
    process.exit(1);
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oAuth2Client.getToken(code.trim());
    oAuth2Client.setCredentials(tokens);

    console.log("\n✅ Success! Your tokens are:");
    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token);

    console.log("\n💡 Save the refresh token in your .env as:");
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);

    console.log("\nNow you can use this refresh token in your backend for Google Meet API.");
  } catch (err) {
    console.error("❌ Error generating refresh token:", err.message);
  }
});
