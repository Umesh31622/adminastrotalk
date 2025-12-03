// // /**
// //  * Run this file once to generate your Google OAuth2 refresh token.
// //  * Steps:
// //  * 1. Set CLIENT_ID, CLIENT_SECRET, REDIRECT_URI in .env
// //  * 2. Run: node generate-refresh-token.js
// //  * 3. Visit the printed URL, grant access, and copy the `code` from the redirected URL
// //  * 4. Paste the code into this file and re-run to get the refresh token
// //  */

// // const { google } = require("googleapis");
// // require("dotenv").config();

// // // OAuth2 client
// // const oAuth2Client = new google.auth.OAuth2(
// //   process.env.CLIENT_ID,
// //   process.env.CLIENT_SECRET,
// //   process.env.REDIRECT_URI
// // );

// // // Google Calendar scope
// // const SCOPES = ["https://www.googleapis.com/auth/calendar"];

// // // Step 1: Generate consent URL
// // const authUrl = oAuth2Client.generateAuthUrl({
// //   access_type: "offline", // offline access is required to get refresh token
// //   scope: SCOPES,
// //   prompt: "consent", // always show consent screen
// // });

// // console.log("🔗 Visit this URL to authorize the app:");
// // console.log(authUrl);
// // console.log("\nAfter granting access, copy the code parameter from the URL.");

// // // Step 2: Paste the code from redirect here
// // const code = "PASTE_CODE_HERE"; // <-- Replace with code from URL

// // async function getRefreshToken() {
// //   try {
// //     const { tokens } = await oAuth2Client.getToken(code);
// //     console.log("\n✅ Access Token:", tokens.access_token);
// //     console.log("🔄 Refresh Token:", tokens.refresh_token);
// //     console.log("💡 Save the refresh token in your .env as GOOGLE_REFRESH_TOKEN");
// //   } catch (err) {
// //     console.error("❌ Error retrieving tokens:", err);
// //   }
// // }

// // // Only run getRefreshToken if the code is replaced
// // if (code !== "PASTE_CODE_HERE") {
// //   getRefreshToken();
// // } else {
// //   console.log("\n⚠️ Please replace PASTE_CODE_HERE with the code from the URL");
// // }
// // const { google } = require('googleapis');

// // const oauth2Client = new google.auth.OAuth2(
// //   process.env.CLIENT_ID,
// //   process.env.CLIENT_SECRET,
// //   process.env.REDIRECT_URI
// // );

// // oauth2Client.setCredentials({
// //   refresh_token: process.env.REFRESH_TOKEN
// // });

// // const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// // async function listEvents() {
// //   const res = await calendar.events.list({
// //     calendarId: process.env.GOOGLE_CALENDAR_ID,
// //     maxResults: 10
// //   });
// //   console.log(res.data.items);
// // }

// // listEvents();


// const { google } = require("googleapis");
// require("dotenv").config();

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   process.env.REDIRECT_URI
// );

// // ✅ Paste your authorization code received from Google OAuth
// const AUTH_CODE = "4/0Ab32j91MZWm6Cxiadr8VI8XR0qQRyySOyRMoMuIKeaN4AoBe-2waYo_3d5ir-XNEDDCr1g";

// async function generateRefreshToken() {
//   try {
//     const { tokens } = await oAuth2Client.getToken(AUTH_CODE);
//     console.log("⚡ Refresh Token:", tokens.refresh_token);

//     // Optional: Save to .env suggestion
//     console.log("\nAdd this line to your .env file:");
//     console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
//   } catch (err) {
//     console.error("❌ Error generating refresh token:", err.message);
//   }
// }

// generateRefreshToken();


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
