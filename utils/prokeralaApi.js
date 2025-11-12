const axios = require("axios");

const TOKEN_URL = process.env.PROKERALA_TOKEN_URL;
const CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;
const BASE_URL = process.env.PROKERALA_BASE_URL;

let accessToken = null;
let tokenExpiry = 0;

/* =============================
   🔐 TOKEN HANDLER
============================= */
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
    console.log("✅ Prokerala token fetched successfully");
    return accessToken;
  } catch (err) {
    console.error("❌ Token fetch failed:", err.response?.data || err.message);
    throw new Error("Prokerala token fetch failed");
  }
}

/* =============================
   🌐 GENERIC API CALL WRAPPER
============================= */
async function callProkeralaAPI(endpoint, { method = "get", params = {}, data = {} } = {}) {
  const token = await getAccessToken();
  const fullUrl = `${BASE_URL}${endpoint}`;
  console.log(`📡 Calling Prokerala API → ${fullUrl} (method=${method.toUpperCase()})`);

  try {
    const config = {
      url: fullUrl,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 100000,
    };

    if (method.toLowerCase() === "get") config.params = params;
    else config.data = data;

    const res = await axios(config);

    if (res.data?.status === "error" || res.data?.errors)
      return { success: false, error: res.data.errors || res.data };

    return { success: true, data: res.data };
  } catch (err) {
    console.error(`❌ API failed [${endpoint}]:`, err.response?.data || err.message);
    return { success: false, error: err.response?.data || err.message };
  }
}

async function calculateCompatibility({ male, female }) {
  try {
    const endpoint = "/kundli-matching/advanced";

    const pad = (n) => String(n).padStart(2, "0");
    const toISO = (y, m, d, h, min) =>
      `${y}-${pad(m)}-${pad(d)}T${pad(h)}:${pad(min)}:00+05:30`;

    const boy_dob = toISO(male.year, male.month, male.day, male.hour, male.minute);
    const girl_dob = toISO(female.year, female.month, female.day, female.hour, female.minute);

    const boy_coordinates = `${Number(male.latitude).toFixed(2)},${Number(male.longitude).toFixed(2)}`;
    const girl_coordinates = `${Number(female.latitude).toFixed(2)},${Number(female.longitude).toFixed(2)}`;

    const params = {
      boy_dob,
      boy_coordinates,
      girl_dob,
      girl_coordinates,
      ayanamsa: 1, // Lahiri Ayanamsa
    };

    const result = await callProkeralaAPI(endpoint, { method: "get", params });

    if (!result.success) {
      console.error("❌ Compatibility API failed:", result.error);
      return { success: false, error: result.error };
    }

    // 🧩 Extract actual structure
    const data = result.data?.data || result.data;
    const gunaMilan = data?.guna_milan;
    const messageData = data?.message;

    // 🧮 Extract the correct score and max points
    const score = gunaMilan?.total_points || 0;
    const maxScore = gunaMilan?.maximum_points || 36;

    // 💬 Extract detailed message
    const message =
      messageData?.description ||
      messageData?.type ||
      "Compatibility calculated successfully ✅";

    // 🎯 Extract kootas (guna-wise breakdown)
    const kutas = gunaMilan?.guna || [];

    // 🪐 Mangal dosha details
    const boyDosha = data?.boy_mangal_dosha_details;
    const girlDosha = data?.girl_mangal_dosha_details;

    // 🧾 Log for debugging
    console.log(`💞 Compatibility → ${score}/${maxScore}: ${message}`);

    return {
      success: true,
      data: {
        score,
        maxScore,
        message,
        kutas,
        boyDosha,
        girlDosha,
        raw: data,
      },
    };
  } catch (err) {
    console.error("🔥 Compatibility API error:", err.message);
    return { success: false, error: err.message };
  }
}
/* =======================================================
   🔮 FINAL FIXED — KUNDLI BUILDER (BASIC PLAN SUPPORTED)
======================================================= */

async function calculateKundli({ date, time, latitude, longitude }) {
  try {
    const d = new Date(date);
    const [hour, minute] = time.split(":").map(Number);

    // ✅ Proper IST datetime format
    const datetime = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+05:30`;

    const coordinates = `${Number(latitude).toFixed(2)},${Number(longitude).toFixed(2)}`;
    const baseParams = { datetime, coordinates, ayanamsa: 1 };

    console.log("🪐 Fetching Kundli Data →", baseParams);

    /* 1️⃣ BIRTH DETAILS (for ascendant, sun, moon, zodiac) */
    let birthData = {};
    try {
      const birthRes = await callProkeralaAPI("/birth-details", {
        method: "get",
        params: baseParams,
      });
      birthData = birthRes.data?.data || {};
    } catch (err) {
      console.warn("⚠️ Birth Details API failed →", err.message);
    }

    /* 2️⃣ BASIC KUNDLI INFO (for nakshatra, mangal dosha, yogas) */
    let kundliData = {};
    try {
      const kundliRes = await callProkeralaAPI("/kundli", {
        method: "get",
        params: { ...baseParams, result_type: "advanced", la: "en" },
      });
      kundliData = kundliRes.data?.data || {};
    } catch (err) {
      console.warn("⚠️ Kundli API failed →", err.message);
    }

    // 🌙 Extract all possible details safely
    const nakshatra = kundliData.nakshatra_details?.nakshatra || {};
    const moonSign = birthData.chandra_rasi || kundliData.nakshatra_details?.chandra_rasi || {};
    const sunSign = birthData.soorya_rasi || kundliData.nakshatra_details?.soorya_rasi || {};
    const ascendant = birthData.ascendant || kundliData.ascendant || {};
    const zodiac = birthData.zodiac || {};
    const dosha = kundliData.mangal_dosha || {};
    const yogas = kundliData.yoga_details || [];

    // 🧩 Final merged Kundli Data
    const finalKundli = {
      sunSign: sunSign.name || "-",
      moonSign: moonSign.name || "-",
      ascendant: ascendant.name || "-",
      zodiac: zodiac.name || "-",
      nakshatra: nakshatra.name || "-",
      nakshatraLord: nakshatra.lord?.name || "-",
      mangalDosha: {
        hasDosha: dosha.has_dosha || false,
        description: dosha.description || "-",
      },
      yogas: yogas.map((y) => ({
        name: y.name,
        description: y.description,
      })),
      planets: [], // not available in your current plan
      houses: [], // not available in your current plan
      description:
        "✅ Kundli generated successfully using /birth-details + /kundli (basic plan compatible)",
    };

    console.log("✅ Kundli Extracted:", {
      sunSign: finalKundli.sunSign,
      moonSign: finalKundli.moonSign,
      ascendant: finalKundli.ascendant,
      nakshatra: finalKundli.nakshatra,
      yogas: finalKundli.yogas.length,
    });

    return { success: true, data: finalKundli };
  } catch (err) {
    console.error("🔥 calculateKundli() error:", err.message);
    return { success: false, error: err.message };
  }
}


/* =======================================================
   🔢 NUMEROLOGY
======================================================= */
async function calculateNumerology({ name, date }) {
  const d = new Date(date);
  return callProkeralaAPI("/numerology", {
    name,
    day: d.getUTCDate(),
    month: d.getUTCMonth() + 1,
    year: d.getUTCFullYear(),
  });
}

/* =======================================================
   🪐 FIXED — PLANET TRANSIT (Prokerala Compliant)
======================================================= */
async function calculateTransit({ date, time, latitude, longitude }) {
  try {
    if (!date || !time || !latitude || !longitude) {
      throw new Error("Missing required parameters (date, time, latitude, longitude)");
    }

    // 🕒 Convert date + time → Proper ISO format (IST timezone)
    const d = new Date(date);
    const [hour, minute] = time.split(":").map(Number);
    const datetime = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )}:00+05:30`;

    // 🌍 Coordinates (as string)
    const coordinates = `${Number(latitude).toFixed(2)},${Number(longitude).toFixed(2)}`;

    // 🔑 Get access token
    const token = await getAccessToken();

    // ✅ Call Prokerala Transit API
    const response = await axios.get(`${BASE_URL}/transit`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        datetime,      // must be ISO-8601 string
        coordinates,   // must be "lat,long"
        ayanamsa: 1,
      },
    });

    const data = response.data?.data || response.data;
    const planets = data?.planet_transit || data?.planet_positions || data?.planets || [];

    console.log(`✅ ${planets.length} planets received from Prokerala for transit chart.`);

    return {
      success: true,
      data: {
        description: "🪐 Vedic Transit Chart (Real-Time Prokerala Data)",
        ayanamsa: data?.ayanamsa?.name || "Lahiri",
        planets,
        raw: data,
      },
    };
  } catch (err) {
    console.error("🔥 calculateTransit() error:", err.response?.data || err.message);
    return { success: false, error: err.response?.data || err.message };
  }
}

/* =======================================================
   🪔 DASHA
======================================================= */
async function calculateDasha({ date, time, latitude, longitude }) {
  try {
    if (!date || !time || !latitude || !longitude)
      throw new Error("Missing required parameters (date, time, latitude, longitude)");

    // 🕒 Proper ISO datetime (IST)
    const d = new Date(date);
    const [hour, minute] = time.split(":").map(Number);
    const datetime = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )}:00+05:30`;

    const coordinates = `${Number(latitude).toFixed(2)},${Number(longitude).toFixed(2)}`;
    const baseParams = { datetime, coordinates, ayanamsa: 1, result_type: "advanced", la: "en" };

    console.log("🪔 Calculating Dasha for Rinku →", baseParams);

    const token = await getAccessToken();

    let dashas = [];
    let apiUsed = "";

    /* --------------------------------------------
       1️⃣ Try /kundli (Basic or Standard)
    -------------------------------------------- */
    try {
      const kundliRes = await axios.get(`${BASE_URL}/kundli`, {
        headers: { Authorization: `Bearer ${token}` },
        params: baseParams,
      });
      const data = kundliRes.data?.data || kundliRes.data;
      dashas = data?.dasha_periods || [];
      apiUsed = "/kundli";
    } catch (err) {
      console.warn("⚠️ /kundli failed:", err.response?.data?.errors?.[0]?.detail || err.message);
    }

    /* --------------------------------------------
       2️⃣ If empty, try /major-dasha
    -------------------------------------------- */
    if (!dashas?.length) {
      console.warn("⚠️ No Dasha found in /kundli → Trying /major-dasha ...");
      try {
        const dashaRes = await axios.get(`${BASE_URL}/major-dasha`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { datetime, coordinates, ayanamsa: 1 },
        });
        const dashaData = dashaRes.data?.data || dashaRes.data;
        dashas = dashaData?.major_dasha || dashaData?.dasha_periods || [];
        apiUsed = "/major-dasha";
      } catch (err) {
        console.warn("⚠️ /major-dasha failed:", err.response?.data?.errors?.[0]?.detail || err.message);
      }
    }

    /* --------------------------------------------
       3️⃣ If still empty, try /vimshottari-dasha
    -------------------------------------------- */
    if (!dashas?.length) {
      console.warn("⚠️ Still empty → Trying /vimshottari-dasha ...");
      try {
        const vimshottariRes = await axios.get(`${BASE_URL}/vimshottari-dasha`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { datetime, coordinates, ayanamsa: 1 },
        });
        const vData = vimshottariRes.data?.data || vimshottariRes.data;
        dashas = vData?.dasha || vData?.major_dasha || vData?.dasha_periods || [];
        apiUsed = "/vimshottari-dasha";
      } catch (err) {
        console.warn(
          "⚠️ /vimshottari-dasha failed:",
          err.response?.data?.errors?.[0]?.detail || err.message
        );
      }
    }

    /* --------------------------------------------
       🧩 Final result check
    -------------------------------------------- */
    if (!dashas?.length) {
      console.error("❌ No Dasha data found in any endpoint.");
      return {
        success: false,
        error:
          "No Dasha data available. Upgrade to Standard or Premium Prokerala plan to enable full Vimshottari Dasha.",
      };
    }

    // ✅ Format all dashas nicely
    const formattedDashas = dashas.map((maha) => ({
      name: maha.name || maha.planet || "Unknown",
      start: maha.start,
      end: maha.end,
      antardasha: (maha.antardasha || maha.sub_dasha || []).map((anta) => ({
        name: anta.name || anta.planet,
        start: anta.start,
        end: anta.end,
        pratyantardasha: (anta.pratyantardasha || []).map((p) => ({
          name: p.name || p.planet,
          start: p.start,
          end: p.end,
        })),
      })),
    }));

    const currentMaha = formattedDashas[0]?.name || "Unknown";
    const currentAnta = formattedDashas[0]?.antardasha?.[0]?.name || "Unknown";

    console.log(`✅ ${formattedDashas.length} Mahadashas fetched via ${apiUsed}`);
    console.log(`🪔 Current: ${currentMaha} → ${currentAnta}`);

    return {
      success: true,
      data: {
        mahadasha: currentMaha,
        antardasha: currentAnta,
        description: `🪔 Current Mahadasha: ${currentMaha}, Antardasha: ${currentAnta} (via ${apiUsed})`,
        fullDashaList: formattedDashas,
        source: apiUsed,
      },
    };
  } catch (err) {
    console.error("🔥 calculateDasha() error:", err.response?.data || err.message);
    return { success: false, error: err.response?.data || err.message };
  }
}
/* =======================================================
   ♈ ZODIAC SIGN
======================================================= */
async function getZodiacSign({ date }) {
  const d = new Date(date);
  return callProkeralaAPI("/zodiac-sign", {
    day: d.getUTCDate(),
    month: d.getUTCMonth() + 1,
    year: d.getUTCFullYear(),
  });
}

/* =======================================================
   ✨ NAKSHATRA
======================================================= */
/* =======================================================
   ✨ NAKSHATRA (Compatible with Free Prokerala Plan)
======================================================= */
async function getNakshatra({ date, time, latitude, longitude }) {
  try {
    if (!date || !time || !latitude || !longitude) {
      throw new Error("Missing required parameters (date, time, latitude, longitude)");
    }

    const d = new Date(date);
    const [hour, minute] = time.split(":").map(Number);

    // 🌙 Prepare correct GET params for Prokerala
    const params = {
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      hour,
      minute,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timezone: 5.5, // IST
    };

    console.log("🌙 Fetching Nakshatra Data →", params);

    // ✅ Use the centralized Prokerala call function
    const result = await callProkeralaAPI("/nakshatra", { method: "get", params });

    if (!result.success) {
      console.error("❌ Nakshatra API failed:", result.error);
      return { success: false, error: result.error };
    }

    // 🪐 Extract response safely
    const data = result.data?.data || result.data;
    const nak = data?.nakshatra || {};

    console.log(`✅ Nakshatra: ${nak.name || "-"} | Pada: ${nak.pada || "-"} | Lord: ${nak.lord?.name || "-"}`);

    return {
      success: true,
      data: {
        nakshatra: nak.name || "Unknown",
        pada: nak.pada || "-",
        lord: nak.lord?.name || "-",
        deity: nak.deity || "-",
        symbol: nak.symbol || "-",
        rashi: data?.chandra_rasi?.name || "-",
        raw: data,
      },
    };
  } catch (err) {
    console.error("🔥 getNakshatra() error:", err.response?.data || err.message);
    return { success: false, error: err.response?.data || err.message };
  }
}


/* =======================================================
   🪄 PLANETARY POSITIONS
======================================================= */
async function getPlanetaryPositions({ date, time, latitude, longitude }) {
  try {
    if (!date || !time || !latitude || !longitude)
      throw new Error("Missing required parameters (date, time, latitude, longitude)");

    // 🕒 Format datetime (ISO)
    const d = new Date(date);
    const [hour, minute] = time.split(":").map(Number);
    const datetime = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )}:00+05:30`;

    // 🗺️ Format coordinates
    const coordinates = `${parseFloat(latitude).toFixed(2)},${parseFloat(longitude).toFixed(2)}`;

    // ✅ Params (as per SDK)
    const params = {
      datetime,
      coordinates,
      ayanamsa: 1,
      result_type: "basic", // 🔥 crucial for free plan
      la: "en",
    };

    console.log("🪐 Fetching Planetary Positions →", params);

    // ✅ Correct endpoint for free plan
    const result = await callProkeralaAPI("/planet-position", { method: "get", params });

    if (!result.success || !result.data?.data?.planet_positions) {
      console.warn("⚠️ No planetary data returned from API.");
      return { success: false, error: "No planetary data returned from Prokerala." };
    }

    const data = result.data.data;
    const planets = data.planet_positions;

    const planetMap = {};
    planets.forEach((p) => {
      planetMap[p.name] = {
        sign: p.sign?.name || "Unknown",
        degree: p.longitude?.toFixed(2),
        retrograde: p.is_retrograde || false,
      };
    });

    console.log("✅ Planetary Positions Retrieved:", planetMap);

    return {
      success: true,
      data: {
        planets: planetMap,
        ayanamsa: data?.ayanamsa?.name || "Lahiri",
        raw: data,
      },
    };
  } catch (err) {
    console.error("🔥 getPlanetaryPositions() error:", err.response?.data || err.message);
    return { success: false, error: err.response?.data || err.message };
  }
}

module.exports = { callProkeralaAPI, getPlanetaryPositions };
/* =======================================================
   🌞 DAILY PREDICTION
======================================================= */
async function getDailyPrediction({ sign }) {
  try {
    const url = `https://aztro.sameerkumar.website/?sign=${sign.toLowerCase()}&day=today`;
    const res = await axios.post(url); 
    const data = res.data;

    return {
      success: true,
      data: {
        sign: sign,
        date_range: data.date_range,
        current_date: data.current_date,
        description: data.description,
        mood: data.mood,
        compatibility: data.compatibility,
        color: data.color,
        lucky_number: data.lucky_number,
        lucky_time: data.lucky_time,
      },
    };
  } catch (err) {
    console.error("🔥 getDailyPrediction() error:", err.response?.data || err.message);
    return { success: false, error: err.response?.data || err.message };
  }
}

/* =======================================================
   ♋ HOROSCOPE
======================================================= */
async function getHoroscope({ sign, type = "daily" }) {
  return callProkeralaAPI(`/horoscope/${type}`, { sign });
}

/* =======================================================
   🔥 MANGLIK DOSHA
======================================================= */
async function calculateManglik({ date, time, latitude, longitude }) {
  const d = new Date(date);
  const [hour, minute] = time.split(":").map(Number);
  return callProkeralaAPI("/manglik", {
    day: d.getUTCDate(),
    month: d.getUTCMonth() + 1,
    year: d.getUTCFullYear(),
    hour,
    minute,
    latitude,
    longitude,
    timezone: 5.5,
  });
}

/* =======================================================
   🧘‍♂️ PANCHANG
======================================================= */
async function getPanchang({ date, latitude, longitude }) {
  const d = new Date(date);

  const params = {
    datetime: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}T06:00:00+05:30`,
    coordinates: `${latitude},${longitude}`,
    ayanamsa: 1,
  };

  return callProkeralaAPI("/panchang", { method: "get", params });
}


/* =======================================================
   💎 GEMSTONE RECOMMENDATION
======================================================= */
async function getGemstoneRecommendation({ date, time, latitude, longitude }) {
  const d = new Date(date);
  const [hour, minute] = time.split(":").map(Number);
  return callProkeralaAPI("/gemstone", {
    day: d.getUTCDate(),
    month: d.getUTCMonth() + 1,
    year: d.getUTCFullYear(),
    hour,
    minute,
    latitude,
    longitude,
    timezone: 5.5,
  });
}

/* =======================================================
   🕉️ TRANSIT REMEDIES
======================================================= */
async function getTransitRemedies({ date, time, latitude, longitude }) {
  const d = new Date(date);
  const [hour, minute] = time.split(":").map(Number);
  return callProkeralaAPI("/transit-remedies", {
    day: d.getUTCDate(),
    month: d.getUTCMonth() + 1,
    year: d.getUTCFullYear(),
    hour,
    minute,
    latitude,
    longitude,
    timezone: 5.5,
  });
}

/* =======================================================
   📦 EXPORT ALL
======================================================= */
module.exports = {
  calculateCompatibility,
  calculateKundli,
  calculateNumerology,
  callProkeralaAPI,
  calculateTransit,
  calculateDasha,
  getZodiacSign,
  getNakshatra,
  getPlanetaryPositions,
  getDailyPrediction,
  getHoroscope,
  calculateManglik,
  getPanchang,
  getGemstoneRecommendation,
  getTransitRemedies,
};

