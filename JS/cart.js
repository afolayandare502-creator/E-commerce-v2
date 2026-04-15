const SHIPPING_FEE = 10;
const TAX_RATE = 0.08;

function getCartItems() {
    return typeof getCurrentUserCart === 'function' ? getCurrentUserCart() : [];
}

function saveCartItems(items) {
    saveCurrentUserCart(items);
    updateCartCount();
    renderCartPage();
}

function formatPrice(value) {
    return `$${Number(value || 0).toFixed(2)}`;
}

function updateCartCount() {
    const total = getCartItems().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = total;
    });
}

function renderHoverCartMenu() {
    const hoverCartItems = document.getElementById('hover-cart-items');
    if (!hoverCartItems) return;

    const cart = getCartItems();
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
                <p>${formatPrice(item.price)}</p>
            </div>
        </div>
    `).join('');
}

function createCartItemRow(item, index) {
    const row = document.createElement('article');
    row.className = 'cart-item-row';

    const quantity = Number(item.quantity) || 1;
    const lineTotal = quantity * Number(item.price || 0);
    const categoryLabel = (item.category || 'Women').replace(/-/g, ' ');
    const gender = item.gender || 'women';
    const category = item.category || 'clothing';
    const productUrl = `product-details.html?id=${encodeURIComponent(item.id)}&gender=${encodeURIComponent(gender)}&category=${encodeURIComponent(category)}`;

    row.innerHTML = `
        <div class="cart-product-cell">
            <a href="${productUrl}" class="cart-product-link" aria-label="View ${item.name || 'product'} details">
                <img class="cart-product-image" src="${item.image || '../images/f1.jpg'}" alt="${item.name || 'Product'}">
            </a>
            <div class="cart-product-info">
                <h3 class="cart-product-name">
                    <a href="${productUrl}" class="cart-product-title-link">${item.name || 'Product'}</a>
                </h3>
                <p class="cart-product-meta">Size: ${item.size || 'One Size'} • Category: ${categoryLabel}</p>
                <p class="cart-product-price">${formatPrice(item.price)}</p>
            </div>
        </div>
        <div class="cart-quantity-cell">
            <div class="cart-qty-control">
                <button type="button" class="cart-qty-btn" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">−</button>
                <span class="cart-qty-value">${quantity}</span>
                <button type="button" class="cart-qty-btn" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button>
            </div>
        </div>
        <div class="cart-total-cell">
            <strong class="cart-line-total">${formatPrice(lineTotal)}</strong>
        </div>
        <div class="cart-actions-cell">
            <button type="button" class="cart-remove-btn" data-action="remove" data-index="${index}" aria-label="Remove item">
                <i class="far fa-trash-alt"></i>
            </button>
        </div>
    `;

    return row;
}

function renderCartPage() {
    const cartItemsList = document.getElementById('cart-items-list');
    const emptyState = document.getElementById('cart-empty-state');
    const cartLayout = document.querySelector('.cart-layout');
    const subtotalElement = document.getElementById('cart-subtotal');
    const shippingElement = document.getElementById('cart-shipping');
    const taxElement = document.getElementById('cart-tax');
    const totalElement = document.getElementById('cart-total');

    if (!cartItemsList || !emptyState || !cartLayout) return;

    const items = getCartItems();
    cartItemsList.innerHTML = '';
    const cartTotalsCard = document.querySelector('.cart-totals-card');

    if (!items.length) {
        cartItemsList.style.display = 'none';
        emptyState.hidden = false;
        if (cartTotalsCard) cartTotalsCard.hidden = true;
        if (subtotalElement) subtotalElement.textContent = formatPrice(0);
        if (shippingElement) shippingElement.textContent = formatPrice(0);
        if (taxElement) taxElement.textContent = formatPrice(0);
        if (totalElement) totalElement.textContent = formatPrice(0);
        renderHoverCartMenu();
        return;
    }

    cartItemsList.style.display = 'flex';
    emptyState.hidden = true;
    if (cartTotalsCard) cartTotalsCard.hidden = false;

    items.forEach((item, index) => {
        cartItemsList.appendChild(createCartItemRow(item, index));
    });

    const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
    const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;

    if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
    if (shippingElement) shippingElement.textContent = formatPrice(shipping);
    if (taxElement) taxElement.textContent = formatPrice(tax);
    if (totalElement) totalElement.textContent = formatPrice(total);

    renderHoverCartMenu();
}

function initializeCartActions() {
    const list = document.getElementById('cart-items-list');
    if (!list) return;

    list.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const action = btn.dataset.action;
        const index = parseInt(btn.dataset.index);
        let cart = getCartItems();

        if (action === 'increase') {
            cart[index].quantity = (Number(cart[index].quantity) || 1) + 1;
            saveCartItems(cart);
        } else if (action === 'decrease') {
            if (Number(cart[index].quantity) > 1) {
                cart[index].quantity = Number(cart[index].quantity) - 1;
                saveCartItems(cart);
            }
        } else if (action === 'remove') {
            cart.splice(index, 1);
            saveCartItems(cart);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCartPage();
    initializeCartActions();

    const checkoutButton = document.getElementById('checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (typeof getCurrentUser === 'function' && !getCurrentUser()) {
                localStorage.setItem(REDIRECT_URL_STORAGE_KEY, 'delivery.html');
                window.location.href = 'login.html';
                return;
            }
            window.location.href = 'delivery.html';
        });
    }

    const hoverMenu = document.querySelector('.cart-menu');
    if (hoverMenu) {
        hoverMenu.addEventListener('mouseenter', renderHoverCartMenu);
    }

    window.addEventListener('storage', event => {
        const cartKey = typeof getUserStorageKey === 'function' ? getUserStorageKey('cart') : '';
        const orderKey = typeof getUserStorageKey === 'function' ? getUserStorageKey('orders') : '';
        if (event.key === cartKey) {
            updateCartCount();
            renderCartPage();
        }
        if (event.key === orderKey) {
            renderCartOrders();
        }
    });
});
