const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { getActivity } = require("../controllers/activityController");

router.get("/", auth, getActivity);


module.exports = router;

