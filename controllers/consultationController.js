// // const Consultation = require("../models/Consultation");
// // const nodemailer = require("nodemailer");
// // const { google } = require("googleapis");

// // // =================== Google Calendar Setup ===================
// // const SCOPES = ["https://www.googleapis.com/auth/calendar"];
// // const serviceAccountFile = process.env.GOOGLE_SERVICE_ACCOUNT_FILE || "./service-account.json";
// // const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

// // const auth = new google.auth.GoogleAuth({
// //   keyFile: serviceAccountFile,
// //   scopes: SCOPES,
// // });
// // const calendar = google.calendar({ version: "v3", auth });

// // // =================== Email Setup ===================
// // const createTransporter = () => {
// //   return nodemailer.createTransport({
// //     host: process.env.EMAIL_HOST,
// //     port: Number(process.env.EMAIL_PORT || 587),
// //     secure: process.env.EMAIL_SECURE === "true",
// //     auth: {
// //       user: process.env.EMAIL_USER,
// //       pass: process.env.EMAIL_PASS,
// //     },
// //   });
// // };

// // // =================== GET ===================
// // exports.getConsultations = async (req, res) => {
// //   try {
// //     const consultations = await Consultation.find().sort({ scheduledAt: -1 });
// //     res.json(consultations);
// //   } catch (err) {
// //     console.error("❌ Fetch Error:", err.message);
// //     res.status(500).json({ success: false, error: err.message });
// //   }
// // };

// // // =================== CREATE ===================
// // exports.createConsultation = async (req, res) => {
// //   try {
// //     const { clientName, clientEmail, astrologerName, type, status, scheduledAt, notes } = req.body;

// //     if (!clientName || !clientEmail || !astrologerName) {
// //       return res.status(400).json({
// //         success: false,
// //         error: "Client Name, Email, and Astrologer Name are required",
// //       });
// //     }

// //     const eventStart = scheduledAt ? new Date(scheduledAt) : new Date();
// //     const eventEnd = new Date(eventStart.getTime() + 30 * 60000); // 30 min meeting

// //     // ======= Create Google Calendar Event with Google Meet =======
// //     let googleMeetLink = "";
// //     let calendarError = null;
// //     try {
// //       const event = await calendar.events.insert({
// //         calendarId,
// //         requestBody: {
// //           summary: `Consultation: ${clientName} - ${astrologerName}`,
// //           description: `Type: ${type || "Chat"}\nNotes: ${notes || "None"}`,
// //           start: { dateTime: eventStart.toISOString(), timeZone: "Asia/Kolkata" },
// //           end: { dateTime: eventEnd.toISOString(), timeZone: "Asia/Kolkata" },
// //           attendees: [{ email: clientEmail }],
// //           conferenceData: {
// //             createRequest: {
// //               requestId: `meet-${Math.random().toString(36).substring(2, 10)}`,
// //               conferenceSolutionKey: { type: "hangoutsMeet" },
// //             },
// //           },
// //         },
// //         conferenceDataVersion: 1,
// //       });

// //       googleMeetLink = event.data.hangoutLink || "";
// //     } catch (err) {
// //       console.error("❌ Calendar Error:", err.message);
// //       calendarError = err.message;
// //     }

// //     // ======= Save Consultation =======
// //     const newConsultation = new Consultation({
// //       clientName,
// //       clientEmail,
// //       astrologerName,
// //       type: type || "Chat",
// //       status: status || "Pending",
// //       scheduledAt: eventStart,
// //       notes: notes || "",
// //       meetingLink: googleMeetLink, // Google Meet link saved
// //     });

// //     const saved = await newConsultation.save();

// //     // ======= Send Email =======
// //     let emailError = null;
// //     try {
// //       if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
// //         const transporter = createTransporter();
// //         const mailOptions = {
// //           from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
// //           to: clientEmail,
// //           subject: "Your Astrology Consultation Link",
// //           html: `
// //             <p>Hello ${clientName},</p>
// //             <p>Your consultation with <b>${astrologerName}</b> is scheduled at <b>${eventStart.toLocaleString()}</b>.</p>
// //             <p>Join via Google Meet: <a href="${googleMeetLink}" target="_blank">${googleMeetLink}</a></p>
// //             <p>Notes: ${notes || "None"}</p>
// //             <p>Regards,<br/>Astro Team</p>
// //           `,
// //         };
// //         await transporter.sendMail(mailOptions);
// //       }
// //     } catch (err) {
// //       console.error("❌ Email Error:", err.message);
// //       emailError = err.message;
// //     }

// //     res.status(201).json({ consultation: saved, emailError, calendarError });
// //   } catch (err) {
// //     console.error("❌ Error creating consultation:", err.message);
// //     res.status(500).json({ success: false, error: err.message });
// //   }
// // };

// // // =================== UPDATE ===================
// // exports.updateConsultation = async (req, res) => {
// //   try {
// //     const updated = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true });
// //     if (!updated) return res.status(404).json({ success: false, error: "Consultation not found" });
// //     res.json(updated);
// //   } catch (err) {
// //     console.error("❌ Update Error:", err.message);
// //     res.status(400).json({ success: false, error: err.message });
// //   }
// // };

// // // =================== DELETE ===================
// // exports.deleteConsultation = async (req, res) => {
// //   try {
// //     const deleted = await Consultation.findByIdAndDelete(req.params.id);
// //     if (!deleted) return res.status(404).json({ success: false, error: "Consultation not found" });
// //     res.json({ success: true, message: "Deleted successfully" });
// //   } catch (err) {
// //     console.error("❌ Delete Error:", err.message);
// //     res.status(500).json({ success: false, error: err.message });
// //   }
// // };

// const Consultation = require("../models/Consultation");
// const nodemailer = require("nodemailer");
// const { google } = require("googleapis");

// // =================== Google Calendar Setup ===================
// const SCOPES = ["https://www.googleapis.com/auth/calendar"];
// const serviceAccountFile = process.env.GOOGLE_SERVICE_ACCOUNT_FILE || "./service-account.json";
// const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

// const auth = new google.auth.GoogleAuth({
//   keyFile: serviceAccountFile,
//   scopes: SCOPES,
// });
// const calendar = google.calendar({ version: "v3", auth });

// // =================== Email Setup ===================
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: Number(process.env.EMAIL_PORT || 587),
//     secure: process.env.EMAIL_SECURE === "true",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
// };

// // =================== GET ===================
// exports.getConsultations = async (req, res) => {
//   try {
//     const consultations = await Consultation.find().sort({ scheduledAt: -1 });
//     res.json(consultations);
//   } catch (err) {
//     console.error("❌ Fetch Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // =================== CREATE ===================
// exports.createConsultation = async (req, res) => {
//   try {
//     const { clientName, clientEmail, astrologerName, type, status, scheduledAt, notes } = req.body;

//     if (!clientName || !clientEmail || !astrologerName) {
//       return res.status(400).json({
//         success: false,
//         error: "Client Name, Email, and Astrologer Name are required",
//       });
//     }

//     const eventStart = scheduledAt ? new Date(scheduledAt) : new Date();
//     const eventEnd = new Date(eventStart.getTime() + 30 * 60000); // 30 min meeting

//     // ======= Create Google Calendar Event with Google Meet =======
//     let googleMeetLink = "";
//     let calendarError = null;
//     try {
//       const event = await calendar.events.insert({
//         calendarId,
//         requestBody: {
//           summary: `Consultation: ${clientName} - ${astrologerName}`,
//           description: `Type: ${type || "Chat"}\nNotes: ${notes || "None"}`,
//           start: { dateTime: eventStart.toISOString(), timeZone: "Asia/Kolkata" },
//           end: { dateTime: eventEnd.toISOString(), timeZone: "Asia/Kolkata" },
//           attendees: [{ email: clientEmail }],
//           conferenceData: {
//             createRequest: {
//               requestId: `meet-${Math.floor(Math.random() * 1000000)}`,
//               conferenceSolutionKey: { type: "hangoutsMeet" },
//             },
//           },
//         },
//         conferenceDataVersion: 1,
//       });

//       googleMeetLink = event.data.hangoutLink || "";
//       if (!googleMeetLink) console.warn("⚠️ Google Meet link not created. Check calendar permissions!");
//     } catch (err) {
//       console.error("❌ Calendar Error:", err.message);
//       calendarError = err.message;
//     }

//     // ======= Save Consultation =======
//     const newConsultation = new Consultation({
//       clientName,
//       clientEmail,
//       astrologerName,
//       type: type || "Chat",
//       status: status || "Pending",
//       scheduledAt: eventStart,
//       notes: notes || "",
//       meetingLink: googleMeetLink, // Google Meet link saved
//     });

//     const saved = await newConsultation.save();

//     // ======= Send Email =======
//     let emailError = null;
//     try {
//       if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
//         const transporter = createTransporter();
//         const mailOptions = {
//           from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
//           to: clientEmail,
//           subject: "Your Astrology Consultation Google Meet Link",
//           html: `
//             <p>Hello ${clientName},</p>
//             <p>Your consultation with <b>${astrologerName}</b> is scheduled at <b>${eventStart.toLocaleString()}</b>.</p>
//             <p>Join via Google Meet: <a href="${googleMeetLink}" target="_blank">${googleMeetLink}</a></p>
//             <p>Notes: ${notes || "None"}</p>
//             <p>Regards,<br/>Astro Team</p>
//           `,
//         };
//         await transporter.sendMail(mailOptions);
//       }
//     } catch (err) {
//       console.error("❌ Email Error:", err.message);
//       emailError = err.message;
//     }

//     res.status(201).json({ consultation: saved, emailError, calendarError, googleMeetLink });
//   } catch (err) {
//     console.error("❌ Error creating consultation:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // =================== UPDATE ===================
// exports.updateConsultation = async (req, res) => {
//   try {
//     const updated = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ success: false, error: "Consultation not found" });
//     res.json(updated);
//   } catch (err) {
//     console.error("❌ Update Error:", err.message);
//     res.status(400).json({ success: false, error: err.message });
//   }
// };

// // =================== DELETE ===================
// exports.deleteConsultation = async (req, res) => {
//   try {
//     const deleted = await Consultation.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ success: false, error: "Consultation not found" });
//     res.json({ success: true, message: "Deleted successfully" });
//   } catch (err) {
//     console.error("❌ Delete Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// const Consultation = require("../models/Consultation");
// const nodemailer = require("nodemailer");

// // =================== Email Setup ===================
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: Number(process.env.EMAIL_PORT || 587),
//     secure: process.env.EMAIL_SECURE === "true",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
// };

// // =================== Helper ===================
// const generateGoogleMeetLink = () => {
//   const part1 = Math.random().toString(36).substring(2, 5);
//   const part2 = Math.random().toString(36).substring(2, 5);
//   const part3 = Math.random().toString(36).substring(2, 5);
//   return `https://meet.google.com/${part1}-${part2}-${part3}`;
// };

// // =================== GET ===================
// exports.getConsultations = async (req, res) => {
//   try {
//     const consultations = await Consultation.find().sort({ scheduledAt: -1 });
//     res.json(consultations);
//   } catch (err) {
//     console.error("❌ Fetch Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // =================== CREATE ===================
// exports.createConsultation = async (req, res) => {
//   try {
//     const { clientName, clientEmail, astrologerName, type, status, scheduledAt, notes } = req.body;

//     if (!clientName || !clientEmail || !astrologerName) {
//       return res.status(400).json({ success: false, error: "Client Name, Email, and Astrologer Name are required" });
//     }

//     const eventStart = scheduledAt ? new Date(scheduledAt) : new Date();

//     // ======= Generate Random Google Meet Link =======
//     const googleMeetLink = generateGoogleMeetLink();

//     // ======= Save Consultation =======
//     const newConsultation = new Consultation({
//       clientName,
//       clientEmail,
//       astrologerName,
//       type: type || "Chat",
//       status: status || "Pending",
//       scheduledAt: eventStart,
//       notes: notes || "",
//       meetingLink: googleMeetLink, // Random Meet Link
//     });

//     const saved = await newConsultation.save();

//     // ======= Send Email =======
//     let emailError = null;
//     try {
//       if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
//         const transporter = createTransporter();
//         const mailOptions = {
//           from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
//           to: clientEmail,
//           subject: "Your Astrology Consultation Link",
//           html: `
//             <p>Hello ${clientName},</p>
//             <p>Your consultation with <b>${astrologerName}</b> is scheduled at <b>${eventStart.toLocaleString()}</b>.</p>
//             <p>Join via Google Meet: <a href="${googleMeetLink}" target="_blank">${googleMeetLink}</a></p>
//             <p>Notes: ${notes || "None"}</p>
//             <p>Regards,<br/>Astro Team</p>
//           `,
//         };
//         await transporter.sendMail(mailOptions);
//       }
//     } catch (err) {
//       console.error("❌ Email Error:", err.message);
//       emailError = err.message;
//     }

//     res.status(201).json({ consultation: saved, emailError });
//   } catch (err) {
//     console.error("❌ Error creating consultation:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // =================== UPDATE ===================
// exports.updateConsultation = async (req, res) => {
//   try {
//     const updated = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ success: false, error: "Consultation not found" });
//     res.json(updated);
//   } catch (err) {
//     console.error("❌ Update Error:", err.message);
//     res.status(400).json({ success: false, error: err.message });
//   }
// };

// // =================== DELETE ===================
// exports.deleteConsultation = async (req, res) => {
//   try {
//     const deleted = await Consultation.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ success: false, error: "Consultation not found" });
//     res.json({ success: true, message: "Deleted successfully" });
//   } catch (err) {
//     console.error("❌ Delete Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };
<<<<<<< HEAD
const Consultation = require("../models/Consultation");
const { google } = require("googleapis");

/* ================= GOOGLE MEET SETUP ================= */
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({
  version: "v3",
  auth: oAuth2Client,
});

/* ================= CREATE GOOGLE MEET ================= */
async function createGoogleMeet({ summary, start, end, email }) {
  try {
    await oAuth2Client.getAccessToken(); // 🔥 IMPORTANT

    const event = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      resource: {
        summary,
        start: { dateTime: start },
        end: { dateTime: end },
        attendees: [{ email }],
        conferenceData: {
          createRequest: {
            requestId: Math.random().toString(36).substring(2),
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    return event.data.hangoutLink || "";
  } catch (err) {
    console.error("❌ Google Meet failed:", err.message);
    return ""; // ❗ meet fail ho sakta hai, app fail nahi hogi
  }
}

/* ================= CREATE CONSULTATION ================= */
exports.createConsultation = async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      astrologerName,
      type,
      scheduledAt,
      notes,
    } = req.body;

    if (!clientName || !clientEmail || !astrologerName || !scheduledAt) {
      return res.status(400).json({
        success: false,
        error: "Client name, email, astrologer & date required",
      });
    }

    const start = new Date(scheduledAt);
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid date",
      });
    }

    const end = new Date(start.getTime() + 60 * 60 * 1000);

    let meetLink = "";
    meetLink = await createGoogleMeet({
      summary: `${clientName} with ${astrologerName}`,
      start: start.toISOString(),
      end: end.toISOString(),
      email: clientEmail,
    });

    const consultation = await Consultation.create({
      clientName,
      clientEmail,
      astrologerName,
      type: type || "Video",
      status: "Pending",
      scheduledAt: start,
      notes: notes || "",
      meetingLink: meetLink,
    });

    res.status(201).json({ success: true, consultation });
  } catch (err) {
    console.error("❌ Create error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to schedule consultation",
    });
  }
};

/* ================= USER CONSULTATIONS ================= */
exports.getUserConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({
      clientEmail: req.params.email,
    }).sort({ scheduledAt: -1 });

    res.json({ success: true, consultations });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch consultations",
    });
  }
};

/* ================= ADMIN ================= */
exports.getConsultations = async (req, res) => {
  const consultations = await Consultation.find().sort({ scheduledAt: -1 });
  res.json({ success: true, consultations });
};

exports.updateConsultation = async (req, res) => {
  const updated = await Consultation.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ success: true, consultation: updated });
};

exports.deleteConsultation = async (req, res) => {
  await Consultation.findByIdAndDelete(req.params.id);
  res.json({ success: true });
=======


const Consultation = require("../models/Consultation");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// =================== Google Meet Setup ===================
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

if (!REFRESH_TOKEN) throw new Error("Google Refresh Token missing in .env");

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

// =================== Google Meet Event Function ===================
async function createGoogleMeetEvent({ summary, description, startTime, endTime, attendees = [] }) {
  try {
    // Force refresh access token before creating event
    await oAuth2Client.getAccessToken();

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
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    return response.data.hangoutLink;
  } catch (err) {
    console.error("❌ Google Meet API Error:", err.message);
    return ""; // Return empty string if Meet link creation fails
  }
}

// =================== Email Setup ===================
const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === "true",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

// =================== GET ALL ===================
exports.getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ scheduledAt: -1 });
    res.json({ success: true, consultations });
  } catch (err) {
    console.error("❌ Fetch Error:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch consultations" });
  }
};

// =================== CREATE ===================
exports.createConsultation = async (req, res) => {
  try {
    const { clientName, clientEmail, astrologerName, type, status, scheduledAt, notes } = req.body;

    if (!clientName || !clientEmail || !astrologerName)
      return res.status(400).json({ success: false, error: "Client Name, Email, and Astrologer Name are required" });

    const eventStart = scheduledAt ? new Date(scheduledAt) : new Date();
    if (isNaN(eventStart.getTime()))
      return res.status(400).json({ success: false, error: "Invalid scheduled date/time" });

    const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000); // 1 hour

    // ======= Create Google Meet Link =======
    const googleMeetLink = await createGoogleMeetEvent({
      summary: `Consultation: ${clientName} with ${astrologerName}`,
      description: notes || "",
      startTime: eventStart.toISOString(),
      endTime: eventEnd.toISOString(),
      attendees: [clientEmail],
    });

    // ======= Save Consultation =======
    const newConsultation = new Consultation({
      clientName,
      clientEmail,
      astrologerName,
      type: type || "Chat",
      status: status || "Pending",
      scheduledAt: eventStart,
      notes: notes || "",
      meetingLink: googleMeetLink,
    });

    const saved = await newConsultation.save();

    // ======= Send Email =======
    let emailError = null;
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS && clientEmail) {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: clientEmail,
          subject: "Your Astrology Consultation Link",
          html: `
            <p>Hello ${clientName},</p>
            <p>Your consultation with <b>${astrologerName}</b> is scheduled at <b>${eventStart.toLocaleString()}</b>.</p>
            <p>Join via Google Meet: ${
              googleMeetLink ? `<a href="${googleMeetLink}" target="_blank">${googleMeetLink}</a>` : "Not available"
            }</p>
            <p>Notes: ${notes || "None"}</p>
            <p>Regards,<br/>Astro Team</p>
          `,
        });
      }
    } catch (err) {
      console.error("❌ Email Error:", err.message);
      emailError = err.message;
    }

    res.status(201).json({ success: true, consultation: saved, googleMeetLink, emailError });
  } catch (err) {
    console.error("❌ Error creating consultation:", err.message);
    res.status(500).json({ success: false, error: "Failed to create consultation" });
  }
};

// =================== UPDATE ===================
exports.updateConsultation = async (req, res) => {
  try {
    const updated = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, error: "Consultation not found" });
    res.json({ success: true, consultation: updated });
  } catch (err) {
    console.error("❌ Update Error:", err.message);
    res.status(400).json({ success: false, error: "Failed to update consultation" });
  }
};

// =================== DELETE ===================
exports.deleteConsultation = async (req, res) => {
  try {
    const deleted = await Consultation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Consultation not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Error:", err.message);
    res.status(500).json({ success: false, error: "Failed to delete consultation" });
  }
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
};
