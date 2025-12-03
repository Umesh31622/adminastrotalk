// // const express = require("express");
// // const router = express.Router();
// // const { getDiscountCodes, createDiscountCode, deleteDiscountCode } = require("../controllers/discountController");

// // router.get("/", getDiscountCodes);
// // router.post("/", createDiscountCode);
// // router.delete("/:id", deleteDiscountCode);

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//   getDiscountCodes,
//   createDiscountCode,
//   deleteDiscountCode,
// } = require("../controllers/discountController");

// router.get("/", getDiscountCodes);
// router.post("/", createDiscountCode);
// router.delete("/:id", deleteDiscountCode);

// module.exports = router;


const express = require("express");
const router = express.Router();
const {
  getDiscountCodes,
  createDiscountCode,
  updateDiscountCode,
  deleteDiscountCode,
} = require("../controllers/discountController");

router.get("/", getDiscountCodes);
router.post("/", createDiscountCode);
router.put("/:id", updateDiscountCode);  // ✅ newly added
router.delete("/:id", deleteDiscountCode);

module.exports = router;
