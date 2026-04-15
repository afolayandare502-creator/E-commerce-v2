function getStoredOrders() {
    return typeof getCurrentUserOrders === 'function' ? getCurrentUserOrders() : [];
}

function updateCartCount() {
    const cart = typeof getCurrentUserCart === 'function' ? getCurrentUserCart() : [];

    const total = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    document.querySelectorAll('.cart-count').forEach((element) => {
        element.textContent = total;
    });
}

function formatPrice(value) {
    return `$${Number(value || 0).toFixed(2)}`;
}

function formatOrderDate(value) {
    const date = value ? new Date(value) : new Date();
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function createOrderCard(order) {
    const quantity = Number(order.quantity) || 1;
    const size = order.size || 'N/A';
    const payment = order.paymentMethod || 'Cash On Delivery';

    const card = document.createElement('article');
    card.className = 'order-card';
    card.innerHTML = `
        <div class="order-product">
            <img class="order-product-image" src="${order.image || '../images/f1.jpg'}" alt="${order.name || 'Product'}">
            <div class="order-product-info">
                <h2>${order.name || 'Product'}</h2>
                <p class="order-meta-price">${formatPrice(order.price)} &nbsp; Quantity: ${quantity} &nbsp; Size: ${size}</p>
                <p class="order-meta-sub">Date: ${formatOrderDate(order.placedAt)}</p>
                <p class="order-meta-extra">Payment: ${payment}</p>
            </div>
        </div>
        <div class="order-status">Order Placed</div>
        <button type="button" class="order-action">Track Order</button>
    `;

    return card;
}

function renderOrders() {
    const list = document.getElementById('orders-list');
    const empty = document.getElementById('orders-empty');
    if (!list || !empty) return;

    const orders = getStoredOrders();
    list.innerHTML = '';

    if (!orders.length) {
        empty.hidden = false;
        return;
    }

    empty.hidden = true;
    orders.forEach((order) => {
        list.appendChild(createOrderCard(order));
    });
}

function initSmartNavbar() {
    const stickyHeader = document.getElementById('sticky-header-container');
    if (!stickyHeader) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    const hideThreshold = 100;
    const downDelta = 10;
    const upDelta = 2;

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        const scrollDifference = currentScrollY - lastScrollY;

        if (currentScrollY <= 0) {
            stickyHeader.classList.remove('header-hidden');
            lastScrollY = 0;
            ticking = false;
            return;
        }

        if (scrollDifference > downDelta && currentScrollY > hideThreshold) {
            stickyHeader.classList.add('header-hidden');
            lastScrollY = currentScrollY;
        } else if (scrollDifference < -upDelta) {
            stickyHeader.classList.remove('header-hidden');
            lastScrollY = currentScrollY;
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
    initSmartNavbar();
    updateCartCount();
    renderOrders();
});
