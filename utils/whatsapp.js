const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendWhatsApp({ to, body }) {
  // to should be in whatsapp:+91XXXXXXXXXX format
  const message = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to,
    body
  });
  return message;
}

module.exports = { sendWhatsApp };
