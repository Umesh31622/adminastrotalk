// const User = require("../models/User");
// const AdminNotification = require("../models/AdminNotification");
// const { sendSMS } = require("./smsService");

// exports.runBirthdayAnniversaryAutomation = async (io) => {
//   try {
//     const today = new Date();
//     const day = today.getDate();
//     const month = today.getMonth();

//     const users = await User.find({
//       $or: [{ dob: { $exists: true } }, { anniversary: { $exists: true } }],
//     });

//     for (const user of users) {
//       // 🎂 Birthday
//       if (
//         user.dob &&
//         user.dob.getDate() === day &&
//         user.dob.getMonth() === month
//       ) {
//         const msg = `🎉 Happy Birthday ${user.name}! Wishing you happiness & success.`;

//         await sendSMS(user.phone, msg);

//         const notif = await AdminNotification.create({
//           title: "🎂 Birthday Alert",
//           message: `${user.name} has Birthday today`,
//           type: "BIRTHDAY",
//           userName: user.name,
//           userPhone: user.phone,
//         });

//         io.emit("adminNotification", notif);
//       }

//       // 💍 Anniversary
//       if (
//         user.anniversary &&
//         user.anniversary.getDate() === day &&
//         user.anniversary.getMonth() === month
//       ) {
//         const msg = `💍 Happy Anniversary ${user.name}! May love & harmony always stay with you.`;

//         await sendSMS(user.phone, msg);

//         const notif = await AdminNotification.create({
//           title: "💍 Anniversary Alert",
//           message: `${user.name} has Anniversary today`,
//           type: "ANNIVERSARY",
//           userName: user.name,
//           userPhone: user.phone,
//         });

//         io.emit("adminNotification", notif);
//       }
//     }

//     console.log("✅ Birthday & Anniversary automation completed");
//   } catch (err) {
//     console.error("❌ Relationship automation error:", err.message);
//   }
// };

const User = require("../models/User");
const AdminNotification = require("../models/AdminNotification");
const { sendSMS } = require("./smsService");

exports.runBirthdayAnniversaryAutomation = async (io) => {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();

    const users = await User.find({
      $or: [
        { dob: { $exists: true, $ne: null } },
        { anniversary: { $exists: true, $ne: null } },
      ],
    });

    for (const user of users) {
      // 🎂 Birthday
      if (
        user.dob &&
        user.dob.getDate() === day &&
        user.dob.getMonth() === month
      ) {
        const msg = `🎉 Happy Birthday ${user.name}!`;

        await sendSMS(user.phone, msg);

        const notif = await AdminNotification.create({
          type: "BIRTHDAY",
          message: `${user.name} has Birthday today`,
          userName: user.name,
          userPhone: user.phone,
          read: false,
        });

        io.emit("adminNotification", notif);
      }

      // 💍 Anniversary
      if (
        user.anniversary &&
        user.anniversary.getDate() === day &&
        user.anniversary.getMonth() === month
      ) {
        const msg = `💍 Happy Anniversary ${user.name}!`;

        await sendSMS(user.phone, msg);

        const notif = await AdminNotification.create({
          type: "ANNIVERSARY",
          message: `${user.name} has Anniversary today`,
          userName: user.name,
          userPhone: user.phone,
          read: false,
        });

        io.emit("adminNotification", notif);
      }
    }

    console.log("✅ Birthday & Anniversary automation completed");
  } catch (err) {
    console.error("❌ Relationship automation error:", err.message);
  }
};

