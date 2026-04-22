const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes = require('./routes/authRoutes');
const passport = require('passport');

// Load passport config
//require('./config/passport');

// Load env variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware to accept JSON data in the body
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware to handle Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Initialize passport
//app.use(passport.initialize());

// Health Check Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const paystackRoutes = require('./routes/paystackRoutes');

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/paystack', paystackRoutes);

// Error handling middleware (fallback)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
