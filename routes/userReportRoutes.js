const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userReportController");
const { auth } = require("../middleware/auth");

router.post("/add", auth, ctrl.addUserReport);
router.get("/:userId", auth, ctrl.getUserReports);
router.delete("/:id", auth, ctrl.deleteUserReport);

module.exports = router;
