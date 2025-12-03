const axios = require("axios");
const Horoscope = require("../models/Horoscope");

const { PROKERALA_CLIENT_ID, PROKERALA_CLIENT_SECRET, PROKERALA_TOKEN_URL, PROKERALA_BASE_URL } = process.env;

async function getAccessToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", PROKERALA_CLIENT_ID);
  params.append("client_secret", PROKERALA_CLIENT_SECRET);

  const { data } = await axios.post(PROKERALA_TOKEN_URL, params);
  return data.access_token;
}

exports.calculateHoroscope = async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;
    const token = await getAccessToken();

    const response = await axios.get(`${PROKERALA_BASE_URL}/horoscope/daily`, {
      params: { datetime: `${dateOfBirth}T${timeOfBirth}`, tz: "Asia/Kolkata" },
      headers: { Authorization: `Bearer ${token}` },
    });

    const horoscope = new Horoscope({ name, dateOfBirth, timeOfBirth, placeOfBirth, result: response.data });
    await horoscope.save();

    res.json(horoscope);
  } catch (error) {
    console.error("Horoscope API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to calculate horoscope" });
  }
};

exports.getAllHoroscopes = async (req, res) => {
  try {
    const list = await Horoscope.find().sort({ createdAt: -1 });
    res.json(list);
  } catch {
    res.status(500).json({ error: "Error fetching horoscope list" });
  }
};

exports.updateHoroscope = async (req, res) => {
  try {
    const updated = await Horoscope.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Error updating horoscope" });
  }
};

exports.deleteHoroscope = async (req, res) => {
  try {
    await Horoscope.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ error: "Error deleting horoscope" });
  }
};
