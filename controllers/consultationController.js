
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
};
