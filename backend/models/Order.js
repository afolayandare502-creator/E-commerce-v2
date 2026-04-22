const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    productId: { type: String },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true, default: 1 },
    size: { type: String, default: 'N/A' },
    category: { type: String, default: 'clothing' },
    gender: { type: String, default: 'women' }
});

const orderSchema = mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        customerEmail: {
            type: String,
            required: true,
        },
        customerName: {
            type: String,
            default: 'Guest',
        },
        items: [orderItemSchema],
        totalAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        status: {
            type: String,
            required: true,
            default: 'Order Placed',
            enum: [
                'Order Placed',
                'Packing',
                'Shipped',
                'Out for Delivery',
                'Delivered',
                'Completed',
                'Paid'
            ],
        },
        paymentMethod: {
            type: String,
            default: 'Cash On Delivery',
        },
        paystackReference: {
            type: String,
        },
        deliveryDetails: {
            firstName: { type: String },
            lastName: { type: String },
            email: { type: String },
            phone: { type: String },
            address: { type: String },
            city: { type: String },
            state: { type: String },
            zipCode: { type: String },
            country: { type: String },
        },
        placedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
