const router = require("express").Router();
const Compatibility = require("../models/Compatibility");

// Dummy calculation logic
function calculateScore(boyDob, boyTob, girlDob, girlTob) {
  const boyDate = new Date(`${boyDob}T${boyTob}`);
  const girlDate = new Date(`${girlDob}T${girlTob}`);

  const diffDays = Math.abs((boyDate - girlDate) / (1000 * 60 * 60 * 24));
  const diffHours = Math.abs(boyDate.getHours() - girlDate.getHours());

  let score = 100 - Math.round(diffDays + diffHours);
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  const message =
    score > 75 ? "Excellent compatibility!" :
    score > 50 ? "Good compatibility" :
    score > 25 ? "Average compatibility" : "Low compatibility";

  return { score, message };
}

// GET all saved
router.get("/", async (req,res)=>{
  const data = await Compatibility.find().sort({ createdAt:-1 });
  res.json(data);
});

// POST new calculation
router.post("/calculate", async (req,res)=>{
  const { boyName, boyDob, boyTob, boyPlace, girlName, girlDob, girlTob, girlPlace } = req.body;
  if (!boyName || !boyDob || !boyTob || !boyPlace || !girlName || !girlDob || !girlTob || !girlPlace) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const { score, message } = calculateScore(boyDob, boyTob, girlDob, girlTob);

  const record = await Compatibility.create({
    boyName, boyDob, boyTob, boyPlace,
    girlName, girlDob, girlTob, girlPlace,
    score, message
  });

  res.json(record);
});

// PUT update
router.put("/:id", async (req,res)=>{
  const { boyName, boyDob, boyTob, boyPlace, girlName, girlDob, girlTob, girlPlace } = req.body;
  const { score, message } = calculateScore(boyDob, boyTob, girlDob, girlTob);
  const updated = await Compatibility.findByIdAndUpdate(req.params.id,
    { boyName, boyDob, boyTob, boyPlace, girlName, girlDob, girlTob, girlPlace, score, message }, { new:true });
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req,res)=>{
  await Compatibility.findByIdAndDelete(req.params.id);
  res.json({ success:true });
});

module.exports = router;
