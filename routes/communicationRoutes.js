
const express = require("express");
const router = express.Router();
const communicationCtrl = require("../controllers/communicationController");
const triggerCtrl = require("../controllers/triggerController");

// ================== TEMPLATES ==================
router.post("/templates", communicationCtrl.createTemplate);
router.get("/templates", communicationCtrl.getTemplates);
router.get("/templates/:id", communicationCtrl.getTemplateById);
router.put("/templates/:id", communicationCtrl.updateTemplate);
router.delete("/templates/:id", communicationCtrl.deleteTemplate);

// ================== MESSAGES ==================
router.post("/messages", communicationCtrl.sendMessage);
router.get("/messages", communicationCtrl.getMessages);
router.get("/messages/:id", communicationCtrl.getMessageById);
router.put("/messages/:id", communicationCtrl.updateMessage);
router.delete("/messages/:id", communicationCtrl.deleteMessage);

router.post("/trigger/:eventType", triggerCtrl.createTrigger);
router.get("/triggers", triggerCtrl.getTriggers);
router.delete("/trigger/:eventType", triggerCtrl.deleteTrigger);

module.exports = router;
