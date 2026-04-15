const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const connectDB = require('../config/db');

// Load env variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to DB will be done inside the seed script
const DATA_DIR = path.join(__dirname, '../../Data');

/**
 * Helper to recursively find all JSON files in a directory
 */
const getAllJsonFiles = (dirPath, arrayOfFiles = []) => {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllJsonFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith('.json')) {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
};

const seedData = async () => {
    try {
        console.log('Connecting to database...');
        await connectDB();
        
        console.log('Clearing existing products from the database...');
        await Product.deleteMany(); // Clear out existing products to prevent duplicates

        console.log('Locating all JSON files in Data directory...');
        const jsonFiles = getAllJsonFiles(DATA_DIR);

        let totalProductsSeeded = 0;

        for (const filePath of jsonFiles) {
            try {
                // Read and parse each JSON file
                const fileData = fs.readFileSync(filePath, 'utf-8');
                let products = [];
                
                try {
                    products = JSON.parse(fileData);
                } catch(e) {
                     console.log(`Skipping invalid JSON file: ${filePath}`);
                     continue;
                }

                // If the file data isn't an array, ignore it
                if (!Array.isArray(products)) continue;

                // Ignore search-manifest.json to avoid duplicate searching
                if (filePath.toLowerCase().includes('search-manifest.json')) {
                    continue;
                }

                // Slice the products array so we only take a maximum of 8 items per file
                products = products.slice(0, 8);

                // Determine gender from the file path
                let gender = 'women';
                if (filePath.toLowerCase().includes('/men/')) {
                    gender = 'men';
                }

                // Map the JSON structure to our Mongoose model
                const mappedProducts = products.map((prod) => ({
                    customId: prod.id ? String(prod.id) : `prod_${Math.random()}`,
                    name: prod.name || 'Unnamed Product',
                    price: prod.price ? Number(prod.price) : 0,
                    category: prod.category || 'general',
                    subcategory: prod.subcategory || prod.category || 'general', // Fall back to category
                    gender: gender,
                    images: Array.isArray(prod.images) ? prod.images : [],
                    sizes: Array.isArray(prod.sizes) ? prod.sizes : ['S', 'M', 'L', 'XL'],
                    bestseller: !!prod.bestseller,
                    description: prod.description || ''
                }));

                // Upload to MongoDB
                if (mappedProducts.length > 0) {
                    await Product.insertMany(mappedProducts);
                    totalProductsSeeded += mappedProducts.length;
                    console.log(`Seeded ${mappedProducts.length} products from ${path.basename(filePath)}`);
                }
            } catch (err) {
                console.error(`Error processing file ${filePath}:`, err);
            }
        }

        console.log(`\n✅ Data seeding completed successfully! Total products seeded: ${totalProductsSeeded}`);
        process.exit();
    } catch (error) {
        console.error('❌ Data seeding failed:', error);
        process.exit(1);
    }
};

seedData();
