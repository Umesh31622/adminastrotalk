const router = require("express").Router();
const upload = require("../middlewares/uploadPdf");
const controller = require("../controllers/knowMoreController");

router.post("/", upload.single("pdf"), controller.createKnowMore);
router.get("/", controller.getKnowMore);
router.put("/:id", upload.single("pdf"), controller.updateKnowMore);
router.delete("/:id", controller.deleteKnowMore);

module.exports = router;
