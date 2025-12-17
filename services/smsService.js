exports.sendSMS = async (phone, message) => {
  console.log(`📲 SMS SENT TO ${phone}: ${message}`);

  // Example (Twilio):
  // await client.messages.create({
  //   body: message,
  //   from: process.env.TWILIO_PHONE,
  //   to: phone,
  // });
};
