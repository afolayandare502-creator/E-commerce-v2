const Review = require('../models/Review');
const Product = require('../models/Product');

// Helper: recalculate a product's rating and numReviews
async function recalcProductRating(productId) {
    const reviews = await Review.find({ productId });
    const numReviews = reviews.length;
    const rating = numReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
        : 0;

    // Try updating by _id first, then by customId
    let product = await Product.findById(productId);
    if (!product) {
        product = await Product.findOne({ customId: String(productId) });
    }
    if (product) {
        product.rating = Math.round(rating * 10) / 10; // e.g. 4.3
        product.numReviews = numReviews;
        await product.save();
    }
}

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .populate('user', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching reviews' });
    }
};

// @desc    Get ALL reviews (admin)
// @route   GET /api/reviews
// @access  Admin
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching all reviews' });
    }
};

// @desc    Create a new review (one per user per product)
// @route   POST /api/reviews
// @access  Protected
const createReview = async (req, res) => {
    try {
        const { productId, rating, title, comment } = req.body;

        if (!productId || !rating || !title || !comment) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Prevent duplicate: one review per user per product
        const existing = await Review.findOne({ productId, user: req.user._id });
        if (existing) {
            return res.status(400).json({ message: 'You have already reviewed this product.' });
        }

        const review = new Review({
            productId,
            user: req.user._id,
            rating: Number(rating),
            title,
            comment,
            author: `${req.user.firstName} ${req.user.lastName}`
        });

        const createdReview = await review.save();

        // Recalculate product rating
        await recalcProductRating(productId);

        res.status(201).json(createdReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error adding review' });
    }
};

// @desc    Delete a review (admin only)
// @route   DELETE /api/reviews/:id
// @access  Admin
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const productId = review.productId;
        await review.deleteOne();

        // Recalculate product rating after deletion
        await recalcProductRating(productId);

        res.json({ message: 'Review deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error deleting review' });
    }
};

module.exports = {
    getProductReviews,
    getAllReviews,
    createReview,
    deleteReview
};
