const CURRENT_USER_STORAGE_KEY = 'currentUser';
const GUEST_CART_STORAGE_KEY = 'guest_cart';
const GUEST_SAVED_STORAGE_KEY = 'guest_saved';
const REDIRECT_URL_STORAGE_KEY = 'redirectURL';
const LOGIN_IDENTIFIER_STORAGE_KEY = 'loginIdentifier';

function normalizeUserEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function getCurrentUser() {
    return normalizeUserEmail(localStorage.getItem(CURRENT_USER_STORAGE_KEY));
}

function setCurrentUser(email) {
    const normalizedEmail = normalizeUserEmail(email);
    if (!normalizedEmail) return '';
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, normalizedEmail);
    return normalizedEmail;
}

function getUserStorageKey(suffix) {
    const currentUser = getCurrentUser();
    if (!currentUser) return '';
    return `${currentUser}_${suffix}`;
}

function getCurrentUserProfile() {
    const key = getUserStorageKey('profile');
    if (!key) return null;

    try {
        return JSON.parse(localStorage.getItem(key)) || null;
    } catch (error) {
        console.error('Unable to read user profile:', error);
        return null;
    }
}

function saveCurrentUserProfile(profile) {
    const key = getUserStorageKey('profile');
    if (!key) return;

    localStorage.setItem(key, JSON.stringify(profile || {}));
}

function getCurrentUserDisplayName() {
    const profile = getCurrentUserProfile();
    const firstName = String(profile && profile.firstName ? profile.firstName : '').trim();

    if (firstName) {
        return firstName;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) return '';

    const emailPrefix = currentUser.split('@')[0] || currentUser;
    return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
}

function clearCurrentUserSession() {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    localStorage.removeItem(LOGIN_IDENTIFIER_STORAGE_KEY);
    localStorage.removeItem(REDIRECT_URL_STORAGE_KEY);
}

function readUserScopedCollection(suffix) {
    const key = getUserStorageKey(suffix);
    if (!key) return [];

    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        console.error(`Unable to read user-scoped ${suffix}:`, error);
        return [];
    }
}

function writeUserScopedCollection(suffix, value) {
    const key = getUserStorageKey(suffix);
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(value));
}

function clearUserScopedCollection(suffix) {
    const key = getUserStorageKey(suffix);
    if (!key) return;
    localStorage.removeItem(key);
}

function getCurrentUserCart() {
    if (getCurrentUser()) {
        return readUserScopedCollection('cart');
    }

    try {
        return JSON.parse(localStorage.getItem(GUEST_CART_STORAGE_KEY)) || [];
    } catch (error) {
        console.error('Unable to read guest cart:', error);
        return [];
    }
}

function saveCurrentUserCart(items) {
    if (getCurrentUser()) {
        writeUserScopedCollection('cart', items);
        return;
    }

    localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
}

function clearCurrentUserCart() {
    if (getCurrentUser()) {
        clearUserScopedCollection('cart');
        return;
    }

    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
}

function getCurrentUserOrders() {
    return readUserScopedCollection('orders');
}

function saveCurrentUserOrders(orders) {
    writeUserScopedCollection('orders', orders);
}

function getCurrentUserSavedItems() {
    if (getCurrentUser()) {
        return readUserScopedCollection('saved');
    }

    try {
        return JSON.parse(localStorage.getItem(GUEST_SAVED_STORAGE_KEY)) || [];
    } catch (error) {
        console.error('Unable to read guest saved items:', error);
        return [];
    }
}

function saveCurrentUserSavedItems(items) {
    if (getCurrentUser()) {
        writeUserScopedCollection('saved', items);
        return;
    }

    localStorage.setItem(GUEST_SAVED_STORAGE_KEY, JSON.stringify(items));
}

function clearGuestCart() {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
}

function clearGuestSavedItems() {
    localStorage.removeItem(GUEST_SAVED_STORAGE_KEY);
}

function mergeGuestItemsByKey(existingItems, guestItems, keyBuilder) {
    const merged = [...existingItems];

    guestItems.forEach((guestItem) => {
        const guestKey = keyBuilder(guestItem);
        const existingIndex = merged.findIndex((item) => keyBuilder(item) === guestKey);

        if (existingIndex >= 0) {
            const existingItem = merged[existingIndex];
            if (typeof existingItem.quantity === 'number' || typeof guestItem.quantity === 'number') {
                existingItem.quantity = (Number(existingItem.quantity) || 0) + (Number(guestItem.quantity) || 0);
            }
            return;
        }

        merged.push(guestItem);
    });

    return merged;
}

function mergeGuestDataIntoUser() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const guestCart = (() => {
        try {
            return JSON.parse(localStorage.getItem(GUEST_CART_STORAGE_KEY)) || [];
        } catch (error) {
            return [];
        }
    })();

    const guestSaved = (() => {
        try {
            return JSON.parse(localStorage.getItem(GUEST_SAVED_STORAGE_KEY)) || [];
        } catch (error) {
            return [];
        }
    })();

    if (guestCart.length) {
        const mergedCart = mergeGuestItemsByKey(
            readUserScopedCollection('cart'),
            guestCart,
            (item) => `${item.id}::${item.size || ''}::${item.gender || 'women'}::${item.category || ''}`
        );
        writeUserScopedCollection('cart', mergedCart);
    }

    if (guestSaved.length) {
        const mergedSaved = mergeGuestItemsByKey(
            readUserScopedCollection('saved'),
            guestSaved,
            (item) => `${item.gender || 'women'}::${item.category || ''}::${item.id}`
        );
        writeUserScopedCollection('saved', mergedSaved);
    }

    clearGuestCart();
    clearGuestSavedItems();
}

function registerGlobalUser(profile) {
    if (!profile || !profile.email) return;

    try {
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem('users')) || [];
        } catch (e) {
            users = [];
        }
        
        if (!Array.isArray(users)) users = [];

        const normalizedEmail = normalizeUserEmail(profile.email);

        const existingIndex = users.findIndex(u => normalizeUserEmail(typeof u === 'string' ? u : u.email) === normalizedEmail);
        if (existingIndex >= 0) {
            users[existingIndex] = { ...(typeof users[existingIndex] === 'object' ? users[existingIndex] : {}), ...profile };
        } else {
            users.push(profile);
        }

        localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
        console.error('Failed to register global user:', error);
    }
}

function registerGlobalOrders(newOrders) {
    if (!Array.isArray(newOrders) || !newOrders.length) return;

    try {
        let allOrders = [];
        try {
            allOrders = JSON.parse(localStorage.getItem('orders')) || [];
        } catch (e) {
            allOrders = [];
        }

        if (!Array.isArray(allOrders)) allOrders = [];

        // Avoid duplicates by checking orderId
        newOrders.forEach(newOrder => {
            const newId = newOrder.orderId || newOrder.id;
            if (!allOrders.some(o => (o.orderId || o.id) === newId)) {
                allOrders.unshift(newOrder); // Add new orders to front for "Recent Orders"
            }
        });

        localStorage.setItem('orders', JSON.stringify(allOrders));
    } catch (error) {
        console.error('Failed to register global orders:', error);
    }
}
