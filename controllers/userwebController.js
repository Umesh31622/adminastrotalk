// const UserWeb = require("../models/userwebUser");

// // get profile
// exports.getProfile = async (req, res) => {
//   try {
//     const u = await UserWeb.findById(req.params.id).select("-otp -otpExpiry -password");
//     if (!u) return res.status(404).json({ success: false, message: "Not found" });
//     res.json({ success: true, data: u });
//   } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// };

// // update profile
// exports.updateProfile = async (req, res) => {
//   try {
//     const updated = await UserWeb.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json({ success: true, data: updated });
//   } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// };

// // orders
// exports.getOrders = async (req, res) => {
//   try {
//     const u = await UserWeb.findById(req.params.id);
//     res.json({ success: true, data: (u && u.orders) || [] });
//   } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// };

// // payments
// exports.getPayments = async (req, res) => {
//   try {
//     const u = await UserWeb.findById(req.params.id);
//     res.json({ success: true, data: (u && u.payments) || [] });
//   } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// };

// // remedies
// exports.getRemedies = async (req, res) => {
//   try {
//     const u = await UserWeb.findById(req.params.id);
//     res.json({ success: true, data: (u && u.remedies) || [] });
//   } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// };

// // kundli
// exports.getKundli = async (req, res) => {
//   try {
//     const u = await UserWeb.findById(req.params.id);
//     res.json({ success: true, data: (u && u.kundli) || {} });
//   } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// };

// // wallet
// exports.getWallet = async (req, res) => {
//   try {
//     const u = await UserWeb.findById(req.params.id);
//     res.json({ success: true, data: (u && u.wallet) || {} });
//   } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// };

// // full history
// exports.getFullHistory = async (req, res) => {
//   try {
//     const u = await UserWeb.findById(req.params.id);
//     if (!u) return res.status(404).json({ success: false, message: "Not found" });
//     res.json({
//       success: true,
//       data: {
//         profile: { name: u.name, email: u.email, phone: u.phone, dob: u.dob, location: u.location },
//         kundli: u.kundli, orders: u.orders, payments: u.payments, remedies: u.remedies, wallet: u.wallet
//       }
//     });
//   } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// };
const UserWeb = require("../models/userwebUser");

// ===============================
// GET PROFILE
// ===============================
exports.getProfile = async (req, res) => {
  try {
    const u = await UserWeb.findById(req.params.id).select("-otp -otpExpiry -password");
    if (!u)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data: u });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===============================
// UPDATE PROFILE (SECURE)
// ===============================
exports.updateProfile = async (req, res) => {
  try {
    // Only these fields user can change
    const allowed = [
      "name",
      "phone",
      "gender",
      "dob",
      "timeOfBirth",
      "placeOfBirth",
      "location",
      "profileImage",
    ];

    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const updated = await UserWeb.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    res.json({ success: true, data: updated });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===============================
// ORDERS HISTORY
// ===============================
exports.getOrders = async (req, res) => {
  try {
    const u = await UserWeb.findById(req.params.id);
    res.json({ success: true, data: (u && u.orders) || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===============================
// PAYMENTS HISTORY
// ===============================
exports.getPayments = async (req, res) => {
  try {
    const u = await UserWeb.findById(req.params.id);
    res.json({ success: true, data: (u && u.payments) || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===============================
// REMEDIES HISTORY
// ===============================
exports.getRemedies = async (req, res) => {
  try {
    const u = await UserWeb.findById(req.params.id);
    res.json({ success: true, data: (u && u.remedies) || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===============================
// KUNDLI DETAILS
// ===============================
exports.getKundli = async (req, res) => {
  try {
    const u = await UserWeb.findById(req.params.id);
    res.json({ success: true, data: (u && u.kundli) || {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===============================
// WALLET
// ===============================
exports.getWallet = async (req, res) => {
  try {
    const u = await UserWeb.findById(req.params.id);
    res.json({ success: true, data: (u && u.wallet) || {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===============================
// FULL USER HISTORY (ALL DETAILS)
// ===============================
exports.getFullHistory = async (req, res) => {
  try {
    const u = await UserWeb.findById(req.params.id);
    if (!u) return res.status(404).json({ success: false, message: "Not found" });

    res.json({
      success: true,
      data: {
        profile: {
          name: u.name,
          email: u.email,
          phone: u.phone,
          dob: u.dob,
          location: u.location,
        },
        kundli: u.kundli,
        orders: u.orders,
        payments: u.payments,
        remedies: u.remedies,
        wallet: u.wallet,
      },
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
