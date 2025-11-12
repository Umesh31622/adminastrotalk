const axios = require("axios");

let tokenCache = { token: null, expiry: null };

// Function to get Prokerala API token
async function getProkeralaToken() {
  const now = Date.now();
  if (tokenCache.token && tokenCache.expiry > now) return tokenCache.token;

  const res = await axios.post(
    process.env.PROKERALA_TOKEN_URL,
    `grant_type=client_credentials&client_id=${process.env.PROKERALA_CLIENT_ID}&client_secret=${process.env.PROKERALA_CLIENT_SECRET}`,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  tokenCache.token = res.data.access_token;
  tokenCache.expiry = now + res.data.expires_in * 1000 - 60000; // renew 1 min before expiry
  return tokenCache.token;
}

// Controller to fetch Panchang
exports.getPanchang = async (req, res) => {
  try {
    const { city, date } = req.body;
    if (!city || !date) return res.status(400).json({ error: "City and Date are required" });

    const token = await getProkeralaToken();

    // Call Prokerala Panchang API
    const response = await axios.get(`${process.env.PROKERALA_BASE_URL}/panchang/daily`, {
      params: { location: city, date },
      headers: { Authorization: `Bearer ${token}` },
    });

    res.json(response.data);

  } catch (err) {
    console.error("❌ Panchang API Error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || "Failed to fetch Panchang" });
  }
};
