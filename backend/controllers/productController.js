const Product = require('../models/Product');

function normalizeOptionalNumber(value) {
    if (value === undefined) return undefined;
    if (value === '' || value === null) return null;

    const number = Number(value);
    return Number.isFinite(number) ? number : value;
}

function normalizeBoolean(value) {
    if (value === undefined) return undefined;
    if (typeof value === 'boolean') return value;
    return value === 'true' || value === '1' || value === 1;
}

// @desc    Fetch all products (with optional filtering)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { gender, category, query } = req.query;
        let filter = {};

        if (gender) {
            filter.gender = gender;
        }

        if (category) {
            // Support comma-separated categories for fallback matching
            const categories = category.split(',').map(c => c.trim().toLowerCase());
            
            // Search in both 'category' or 'subcategory' fields
            filter.$or = [
                { category: { $in: categories } },
                { subcategory: { $in: categories } }
            ];
        }

        if (query) {
            filter.name = {
                $regex: query,
                $options: 'i', // case-insensitive
            };
        }

        const products = await Product.find(filter).lean();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Unable to fetch products' });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        // Try finding by MongoDB _id first, then fallback to customId
        let product;
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
             product = await Product.findById(req.params.id).lean();
        }
        
        if (!product) {
            product = await Product.findOne({ customId: req.params.id }).lean();
        }

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            oldPrice,
            stock,
            soldOut,
            description,
            category,
            subcategory,
            gender,
            sizes,
            bestseller,
            images
        } = req.body;

        const product = new Product({
            name,
            price: normalizeOptionalNumber(price) ?? 0,
            oldPrice: normalizeOptionalNumber(oldPrice),
            stock: normalizeOptionalNumber(stock) ?? 0,
            soldOut: normalizeBoolean(soldOut) ?? false,
            description,
            category,
            subcategory,
            gender: gender || 'women',
            sizes,
            bestseller,
            images,
            customId: req.body.id || `prod_${Date.now()}`
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Unable to create product' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
    try {
        let product;
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(req.params.id);
        }
        
        if (!product) {
            product = await Product.findOne({ customId: req.params.id });
        }

        if (product) {
            if (req.body.name !== undefined) product.name = req.body.name;
            if (req.body.price !== undefined) product.price = normalizeOptionalNumber(req.body.price) ?? 0;
            if (req.body.oldPrice !== undefined) product.oldPrice = normalizeOptionalNumber(req.body.oldPrice);
            if (req.body.stock !== undefined) product.stock = normalizeOptionalNumber(req.body.stock) ?? 0;
            if (req.body.soldOut !== undefined) product.soldOut = normalizeBoolean(req.body.soldOut);
            if (req.body.description !== undefined) product.description = req.body.description;
            if (req.body.category !== undefined) product.category = req.body.category;
            if (req.body.subcategory !== undefined) product.subcategory = req.body.subcategory;
            if (req.body.gender !== undefined) product.gender = req.body.gender;
            if (req.body.sizes !== undefined) product.sizes = req.body.sizes;
            product.bestseller = req.body.bestseller !== undefined ? req.body.bestseller : product.bestseller;
            if (req.body.images !== undefined) product.images = req.body.images;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Unable to update product' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
    try {
        let product;
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(req.params.id);
        }
        
        if (!product) {
            product = await Product.findOne({ customId: req.params.id });
        }

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Unable to delete product' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
