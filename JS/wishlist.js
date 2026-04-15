function getWishlistItems() {
    if (typeof getCurrentUserSavedItems !== 'function') {
        return [];
    }

    const items = getCurrentUserSavedItems();
    return Array.isArray(items) ? items : [];
}

function saveWishlistItems(items) {
    if (typeof saveCurrentUserSavedItems === 'function') {
        saveCurrentUserSavedItems(items);
    }
    window.dispatchEvent(new CustomEvent('wishlist:updated', {
        detail: { items }
    }));
}

function buildWishlistKey(product) {
    return [product.gender || 'women', product.category || '', product.id].join('::');
}

function normalizeWishlistProduct(product) {
    return {
        id: product.id,
        name: product.name,
        price: Number(product.price) || 0,
        image: product.image || '',
        category: product.category || '',
        gender: product.gender || 'women',
        savedAt: product.savedAt || new Date().toISOString()
    };
}

function isWishlistItemSaved(product) {
    const key = buildWishlistKey(product);
    return getWishlistItems().some(item => buildWishlistKey(item) === key);
}

function toggleWishlistItem(product) {
    const items = getWishlistItems();
    const normalized = normalizeWishlistProduct(product);
    const key = buildWishlistKey(normalized);
    const existingIndex = items.findIndex(item => buildWishlistKey(item) === key);

    if (existingIndex >= 0) {
        items.splice(existingIndex, 1);
        saveWishlistItems(items);
        return false;
    }

    items.unshift(normalized);
    saveWishlistItems(items);
    return true;
}

function removeWishlistItem(product) {
    const key = buildWishlistKey(product);
    const items = getWishlistItems().filter(item => buildWishlistKey(item) !== key);
    saveWishlistItems(items);
}

window.WishlistStore = {
    getItems: getWishlistItems,
    saveItems: saveWishlistItems,
    isSaved: isWishlistItemSaved,
    toggleItem: toggleWishlistItem,
    removeItem: removeWishlistItem,
    buildKey: buildWishlistKey
};
