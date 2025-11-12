const nodemailer = require("nodemailer");
const twilio = require("twilio");

// ======= Twilio Setup with Safety Check =======
let twilioClient = null;
if (!process.env.TWILIO_SID || !process.env.TWILIO_SID.startsWith("AC")) {
  console.warn("⚠️ Invalid or missing TWILIO_SID. WhatsApp messages will not be sent.");
} else if (!process.env.TWILIO_AUTH_TOKEN) {
  console.warn("⚠️ Missing TWILIO_AUTH_TOKEN. WhatsApp messages will not be sent.");
} else {
  try {
    twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (err) {
    console.error("❌ Twilio initialization failed:", err.message);
  }
}

// ======= Nodemailer Setup with Safety Check =======
let transporter = null;
if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("⚠️ Missing email credentials. Email messages will not be sent.");
} else {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// ======= Send Message Function =======
exports.sendMessage = async (req, res) => {
  try {
    const { body } = req; // { to, channel, templateId, variables, subject, content }

    if (body.channel === "whatsapp") {
      if (!twilioClient) {
        console.warn("⚠️ WhatsApp message skipped (Twilio not configured)");
      } else {
        await twilioClient.messages.create({
          from: process.env.TWILIO_WHATSAPP_NUMBER,
          to: `whatsapp:${body.to}`,
          body: body.content || "Hello from MERN App!",
        });
        console.log(`✅ WhatsApp sent to ${body.to}`);
      }
    } else if (body.channel === "email") {
      if (!transporter) {
        console.warn("⚠️ Email message skipped (Nodemailer not configured)");
      } else {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: body.to,
          subject: body.subject || "Notification from MERN App",
          html: body.content || "<p>Hello from MERN App!</p>",
        };
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${body.to}`);
      }
    } else {
      console.warn("❌ Unknown channel:", body.channel);
    }

    if (res && res.json) {
      res.json({ success: true, message: "Message processed (may be skipped if credentials missing)" });
    }
  } catch (err) {
    console.error("❌ Error sending message:", err.message);
    if (res && res.status) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
};
