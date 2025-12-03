const mongoose = require("mongoose");

const ourClientsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("OurClients", ourClientsSchema);
