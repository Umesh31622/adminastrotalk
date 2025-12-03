const Template = require("../models/Template");
const MessageLog = require("../models/MessageLog");
const { sendEmail } = require("./emailService");
const { sendWhatsApp } = require("./whatsappService");

const replacePlaceholders = (content, data) => {
  let result = content;
  for (const key in data) {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
  }
  return result;
};

const triggerMessage = async (eventType, recipient, data) => {
  try {
    const template = await Template.findOne({ name: eventType });
    if (!template) throw new Error("Template not found for event: " + eventType);

    const content = replacePlaceholders(template.content, data);

    if (template.type === "email") await sendEmail({ to: recipient, subject: template.subject, html: content });
    else if (template.type === "whatsapp") await sendWhatsApp({ to: recipient, body: content });

    await MessageLog.create({
      type: template.type,
      recipient,
      templateId: template._id,
      content,
      status: "sent",
    });

    return { success: true };
  } catch (err) {
    console.error("Trigger Error:", err.message);
    return { success: false, error: err.message };
  }
};

module.exports = { triggerMessage };
