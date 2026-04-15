const Product = require('../models/Product');

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
            price,
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
            product.name = req.body.name || product.name;
            product.price = req.body.price || product.price;
            product.description = req.body.description || product.description;
            product.category = req.body.category || product.category;
            product.subcategory = req.body.subcategory || product.subcategory;
            product.gender = req.body.gender || product.gender;
            product.sizes = req.body.sizes || product.sizes;
            product.bestseller = req.body.bestseller !== undefined ? req.body.bestseller : product.bestseller;
            product.images = req.body.images || product.images;

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
