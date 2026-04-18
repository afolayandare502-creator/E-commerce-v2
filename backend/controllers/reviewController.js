const Review = require('../models/Review');

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching reviews' });
    }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Public (for now)
const createReview = async (req, res) => {
    try {
        const { productId, rating, title, comment, author } = req.body;

        if (!productId || !rating || !title || !comment) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const review = new Review({
            productId,
            rating: Number(rating),
            title,
            comment,
            author: author || 'Anonymous'
        });

        const createdReview = await review.save();
        res.status(201).json(createdReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error adding review' });
    }
};

module.exports = {
    getProductReviews,
    createReview
};
