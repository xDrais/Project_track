const express = require('express');
const router = express.Router();
const wastebinController = require('../controllers/wastebinController');

router.get('/', wastebinController.getAllBins);
router.post('/add', wastebinController.createBin);

module.exports = router;

