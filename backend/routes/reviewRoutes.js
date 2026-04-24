const express = require('express');
const router = express.Router();
const { getProductReviews, getAllReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

// GET all reviews (admin only) — must be before /:productId
router.route('/')
    .get(protect, admin, getAllReviews)
    .post(protect, createReview);

// GET reviews for a specific product (public)
router.route('/:productId')
    .get(getProductReviews);

// DELETE a review (admin only)
router.route('/delete/:id')
    .delete(protect, admin, deleteReview);

module.exports = router;
