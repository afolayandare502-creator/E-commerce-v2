function getReturnPolicyCartItems() {
    return typeof getCurrentUserCart === 'function' ? getCurrentUserCart() : [];
}

function formatReturnPolicyPrice(value) {
    return `$${Number(value || 0).toFixed(2)}`;
}

function updateReturnPolicyCartCount() {
    const total = getReturnPolicyCartItems().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = total;
    });
}

function renderReturnPolicyHoverCart() {
    const hoverCartItems = document.getElementById('hover-cart-items');
    if (!hoverCartItems) return;

    const cart = getReturnPolicyCartItems();
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
                <p>${formatReturnPolicyPrice(item.price)}</p>
            </div>
        </div>
    `).join('');
}

function initializeReturnPolicyToc() {
    document.querySelectorAll('.return-toc a').forEach(link => {
        link.addEventListener('click', event => {
            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;

            const section = document.querySelector(targetId);
            if (!section) return;

            event.preventDefault();
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateReturnPolicyCartCount();
    renderReturnPolicyHoverCart();
    initializeReturnPolicyToc();

    const hoverMenu = document.querySelector('.cart-menu');
    if (hoverMenu) {
        hoverMenu.addEventListener('mouseenter', renderReturnPolicyHoverCart);
    }
});
