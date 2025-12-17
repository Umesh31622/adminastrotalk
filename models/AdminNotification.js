const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["BIRTHDAY", "ANNIVERSARY"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userPhone: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "AdminNotification",
  adminNotificationSchema
);
