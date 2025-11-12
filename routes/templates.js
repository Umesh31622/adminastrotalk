const express = require('express');
const router = express.Router();
const TemplateCtrl = require('../controllers/templateController');
// (optional) add auth middleware
router.post('/', TemplateCtrl.createTemplate);
router.get('/', TemplateCtrl.getTemplates);
router.put('/:id', TemplateCtrl.updateTemplate);
router.delete('/:id', TemplateCtrl.deleteTemplate);
module.exports = router;
