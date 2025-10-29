

const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // multer instance
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

// Routes
router.get("/", getOrders);
router.get("/:id", getOrderById);

// Use `file` here to match React FormData field
router.post("/", upload.single("file"), createOrder);
router.put("/:id", upload.single("file"), updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
