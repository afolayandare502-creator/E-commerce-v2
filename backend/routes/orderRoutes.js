const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route: /api/orders
router.route('/')
    .get(protect, getOrders)
    .post(protect, createOrder);

// Route: /api/orders/:id
router.route('/:id')
    .get(protect, getOrderById)
    .put(protect, admin, updateOrder)
    .delete(protect, admin, deleteOrder);

module.exports = router;
