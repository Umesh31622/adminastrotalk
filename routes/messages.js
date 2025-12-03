const express = require('express');
const router = express.Router();
const triggerCtrl = require('../controllers/triggerController');

router.post('/', triggerCtrl.createTrigger);
router.get('/', triggerCtrl.getTriggers);

module.exports = router;
