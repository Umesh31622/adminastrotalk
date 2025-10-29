
const axios = require("axios");

const TOKEN_URL = process.env.PROKERALA_TOKEN_URL;
const CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;
const BASE_URL = process.env.PROKERALA_BASE_URL;

let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);

  try {
    const res = await axios.post(TOKEN_URL, params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    accessToken = res.data.access_token;
    tokenExpiry = Date.now() + (res.data.expires_in || 3600) * 1000 - 5000;
    console.log("✅ Prokerala token fetched");
    return accessToken;
  } catch (err) {
    console.error("❌ Token fetch failed:", err.response?.data || err.message);
    throw new Error("Prokerala token fetch failed");
  }
}

async function calculateManglik(date, time, latitude, longitude) {
  const token = await getAccessToken();

  const day = new Date(date).getUTCDate();
  const month = new Date(date).getUTCMonth() + 1;
  const year = new Date(date).getUTCFullYear();
  const hour = parseInt(time.split(":")[0]);
  const minute = parseInt(time.split(":")[1]);

  try {
    const res = await axios.get(`${BASE_URL}/birth-chart`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { day, month, year, hour, minute, latitude, longitude, timezone: 5.5 },
      timeout: 15000,
    });

    if (res.data.status === "error" || res.data.errors) {
      return { success: false, error: res.data };
    }

    return { success: true, data: res.data };
  } catch (err) {
    console.error("Prokerala API call failed:", err.response?.data || err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { calculateManglik };
