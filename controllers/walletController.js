
const Wallet = require("../models/Wallet");

/* ===========================================================
   ⭐ GET WALLET
=========================================================== */
exports.getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.params.userId });

    // If wallet doesn't exist → create new
    if (!wallet) {
      wallet = await Wallet.create({
        userId: req.params.userId,
        balance: 0,
        transactions: [],
      });
    }

    return res.json({
      success: true,
      wallet,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/* ===========================================================
   ⭐ ADD MONEY TO WALLET (Used in Payment Verify)
=========================================================== */
exports.addMoneyToWallet = async (userId, amount) => {
  amount = Number(amount);

  let wallet = await Wallet.findOne({ userId });

  // Create wallet if not found
  if (!wallet) {
    wallet = await Wallet.create({
      userId,
      balance: amount,
      transactions: [
        {
          type: "credit",
          amount,
          date: new Date(),
        },
      ],
    });
    return wallet;
  }

  // Update existing wallet
  wallet.balance += amount;
  wallet.transactions.push({
    type: "credit",
    amount,
    date: new Date(),
  });

  await wallet.save();
  return wallet;
};
