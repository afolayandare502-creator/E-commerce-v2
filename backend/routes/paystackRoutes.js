const express = require('express');
const router = express.Router();
const { initializePayment, verifyPayment } = require('../controllers/paystackController');
const { protect } = require('../middleware/authMiddleware');

// Route: /api/paystack/initialize
router.post('/initialize', protect, initializePayment);

// Route: /api/paystack/verify/:reference
router.get('/verify/:reference', protect, verifyPayment);

module.exports = router;
