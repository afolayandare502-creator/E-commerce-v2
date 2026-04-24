const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
            index: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        title: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true,
            default: 'Anonymous'
        }
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
