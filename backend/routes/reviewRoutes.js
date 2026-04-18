const express = require('express');
const router = express.Router();
const { getProductReviews, createReview } = require('../controllers/reviewController');

// /api/reviews
router.route('/')
    .post(createReview);

// /api/reviews/:productId
router.route('/:productId')
    .get(getProductReviews);

module.exports = router;
