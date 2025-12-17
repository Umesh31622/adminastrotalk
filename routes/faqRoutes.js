<<<<<<< HEAD
// const express = require("express");
// const FAQ = require("../models/faqModel");
// const router = express.Router();

// /* CREATE FAQ */
// router.post("/add", async (req, res) => {
//   try {
//     const faq = new FAQ(req.body);
//     await faq.save();
//     res.json({ success: true, faq });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// /* GET ALL FAQ */
// router.get("/list", async (req, res) => {
//   try {
//     const faqs = await FAQ.find().sort({ createdAt: -1 });
//     res.json({ success: true, faqs });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// /* GET PUBLIC FAQ (Active Only) */
// router.get("/public", async (req, res) => {
//   try {
//     const faqs = await FAQ.find({ status: "active" });
//     res.json({ success: true, faqs });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// /* UPDATE FAQ */
// router.put("/update/:id", async (req, res) => {
//   try {
//     const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     res.json({ success: true, faq });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// /* DELETE FAQ */
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     await FAQ.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: "FAQ Deleted" });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const FAQ = require("../models/faqModel");

const router = express.Router();

/* =====================================================
   CREATE FAQ (ADMIN)
   ===================================================== */
router.post("/add", async (req, res) => {
  try {
    const { question, answer, category, page, status } = req.body;

    // 🔐 Basic validation
    if (!question || !answer || !page) {
      return res.status(400).json({
        success: false,
        message: "Question, Answer and Page are required",
      });
    }

    const faq = new FAQ({
      question,
      answer,
      category: category || "general",
      page,
      status: status || "active",
    });

    await faq.save();

    res.status(201).json({
      success: true,
      message: "FAQ added successfully",
      faq,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to add FAQ",
      error: err.message,
    });
  }
});

/* =====================================================
   GET ALL FAQ (ADMIN)
   ?page=Home
   ?status=active
   ===================================================== */
router.get("/list", async (req, res) => {
  try {
    const { page, status } = req.query;

    const filter = {};
    if (page) filter.page = page;
    if (status) filter.status = status;

    const faqs = await FAQ.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      total: faqs.length,
      faqs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs",
      error: err.message,
    });
  }
});

/* =====================================================
   GET PUBLIC FAQ (USER SIDE)
   ?page=Home
   ===================================================== */
router.get("/public", async (req, res) => {
  try {
    const { page } = req.query;

    const filter = { status: "active" };
    if (page) filter.page = page;

    const faqs = await FAQ.find(filter).sort({ createdAt: 1 });

    res.json({
      success: true,
      total: faqs.length,
      faqs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch public FAQs",
      error: err.message,
    });
  }
});

/* =====================================================
   GET SINGLE FAQ (ADMIN)
   ===================================================== */
router.get("/:id", async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.json({
      success: true,
      faq,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQ",
      error: err.message,
    });
  }
});

/* =====================================================
   UPDATE FAQ (ADMIN)
   ===================================================== */
router.put("/update/:id", async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.json({
      success: true,
      message: "FAQ updated successfully",
      faq,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update FAQ",
      error: err.message,
    });
  }
});

/* =====================================================
   DELETE FAQ (ADMIN)
   ===================================================== */
router.delete("/delete/:id", async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete FAQ",
      error: err.message,
    });
  }
});

module.exports = router;
=======

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
>>>>>>> 287860747a9161e2609805405122ff2ca97fad0a
