
const express = require("express");
const FAQ = require("../models/faqModel");
const router = express.Router();

/* CREATE FAQ */
router.post("/add", async (req, res) => {
  try {
    const faq = new FAQ(req.body);
    await faq.save();
    res.json({ success: true, faq });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* GET ALL FAQ */
router.get("/list", async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json({ success: true, faqs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* GET PUBLIC FAQ (Active Only) */
router.get("/public", async (req, res) => {
  try {
    const faqs = await FAQ.find({ status: "active" });
    res.json({ success: true, faqs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* UPDATE FAQ */
router.put("/update/:id", async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ success: true, faq });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* DELETE FAQ */
router.delete("/delete/:id", async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "FAQ Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
