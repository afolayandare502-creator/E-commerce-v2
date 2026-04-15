document.addEventListener('DOMContentLoaded', () => {
    renderSavedItems();
    window.addEventListener('wishlist:updated', renderSavedItems);
});

function renderSavedItems() {
    const grid = document.getElementById('saved-items-grid');
    const count = document.getElementById('saved-items-count');
    const empty = document.getElementById('saved-items-empty');
    if (!grid || !count || !empty || !window.WishlistStore) {
        return;
    }

    const items = window.WishlistStore.getItems();
    count.textContent = `${items.length} item${items.length === 1 ? '' : 's'}`;

    if (!items.length) {
        grid.innerHTML = '';
        empty.hidden = false;
        return;
    }

    empty.hidden = true;
    grid.innerHTML = items.map(buildSavedItemCard).join('');

    grid.querySelectorAll('[data-remove-key]').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();

            const key = button.getAttribute('data-remove-key');
            const match = items.find(item => window.WishlistStore.buildKey(item) === key);
            if (match) {
                window.WishlistStore.removeItem(match);
            }
        });
    });
}

function buildSavedItemCard(item) {
    const detailsUrl = `product-details.html?id=${item.id}&gender=${encodeURIComponent(item.gender)}&category=${encodeURIComponent(item.category)}`;
    const image = item.image || '../images/f1.jpg';
    const key = window.WishlistStore.buildKey(item);

    return `
        <a href="${detailsUrl}" class="saved-card">
            <div class="saved-card-media">
                <img src="${image}" alt="${item.name}" class="primary-img" onerror="this.src='../images/f1.jpg'">
                ${item.secondaryImage ? `<img src="${item.secondaryImage}" alt="${item.name}" class="secondary-img" onerror="this.src='../images/f1.jpg'">` : ''}
                <button class="saved-remove-btn" data-remove-key="${key}" aria-label="Remove saved item">
                    <i class="far fa-trash-alt"></i>
                </button>
            </div>
            <div class="saved-card-info">
                <h3>${item.name}</h3>
                <p>$${Number(item.price).toFixed(2)}</p>
            </div>
        </a>
    `;
}
