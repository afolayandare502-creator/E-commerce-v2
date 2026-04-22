const express = require('express');
const router = express.Router();
const { getProductReviews, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// /api/reviews
router.route('/')
    .post(protect, createReview);

// /api/reviews/:productId
router.route('/:productId')
    .get(getProductReviews);

module.exports = router;
