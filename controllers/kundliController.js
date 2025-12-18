

const Kundli = require("../models/Kundli");


function mockCalculate({ dateOfBirth, timeOfBirth }) {
  // zodiac by month/day (simple mapping)
  const [year, monthStr, dayStr] = dateOfBirth.split("-");
  const month = Number(monthStr);
  const day = Number(dayStr);

  // Simple zodiac array by month (approximate; not exact)
  const zodiacs = [
    "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini",
    "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius",
  ];
  // pick by month-1 (0..11), + small shift for day
  const zodiac = zodiacs[(month - 1 + Math.floor(day / 20)) % 12];

  // lagna from birth hour
  const hour = Number(timeOfBirth.split(":")[0] || 0);
  const lagnas = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  const lagna = lagnas[hour % 12];

  // moon sign mock (based on day % 12)
  const moonSign = lagnas[day % 12];

  // nakshatra: pick from 27 using (day + hour)
  const nakshatras = [
    "Ashwini","Bharani","Krittika","Rohini","Mrigashirsha","Ardra","Punarvasu",
    "Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta",
    "Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha",
    "Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada",
    "Uttara Bhadrapada","Revati"
  ];
  const nakshatra = nakshatras[(day + hour) % 27];

  // Build a result object
  const result = {
    zodiac,
    lagna,
    moonSign,
    nakshatra,
    generatedAt: new Date().toISOString(),
    note: "This is a mock result for testing. Replace controller with real API when ready."
  };

  return { zodiac, lagna, moonSign, nakshatra, result };
}

// POST /api/kundlis/calculate
exports.calculateKundli = async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

    // validation
    if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth) {
      return res.status(400).json({ success: false, error: "name, dateOfBirth, timeOfBirth and placeOfBirth are required" });
    }

    // run mock calculator
    const calc = mockCalculate({ dateOfBirth, timeOfBirth });

    // save to DB
    const newKundli = await Kundli.create({
      name,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      zodiac: calc.zodiac,
      lagna: calc.lagna,
      moonSign: calc.moonSign,
      nakshatra: calc.nakshatra,
      result: calc.result
    });

    return res.status(200).json({ success: true, data: newKundli });
  } catch (err) {
    console.error("❌ Kundli calculation failed:", err);
    return res.status(500).json({ success: false, error: err.message || "Internal Server Error" });
  }
};

// GET /api/kundlis
exports.getAllKundlis = async (req, res) => {
  try {
    const kundlis = await Kundli.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: kundlis });
  } catch (err) {
    console.error("❌ getAllKundlis error:", err);
    return res.status(500).json({ success: false, error: err.message || "Internal Server Error" });
  }
};

// GET /api/kundlis/:id  (optional, but useful)
exports.getKundliById = async (req, res) => {
  try {
    const k = await Kundli.findById(req.params.id);
    if (!k) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, data: k });
  } catch (err) {
    console.error("❌ getKundliById error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/kundlis/:id  (update)
exports.updateKundli = async (req, res) => {
  try {
    const updated = await Kundli.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("❌ updateKundli error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/kundlis/:id
exports.deleteKundli = async (req, res) => {
  try {
    const deleted = await Kundli.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ deleteKundli error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
