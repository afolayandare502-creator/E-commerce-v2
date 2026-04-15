const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        // Custom ID mapped from JSON, if strings are used or numbers
        customId: {
            type: String,
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        category: {
            type: String,
            required: true,
        },
        subcategory: {
            type: String,
            required: false,
        },
        gender: {
            type: String,
            required: true,
            enum: ['women', 'men', 'unisex'],
            default: 'women'
        },
        images: {
            type: [String],
            required: true,
        },
        sizes: {
            type: [String],
            required: false,
            default: ['S', 'M', 'L', 'XL']
        },
        bestseller: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
