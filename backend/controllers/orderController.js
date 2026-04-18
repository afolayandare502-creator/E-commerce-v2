const Order = require('../models/Order');

// @desc    Create a new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
    try {
        const { orderId, customerEmail, customerName, items, totalAmount, status, paymentMethod, deliveryDetails, placedAt } = req.body;

        if (!orderId || !customerEmail || !items || !items.length) {
            return res.status(400).json({ message: 'orderId, customerEmail, and items are required.' });
        }

        const order = await Order.create({
            orderId,
            customerEmail: customerEmail.trim().toLowerCase(),
            customerName: customerName || 'Guest',
            items,
            totalAmount: totalAmount || items.reduce((sum, item) => (Number(item.price) || 0) * (Number(item.quantity) || 1) + sum, 0),
            status: status || 'Order Placed',
            paymentMethod: paymentMethod || 'Cash On Delivery',
            deliveryDetails: deliveryDetails || {},
            placedAt: placedAt || new Date(),
        });

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
const getOrders = async (req, res) => {
    try {
        const { email } = req.query;

        const filter = {};
        if (email) {
            filter.customerEmail = email.trim().toLowerCase();
        }

        const orders = await Order.find(filter).sort({ placedAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single order by MongoDB _id or orderId
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
    try {
        let order = await Order.findById(req.params.id).catch(() => null);
        if (!order) {
            order = await Order.findOne({ orderId: req.params.id });
        }

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id
const updateOrder = async (req, res) => {
    try {
        let order = await Order.findById(req.params.id).catch(() => null);
        if (!order) {
            order = await Order.findOne({ orderId: req.params.id });
        }

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update allowed fields
        if (req.body.status) order.status = req.body.status;
        if (req.body.paymentMethod) order.paymentMethod = req.body.paymentMethod;
        if (req.body.deliveryDetails) order.deliveryDetails = { ...order.deliveryDetails.toObject?.() || order.deliveryDetails, ...req.body.deliveryDetails };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
    try {
        let order = await Order.findById(req.params.id).catch(() => null);
        if (!order) {
            order = await Order.findOne({ orderId: req.params.id });
        }

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.deleteOne();
        res.json({ message: 'Order deleted' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};
