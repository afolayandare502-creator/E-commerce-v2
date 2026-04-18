const DELIVERY_SHIPPING_FEE = 10;

function getDeliveryCartItems() {
    return typeof getCurrentUserCart === 'function' ? getCurrentUserCart() : [];
}

function formatCurrency(value) {
    return `$${Number(value || 0).toFixed(2)}`;
}

function renderDeliveryTotals() {
    const items = getDeliveryCartItems();
    const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
    const shipping = subtotal > 0 ? DELIVERY_SHIPPING_FEE : 0;
    const total = subtotal + shipping;

    const subtotalElement = document.getElementById('delivery-subtotal');
    const shippingElement = document.getElementById('delivery-shipping');
    const totalElement = document.getElementById('delivery-total');

    if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
    if (shippingElement) shippingElement.textContent = formatCurrency(shipping);
    if (totalElement) totalElement.textContent = formatCurrency(total);
}

function updateDeliveryCartCount() {
    const total = getDeliveryCartItems().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = total;
    });
}

function renderDeliveryHoverCart() {
    const hoverCartItems = document.getElementById('hover-cart-items');
    if (!hoverCartItems) return;

    const cart = getDeliveryCartItems();
    if (!cart.length) {
        hoverCartItems.innerHTML = '<p class="hover-cart-empty">Shopping cart is empty.</p>';
        return;
    }

    hoverCartItems.innerHTML = cart.map(item => `
        <div class="hover-cart-item">
            <img src="${item.image || ''}" alt="${item.name || 'Product'}">
            <div class="hover-cart-item-details">
                <p class="hover-cart-item-name">${item.name || 'Product'}</p>
                <p>Qty: ${Number(item.quantity) || 1}</p>
                <p>${formatCurrency(item.price)}</p>
            </div>
        </div>
    `).join('');
}


function initializePaymentOptions() {
    // Radio buttons now handle selection natively.
}

function getSelectedPaymentMethod() {
    const selectedInput = document.querySelector('input[name="payment"]:checked');
    const paymentKey = selectedInput?.value || 'cod';

    if (paymentKey === 'paystack') return 'Paystack';
    return 'Cash On Delivery';
}

function buildOrdersFromCart(cartItems, deliveryDetails, paymentMethod) {
    const placedAt = new Date().toISOString();

    return cartItems.map((item, index) => ({
        orderId: `ORD-${Date.now()}-${index + 1}`,
        id: item.id,
        name: item.name || 'Product',
        image: item.image || '../images/f1.jpg',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        size: item.size || 'N/A',
        paymentMethod,
        placedAt,
        status: 'Order Placed',
        category: item.category || 'clothing',
        gender: item.gender || 'women',
        deliveryDetails
    }));
}

function initializeDeliveryForm() {
    const form = document.getElementById('delivery-form');
    const feedback = document.getElementById('delivery-feedback');
    if (!form || !feedback) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (typeof getCurrentUser === 'function' && !getCurrentUser()) {
            localStorage.setItem(REDIRECT_URL_STORAGE_KEY, 'delivery.html');
            window.location.href = 'login.html';
            return;
        }

        const cartItems = getDeliveryCartItems();
        if (!cartItems.length) {
            feedback.hidden = false;
            feedback.textContent = 'Your cart is empty. Add items before placing an order.';
            return;
        }

        const deliveryDetails = Object.fromEntries(new FormData(form).entries());
        const paymentMethod = getSelectedPaymentMethod();
        const customerEmail = getCurrentUser();
        const profile = typeof getCurrentUserProfile === 'function' ? getCurrentUserProfile() : {};
        const customerName = profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : '';

        const API_URL = 'https://e-commerce-backend-4rnw.onrender.com/api';

        feedback.hidden = false;
        feedback.textContent = 'Placing your order...';

        try {
            // Create one order document per cart item
            for (let i = 0; i < cartItems.length; i++) {
                const item = cartItems[i];
                const orderData = {
                    orderId: `ORD-${Date.now()}-${i + 1}`,
                    customerEmail,
                    customerName: customerName || customerEmail.split('@')[0],
                    items: [{
                        productId: item.id || '',
                        name: item.name || 'Product',
                        image: item.image || '',
                        price: Number(item.price) || 0,
                        quantity: Number(item.quantity) || 1,
                        size: item.size || 'N/A',
                        category: item.category || 'clothing',
                        gender: item.gender || 'women',
                    }],
                    totalAmount: (Number(item.price) || 0) * (Number(item.quantity) || 1),
                    paymentMethod,
                    deliveryDetails,
                    status: 'Order Placed',
                };

                const response = await fetch(`${API_URL}/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.message || 'Failed to place order');
                }
            }

            clearCurrentUserCart();
            feedback.textContent = 'Order placed successfully!';

            setTimeout(() => {
                window.location.href = 'my-orders.html';
            }, 250);
        } catch (error) {
            console.error('Order placement error:', error);
            feedback.textContent = 'Error placing order: ' + error.message;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderDeliveryTotals();
    updateDeliveryCartCount();
    renderDeliveryHoverCart();
    initializeDeliveryForm();

    const hoverMenu = document.querySelector('.cart-menu');
    if (hoverMenu) {
        hoverMenu.addEventListener('mouseenter', renderDeliveryHoverCart);
    }
});
