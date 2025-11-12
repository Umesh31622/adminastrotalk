// // const { google } = require("googleapis");
// // const path = require("path");

// // // Service account key path
// // const KEYFILEPATH = path.join(__dirname, "../service-account.json");
// // const SCOPES = ["https://www.googleapis.com/auth/calendar"];

// // const auth = new google.auth.GoogleAuth({
// //   keyFile: KEYFILEPATH,
// //   scopes: SCOPES,
// // });

// // const calendar = google.calendar({ version: "v3", auth });

// // async function createGoogleMeetEvent({ summary, description, startTime, endTime, attendees = [] }) {
// //   const event = {
// //     summary,
// //     description,
// //     start: { dateTime: startTime },
// //     end: { dateTime: endTime },
// //     attendees: attendees.map(email => ({ email })),
// //     conferenceData: {
// //       createRequest: {
// //         requestId: Math.random().toString(36).substring(2, 12),
// //         conferenceSolutionKey: { type: "hangoutsMeet" },
// //       },
// //     },
// //   };

// //   const response = await calendar.events.insert({
// //     calendarId: "primary", // ya astrologer ka calendar ID
// //     resource: event,
// //     conferenceDataVersion: 1,
// //   });

// //   return response.data.hangoutLink; // Real Google Meet link
// // }

// // module.exports = { createGoogleMeetEvent };

// // utils/googleMeet.js
// // utils/googleMeet.js
// const { google } = require("googleapis");
// require("dotenv").config();

// // ======= Google OAuth Credentials =======
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;
// const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN; // make sure this matches your .env

// const oAuth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URI
// );

// // Set credentials using refresh token
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// // ======= Google Calendar Instance =======
// const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

// // ======= Create Google Meet Event Function =======
// async function createGoogleMeetEvent({ summary, description, startTime, endTime, attendees = [] }) {
//   if (!REFRESH_TOKEN) {
//     throw new Error("Google Refresh Token is missing. Please set GOOGLE_REFRESH_TOKEN in your .env file.");
//   }

//   const event = {
//     summary,
//     description,
//     start: { dateTime: startTime },
//     end: { dateTime: endTime },
//     attendees: attendees.map(email => ({ email })),
//     conferenceData: {
//       createRequest: {
//         requestId: Math.random().toString(36).substring(2, 12),
//         conferenceSolutionKey: { type: "hangoutsMeet" },
//       },
//     },
//   };

//   try {
//     const response = await calendar.events.insert({
//       calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
//       resource: event,
//       conferenceDataVersion: 1,
//     });

//     return response.data.hangoutLink; // returns Google Meet link
//   } catch (err) {
//     console.error("❌ Google Meet API Error:", err.message);
//     throw err;
//   }
// }

// module.exports = { createGoogleMeetEvent };


// utils/googleMeet.js
// utils/googleMeet.js


const { google } = require("googleapis");
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

if (!REFRESH_TOKEN) throw new Error("Google Refresh Token missing in .env");

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// ======= Google Calendar Instance =======
const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

// ======= Create Google Meet Event =======
async function createGoogleMeetEvent({
  summary,
  description,
  startTime,
  endTime,
  attendees = [],
}) {
  const event = {
    summary,
    description,
    start: { dateTime: startTime },
    end: { dateTime: endTime },
    attendees: attendees.map((email) => ({ email })),
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(2, 12),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    console.log("✅ Google Meet Link Created:", response.data.hangoutLink);
    return response.data.hangoutLink;
  } catch (err) {
    console.error("❌ Google Meet API Error:", err.message);
    throw err;
  }
}

module.exports = { createGoogleMeetEvent };

