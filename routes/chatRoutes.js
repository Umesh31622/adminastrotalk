const express = require("express");
const {
  startChat,
  sendMessage,
  getChats,
  getChat
} = require("../controllers/chatController");

const router = express.Router();

router.post("/start", startChat);
router.post("/send/:id", sendMessage);
router.get("/all", getChats);
router.get("/:id", getChat);

module.exports = router;
