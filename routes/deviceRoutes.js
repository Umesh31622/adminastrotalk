const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { getDevices } = require("../controllers/deviceController");

router.get("/", auth, getDevices);

module.exports = router;
