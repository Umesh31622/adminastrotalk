const axios = require("axios");

async function getCoordinates(place) {
  try {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      { params: { address: place, key: API_KEY } }
    );

    if (!response.data.results.length)
      throw new Error("Place not found");

    const { lat, lng } = response.data.results[0].geometry.location;
    return { latitude: lat, longitude: lng };
  } catch (err) {
    console.error("Geocode error:", err.message);
    return { latitude: 0, longitude: 0 };
  }
}

module.exports = { getCoordinates };
