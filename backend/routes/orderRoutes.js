const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
} = require('../controllers/orderController');

// Route: /api/orders
router.route('/')
    .get(getOrders)
    .post(createOrder);

// Route: /api/orders/:id
router.route('/:id')
    .get(getOrderById)
    .put(updateOrder)
    .delete(deleteOrder);

module.exports = router;
