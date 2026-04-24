const ADMIN_ALL_ORDERS_KEY = 'orders';
const API_BASE_URL = 'https://e-commerce-backend-4rnw.onrender.com/api';
const ORDER_STATUS_OPTIONS = [
    'Order Placed',
    'Packing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Completed',
    'Paid'
];

const state = {
    view: 'dashboard',
    orders: [],
    customers: [],
    dbProducts: [],
    selectedOrders: new Set(),
    filters: {
        type: 'all',
        status: 'all',
        date: 'all',
        search: '',
        customerSearch: ''
    },
    activeCustomerEmail: ''
};

function safeParse(value, fallback) {
    try {
        const parsed = JSON.parse(value);
        return parsed ?? fallback;
    } catch (error) {
        return fallback;
    }
}

function getLocalStorageCollection(key) {
    return safeParse(localStorage.getItem(key), []);
}

function saveAllOrders(orders) {
    localStorage.setItem(ADMIN_ALL_ORDERS_KEY, JSON.stringify(orders));
}

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function getUserProfileByEmail(email) {
    return safeParse(localStorage.getItem(`${normalizeEmail(email)}_profile`), null);
}

function getUserCartByEmail(email) {
    return safeParse(localStorage.getItem(`${normalizeEmail(email)}_cart`), []);
}

function formatAdminDate(value) {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) return 'Recent';

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function formatAdminPrice(value) {
    const num = Number(value || 0);
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getStatusClassName(status) {
    return String(status || 'Order Placed')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
}

function getDisplayNameFromEmail(email) {
    const prefix = normalizeEmail(email).split('@')[0] || 'Guest User';
    return prefix
        .split(/[._-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ') || 'Guest User';
}

function buildInitials(name) {
    return String(name || 'GU')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

function getOrderNumber(order, index) {
    // Handle user's data structure with id property like "#4567"
    if (order.id) {
        return order.id.startsWith('#') ? order.id : `#${order.id}`;
    }
    return order.orderId || order.orderNumber || `ORD-${String(index + 1).padStart(5, '0')}`;
}

function inferOrderType(order) {
    const rawType = String(order.type || order.orderType || order.deliveryType || '').toLowerCase();
    const detailMethod = String(order.deliveryDetails?.deliveryMethod || '').toLowerCase();

    if (rawType.includes('pickup') || detailMethod.includes('pickup')) {
        return 'Pickup';
    }

    return 'Shipping';
}

function getCustomerEmail(order) {
    // Handle customer name as email fallback (for simple data structure)
    const email = order.customerEmail || order.email || order.userEmail || order.deliveryDetails?.email || '';
    if (email) return normalizeEmail(email);
    // If no email but has customer name, create a pseudo-email
    if (order.customer) {
        return normalizeEmail(order.customer.replace(/\s+/g, '.').toLowerCase() + '@guest.com');
    }
    return '';
}

function getCustomerName(order) {
    // First check for direct customer property
    if (order.customer) return order.customer;

    const profile = getUserProfileByEmail(getCustomerEmail(order));
    const firstName = order.deliveryDetails?.firstName || profile?.firstName || '';
    const lastName = order.deliveryDetails?.lastName || profile?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || getDisplayNameFromEmail(getCustomerEmail(order));
}

function getOrderItems(order) {
    if (Array.isArray(order.items) && order.items.length) {
        return order.items;
    }

    return [{
        id: order.id,
        name: order.name || 'Product',
        image: order.image || '',
        price: Number(order.price) || 0,
        quantity: Number(order.quantity) || 1
    }];
}

function getOrderItemsLabel(order) {
    return getOrderItems(order)
        .map((item) => `${item.name || 'Item'} x${Number(item.quantity) || 1}`)
        .join(', ');
}

function getOrderTotal(order) {
    // Check for amount property first (user's data structure)
    if (order.amount != null) {
        return Number(order.amount) || 0;
    }
    if (order.total != null) {
        return Number(order.total) || 0;
    }

    return getOrderItems(order).reduce((sum, item) => {
        return sum + (Number(item.price) || 0) * (Number(item.quantity) || 1);
    }, 0);
}

function buildNormalizedOrder(order, index, emailFallback = '') {
    const email = getCustomerEmail(order) || normalizeEmail(emailFallback);
    const total = getOrderTotal(order);
    const customerName = getCustomerName(order);
    return {
        ...order,
        _index: index,
        _key: order.orderId || order.id || `${email}-${order.placedAt || order.date || index}-${total}`,
        customerEmail: email,
        customerName: customerName,
        orderNumber: getOrderNumber(order, index),
        type: inferOrderType(order),
        status: order.status || 'Order Placed',
        items: getOrderItems(order),
        itemsLabel: getOrderItemsLabel(order),
        totalAmount: total,
        placedAt: order.placedAt || order.date || new Date().toISOString()
    };
}

async function fetchAllOrdersFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch orders from API');
        const apiOrders = await response.json();

        return apiOrders.map((rawOrder, index) => {
            try {
                return buildNormalizedOrder(rawOrder, index);
            } catch (err) {
                console.warn('Skipping malformed order:', rawOrder, err);
                return null;
            }
        }).filter(Boolean).sort((a, b) => {
            const timeA = new Date(a.placedAt).getTime() || 0;
            const timeB = new Date(b.placedAt).getTime() || 0;
            return timeB - timeA;
        });
    } catch (error) {
        console.error('Error fetching orders from API:', error);
        return [];
    }
}

async function updateOrderStatusViaAPI(order, nextStatus) {
    try {
        const orderId = order._id || order.orderId;
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status: nextStatus }),
        });
        if (!response.ok) throw new Error('Failed to update order status');
        return await response.json();
    } catch (error) {
        console.error('Error updating order status:', error);
        return null;
    }
}

async function updateOrderStatusByKey(orderKey, nextStatus) {
    const targetOrder = state.orders.find(o => o._key === orderKey);
    if (!targetOrder) return;

    await updateOrderStatusViaAPI(targetOrder, nextStatus);

    state.orders = state.orders.map((order) => {
        if (order._key !== orderKey) return order;
        return { ...order, status: nextStatus };
    });

    state.customers = getCustomersFromOrders();
    renderCurrentView();
}

function buildOrderStatusSelect(order) {
    return `
        <select class="admin-order-status" data-order-key="${order._key}">
            ${ORDER_STATUS_OPTIONS.map((status) => `
                <option value="${status}" ${status === order.status ? 'selected' : ''}>${status}</option>
            `).join('')}
        </select>
    `;
}

function buildCustomerStatusSelect(customer) {
    return `
        <select class="admin-customer-status" data-customer-email="${customer.email}">
            ${ORDER_STATUS_OPTIONS.map((status) => `
                <option value="${status}" ${status === customer.latestStatus ? 'selected' : ''}>${status}</option>
            `).join('')}
        </select>
    `;
}

function renderAvatarMarkup(name, image, className = 'avatar') {
    if (image) {
        return `<div class="${className}"><img src="${image}" alt="${name}"></div>`;
    }

    return `<div class="${className}">${buildInitials(name)}</div>`;
}

function getFilteredOrders() {
    const searchTerm = state.filters.search.trim().toLowerCase();
    const now = new Date();

    return state.orders.filter((order) => {
        const orderDate = new Date(order.placedAt);
        const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
        const matchesType = state.filters.type === 'all' || order.type.toLowerCase() === state.filters.type;
        const matchesStatus = state.filters.status === 'all' || order.status === state.filters.status;

        let matchesDate = true;
        if (state.filters.date === 'today') {
            matchesDate = formatAdminDate(orderDate) === formatAdminDate(now);
        } else if (state.filters.date === '7') {
            matchesDate = daysDiff <= 7;
        } else if (state.filters.date === '30') {
            matchesDate = daysDiff <= 30;
        } else if (state.filters.date === 'year') {
            matchesDate = orderDate.getFullYear() === now.getFullYear();
        }

        const haystack = [
            order.orderNumber,
            order.customerName,
            order.customerEmail,
            order.itemsLabel,
            order.status,
            order.type
        ].join(' ').toLowerCase();

        const matchesSearch = !searchTerm || haystack.includes(searchTerm);

        return matchesType && matchesStatus && matchesDate && matchesSearch;
    });
}

function getCustomersFromOrders() {
    try {
        const customerMap = new Map();

        // First, populate with all registered users from the global list
        const globalUsers = getLocalStorageCollection('users');
        globalUsers.forEach(user => {
            try {
                const email = normalizeEmail(typeof user === 'string' ? user : (user?.email || ''));
                if (!email) return;

                const profile = typeof user === 'object' ? user : (getUserProfileByEmail(email) || {});
                const cart = getUserCartByEmail(email);

                customerMap.set(email, {
                    email,
                    name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || getDisplayNameFromEmail(email),
                    phone: profile.mobile || profile.phone || 'No phone number',
                    image: profile.image || profile.avatar || '',
                    orders: 0,
                    spent: 0,
                    latestStatus: 'No Orders',
                    latestOrderDate: '',
                    cartItems: cart,
                    profile
                });
            } catch (err) {
                console.warn('Skipping malformed user record:', user, err);
            }
        });

        // Then, merge in data from actual orders
        state.orders.forEach((order) => {
            try {
                const email = normalizeEmail(order.customerEmail);
                if (!email) return;

                const profile = getUserProfileByEmail(email) || {};
                const cart = getUserCartByEmail(email);
                const current = customerMap.get(email) || {
                    email,
                    name: '',
                    phone: '',
                    image: profile.image || profile.avatar || '',
                    orders: 0,
                    spent: 0,
                    latestStatus: 'Order Placed',
                    latestOrderDate: '',
                    cartItems: cart,
                    profile
                };

                current.name = current.name || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || order.customerName;
                current.phone = current.phone || profile.mobile || profile.phone || order.deliveryDetails?.phone || 'No phone number';
                current.orders += 1;
                current.spent += (Number(order.totalAmount) || 0);

                if (!current.latestOrderDate || new Date(order.placedAt) > new Date(current.latestOrderDate)) {
                    current.latestOrderDate = order.placedAt;
                    current.latestStatus = order.status;
                }

                customerMap.set(email, current);
            } catch (err) {
                console.warn('Skipping malformed order for customer list:', order, err);
            }
        });

        return Array.from(customerMap.values())
            .map((customer) => ({
                ...customer,
                name: customer.name || getDisplayNameFromEmail(customer.email)
            }))
            .sort((a, b) => (Number(b.spent) || 0) - (Number(a.spent) || 0) || (Number(b.orders) || 0) - (Number(a.orders) || 0));
    } catch (error) {
        console.error('Critical error in getCustomersFromOrders:', error);
        return [];
    }
}

async function hydrateAdminData() {
    try {
        state.orders = await fetchAllOrdersFromAPI();
        state.customers = getCustomersFromOrders();
    } catch (error) {
        console.error('Failed to hydrate admin data:', error);
        state.orders = state.orders || [];
        state.customers = state.customers || [];
    }
}

function getTopProducts() {
    const productMap = new Map();

    state.orders.forEach((order) => {
        // Handle orders with items array
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item) => {
                const id = item.id || item.name;
                const existing = productMap.get(id);
                if (existing) {
                    existing.quantity += Number(item.quantity) || 1;
                    existing.revenue += (Number(item.price) || 0) * (Number(item.quantity) || 1);
                } else {
                    productMap.set(id, {
                        id,
                        name: item.name || 'Product',
                        image: item.image || '',
                        price: Number(item.price) || 0,
                        quantity: Number(item.quantity) || 1,
                        revenue: (Number(item.price) || 0) * (Number(item.quantity) || 1)
                    });
                }
            });
        } else if (order.id || order.productName || order.name) {
            // Handle simple order structure without items array
            const id = order.productId || order.id || 'product';
            const existing = productMap.get(id);
            const amount = order.amount || order.total || 0;
            if (existing) {
                existing.quantity += 1;
                existing.revenue += Number(amount);
            } else {
                productMap.set(id, {
                    id,
                    name: order.productName || order.name || 'Product',
                    image: order.image || '',
                    price: Number(amount),
                    quantity: 1,
                    revenue: Number(amount)
                });
            }
        }
    });

    return Array.from(productMap.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
}

function renderSalesTrendsChart() {
    const chartContainer = document.getElementById('sales-trends-chart');
    const salesTotal = document.getElementById('sales-trends-total');
    if (!chartContainer) return;

    const months = 12;
    const monthlyData = Array(months).fill(0);

    state.orders.forEach((order) => {
        const date = new Date(order.placedAt || order.date);
        const monthIndex = (date.getMonth() + 12 - 4) % 12;
        if (monthIndex >= 0 && monthIndex < months) {
            monthlyData[monthIndex] += (order.totalAmount || order.amount || 0);
        }
    });

    const maxValue = Math.max(...monthlyData, 1);
    const total = monthlyData.reduce((a, b) => a + b, 0);

    if (salesTotal) {
        salesTotal.textContent = '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    chartContainer.innerHTML = monthlyData.map((value, index) => {
        const height = (value / maxValue) * 100;
        const isActive = index >= 4 && index <= 7;
        return `<div class="chart-bar ${isActive ? 'active' : ''}" style="height: ${Math.max(height, 5)}%" title="$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}"></div>`;
    }).join('');
}

function renderTopProducts() {
    const container = document.getElementById('top-products-list');
    if (!container) return;

    const topProducts = getTopProducts();

    container.innerHTML = topProducts.length ? topProducts.map((product) => `
        <div class="top-product-item">
            <img class="top-product-thumb" src="${product.image || '../../images/1.png'}" alt="${product.name}">
            <div class="top-product-info">
                <h4>${product.name}</h4>
                <p>${product.quantity} units sold</p>
            </div>
            <div class="top-product-price">${formatAdminPrice(product.revenue)}</div>
        </div>
    `).join('') : '<div class="empty-state">No products sold yet.</div>';
}

function renderRecentOrders() {
    const tbody = document.getElementById('recent-orders-tbody');
    const countEl = document.getElementById('recent-orders-count');
    if (!tbody) return;

    const recentOrders = state.orders.slice(0, 6);

    if (countEl) countEl.textContent = String(state.orders.length);

    tbody.innerHTML = recentOrders.length ? recentOrders.map((order) => {
        const statusClass = order.status === 'Completed' || order.status === 'Delivered' || order.status === 'Paid' ? 'completed' : 'pending';
        const statusIcon = statusClass === 'completed' ? 'fa-check-circle' : 'fa-clock';
        // Use amount property directly from order data
        const orderAmount = order.amount || order.totalAmount || 0;
        const orderId = order.id || order.orderNumber || `ORD-${String(order._index + 1).padStart(5, '0')}`;
        const customerName = order.customer || order.customerName || 'Guest User';
        const orderDate = order.date || formatAdminDate(order.placedAt);
        return `
            <tr>
                <td class="order-id">#${orderId.replace(/^#/, '').replace(/^ORD-/, '')}</td>
                <td>${customerName}</td>
                <td>${orderDate}</td>
                <td>$${Number(orderAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>
                    <span class="order-status ${statusClass}">
                        <i class="fas ${statusIcon}"></i>
                        ${order.status}
                    </span>
                </td>
            </tr>
        `;
    }).join('') : '<tr><td colspan="5"><div class="empty-state">No orders placed yet.</div></td></tr>';
}

function getUsersCount() {
    const users = safeParse(localStorage.getItem('users'), []);
    return users.length || state.customers.length;
}

function renderDashboard() {
    const revenueTotal = document.getElementById('dashboard-revenue-total');
    const ordersTotal = document.getElementById('dashboard-orders-total');
    const customersTotal = document.getElementById('dashboard-customers-total');
    const aovTotal = document.getElementById('dashboard-aov-total');

    // Calculate total revenue using amount property
    const totalRevenue = state.orders.reduce((sum, order) => sum + (order.totalAmount || order.amount || 0), 0);
    const aov = state.orders.length > 0 ? totalRevenue / state.orders.length : 0;
    const usersCount = getUsersCount();

    if (revenueTotal) {
        revenueTotal.textContent = '$' + totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (ordersTotal) ordersTotal.textContent = String(state.orders.length);
    if (customersTotal) customersTotal.textContent = String(usersCount);
    if (aovTotal) {
        aovTotal.textContent = '$' + aov.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    renderSalesTrendsChart();
    renderTopProducts();
    renderRecentOrders();
}

function renderOrdersTable() {
    const tbody = document.getElementById('admin-orders-tbody');
    const bulkBar = document.getElementById('orders-bulk-bar');
    const selectedCount = document.getElementById('orders-selected-count');
    const selectAll = document.getElementById('orders-select-all');
    if (!tbody) return;

    const filteredOrders = getFilteredOrders();

    tbody.innerHTML = filteredOrders.length ? filteredOrders.map((order) => `
        <tr>
            <td>
                <input type="checkbox" class="order-row-checkbox" data-order-key="${order._key}" ${state.selectedOrders.has(order._key) ? 'checked' : ''}>
            </td>
            <td><strong>#${order.orderNumber.replace(/^ORD-/, '')}</strong></td>
            <td>
                <div class="customer-cell">
                    ${renderAvatarMarkup(order.customerName, '', 'avatar')}
                    <div class="customer-meta">
                        <strong>${order.customerName}</strong>
                        <span>${order.customerEmail}</span>
                    </div>
                </div>
            </td>
            <td>${order.type}</td>
            <td>${buildOrderStatusSelect(order)}</td>
            <td><div class="product-summary">${order.itemsLabel}</div></td>
            <td><strong>${formatAdminPrice(order.totalAmount)}</strong></td>
            <td>${formatAdminDate(order.placedAt)}</td>
            <td><button class="row-action-btn" type="button" aria-label="Order actions"><i class="fas fa-ellipsis-h"></i></button></td>
        </tr>
    `).join('') : `
        <tr>
            <td colspan="9"><div class="empty-state">No orders matched the current filters.</div></td>
        </tr>
    `;

    if (selectedCount) selectedCount.textContent = String(state.selectedOrders.size);
    if (bulkBar) bulkBar.hidden = state.selectedOrders.size === 0;
    if (selectAll) {
        selectAll.checked = filteredOrders.length > 0 && filteredOrders.every((order) => state.selectedOrders.has(order._key));
    }
}

function getFilteredCustomers() {
    const searchTerm = state.filters.customerSearch.trim().toLowerCase();
    if (!searchTerm) return state.customers;

    return state.customers.filter((customer) => {
        const haystack = [
            customer.name,
            customer.email,
            customer.phone,
            String(customer.orders),
            String(customer.spent)
        ].join(' ').toLowerCase();

        return haystack.includes(searchTerm);
    });
}

function renderCustomersTable() {
    const tbody = document.getElementById('admin-customers-tbody');
    if (!tbody) return;

    const customers = getFilteredCustomers();

    tbody.innerHTML = customers.length ? customers.map((customer) => `
        <tr class="customer-row" data-customer-email="${customer.email}">
            <td>
                <div class="customer-cell">
                    ${renderAvatarMarkup(customer.name, customer.image, 'avatar')}
                    <div class="customer-meta">
                        <strong>${customer.name}</strong>
                        <span>${customer.phone}</span>
                    </div>
                </div>
            </td>
            <td>${customer.email}</td>
            <td>${customer.orders}</td>
            <td class="customer-spent">${formatAdminPrice(customer.spent)}</td>
            <td>${buildCustomerStatusSelect(customer)}</td>
            <td><button class="row-action-btn" type="button" aria-label="Customer actions"><i class="fas fa-ellipsis-h"></i></button></td>
        </tr>
    `).join('') : `
        <tr>
            <td colspan="6"><div class="empty-state">No customers matched your search.</div></td>
        </tr>
    `;
}

function setDrawerOpen(isOpen) {
    const drawer = document.getElementById('customer-drawer');
    const backdrop = document.getElementById('customer-drawer-backdrop');
    if (!drawer || !backdrop) return;

    drawer.classList.toggle('is-open', isOpen);
    drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    backdrop.hidden = !isOpen;
    backdrop.classList.toggle('is-open', isOpen);
}

function closeCustomerDrawer() {
    state.activeCustomerEmail = '';
    setDrawerOpen(false);
}

function renderCustomerDrawer(email) {
    const customer = state.customers.find((item) => item.email === email);
    if (!customer) return;

    const drawerOrderLabel = document.getElementById('drawer-order-label');
    const drawerAvatar = document.getElementById('drawer-avatar');
    const drawerName = document.getElementById('drawer-name');
    const drawerEmail = document.getElementById('drawer-email');
    const drawerPhone = document.getElementById('drawer-phone');
    const drawerCartCount = document.getElementById('drawer-cart-count');
    const drawerCartList = document.getElementById('drawer-cart-list');
    const drawerTotalPrice = document.getElementById('drawer-total-price');

    const cartItems = Array.isArray(customer.cartItems) ? customer.cartItems : [];
    const cartTotal = cartItems.reduce((sum, item) => {
        return sum + (Number(item.price) || 0) * (Number(item.quantity) || 1);
    }, 0);

    if (drawerOrderLabel) drawerOrderLabel.textContent = customer.name;
    if (drawerAvatar) drawerAvatar.innerHTML = customer.image
        ? `<img src="${customer.image}" alt="${customer.name}">`
        : buildInitials(customer.name);
    if (drawerName) drawerName.textContent = customer.name;
    if (drawerEmail) drawerEmail.textContent = customer.email;
    if (drawerPhone) drawerPhone.textContent = customer.phone;
    if (drawerCartCount) drawerCartCount.textContent = `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'}`;
    if (drawerTotalPrice) drawerTotalPrice.textContent = formatAdminPrice(cartTotal);

    if (drawerCartList) {
        drawerCartList.innerHTML = cartItems.length ? cartItems.map((item) => `
            <article class="drawer-cart-item">
                <img class="drawer-cart-thumb" src="${item.image || '../../images/1.png'}" alt="${item.name || 'Product'}">
                <div>
                    <h5>${item.name || 'Product'}</h5>
                    <p>Qty: ${Number(item.quantity) || 1}</p>
                    <p>${formatAdminPrice(item.price)}</p>
                </div>
            </article>
        `).join('') : '<div class="empty-state">This customer has no active items in cart.</div>';
    }

    setDrawerOpen(true);
}

// --- PRODUCT MANAGEMENT (BACKEND INTEGRATION) ---

async function fetchAdminProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Network response was not ok');
        const products = await response.json();
        state.dbProducts = products;
        return products;
    } catch (error) {
        console.error('Failed to fetch backend products:', error);
        return [];
    }
}

async function deleteBackendProduct(id) {
    if (!confirm('Are you confirm to delete this product? This action cannot be undone.')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to delete product');
        await fetchAdminProducts();
        renderProductsTable();
    } catch (error) {
        alert('Error deleting product.');
        console.error(error);
    }
}

function renderProductsTable() {
    const tbody = document.getElementById('admin-products-tbody');
    if (!tbody) return;

    const searchTerm = state.filters.productSearch ? state.filters.productSearch.toLowerCase() : '';
    const filteredProducts = state.dbProducts.filter(p => 
        (p.name && p.name.toLowerCase().includes(searchTerm)) || 
        (p.category && p.category.toLowerCase().includes(searchTerm))
    );

    tbody.innerHTML = filteredProducts.length ? filteredProducts.map((product) => `
        <tr class="product-row" data-product-id="${product._id || product.customId}">
            <td>
                <div class="avatar" style="border-radius: 8px;">
                    <img src="${product.images && product.images.length ? product.images[0] : '../../images/1.png'}" alt="Thumb" style="border-radius: 8px;">
                </div>
            </td>
            <td><strong>${product.name}</strong></td>
            <td>
                <span style="background:var(--admin-surface-soft); padding:4px 8px; border-radius:4px; font-size:12px; font-weight:700;">
                    ${product.category || 'Uncategorized'}
                </span>
            </td>
            <td><strong>${formatAdminPrice(product.price)}</strong></td>
            <td>
                <button class="row-action-btn edit-product-btn" type="button" aria-label="Edit product"><i class="fas fa-edit"></i></button>
                <button class="row-action-btn delete-product-btn" type="button" aria-label="Delete product" style="color:#d93025;"><i class="fas fa-trash-alt"></i></button>
            </td>
        </tr>
    `).join('') : `
        <tr>
            <td colspan="5"><div class="empty-state">No products found in the database.</div></td>
        </tr>
    `;
}

function renderCurrentView() {
    const view = state.view || 'dashboard';
    
    try {
        if (view === 'dashboard') {
            if (typeof renderDashboard === 'function') renderDashboard();
        } else if (view === 'orders') {
            if (typeof renderOrdersTable === 'function') renderOrdersTable();
        } else if (view === 'customers') {
            if (typeof renderCustomersTable === 'function') renderCustomersTable();
        } else if (view === 'products') {
            if (state.dbProducts.length === 0) {
                // Fetch first time
                fetchAdminProducts().then(() => renderProductsTable());
            } else {
                renderProductsTable();
            }
        } else if (view === 'reviews') {
            fetchAndRenderAdminReviews();
        }
    } catch (error) {
        console.error(`RENDER ERROR in view "${view}":`, error);
        
        // Show a visible error in the active section so the user isn't left in the dark
        const activeSection = document.querySelector(`[data-admin-view="${view}"]`);
        if (activeSection) {
            activeSection.innerHTML = `
                <div style="background: #fff5f5; border: 2px solid #feb2b2; padding: 30px; border-radius: 20px; margin: 20px; text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 20px;">⚠️</div>
                    <h3 style="color: #c53030; margin-bottom: 10px;">View Load Error</h3>
                    <p style="color: #742a2a; margin-bottom: 20px;">We encountered a problem loading your ${view} data.</p>
                    <button onclick="location.reload()" style="background: #c53030; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Refresh Page</button>
                    <pre style="margin-top: 20px; font-size: 11px; text-align: left; background: #f7fafc; padding: 10px; border-radius: 8px; overflow: auto;">${error.message}</pre>
                </div>
            `;
        }
    }
}

function setTopbarContent(viewName) {
    const title = document.getElementById('admin-topbar-title');
    const kicker = document.getElementById('admin-topbar-kicker');

    if (!title || !kicker) return;

    if (viewName === 'orders') {
        title.textContent = 'Orders';
        kicker.textContent = 'Operations';
        return;
    }

    if (viewName === 'customers') {
        title.textContent = 'Customers';
        kicker.textContent = 'Management';
        return;
    }

    if (viewName === 'products') {
        title.textContent = 'Products';
        kicker.textContent = 'Inventory';
        return;
    }

    if (viewName === 'reviews') {
        title.textContent = 'Reviews';
        kicker.textContent = 'Moderation';
        return;
    }

    title.textContent = 'Dashboard';
    kicker.textContent = 'Overview';
}

function setAdminView(viewName) {
    if (!viewName) viewName = 'dashboard';
    state.view = viewName;

    try {
        // Toggle view sections
        document.querySelectorAll('[data-admin-view]').forEach((view) => {
            const isActive = view.dataset.adminView === viewName;
            view.classList.toggle('is-active', isActive);
            
            // Helpful debug for visibility
            if (isActive) {
                view.style.display = 'block';
            } else {
                view.style.display = 'none';
            }
        });

        // Toggle sidebar links
        document.querySelectorAll('[data-admin-view-link]').forEach((link) => {
            link.classList.toggle('is-active', link.dataset.adminViewLink === viewName);
        });

        if (viewName !== 'customers') {
            closeCustomerDrawer();
        }

        setTopbarContent(viewName);
        renderCurrentView();
    } catch (error) {
        console.error(`CRITICAL: setAdminView("${viewName}") failed:`, error);
    }
}

function populateStatusFilter() {
    const statusFilter = document.getElementById('orders-filter-status');
    if (!statusFilter) return;

    statusFilter.innerHTML = [
        '<option value="all">Status</option>',
        ...ORDER_STATUS_OPTIONS.map((status) => `<option value="${status}">${status}</option>`)
    ].join('');
}

async function applyBulkStatusUpdate(nextStatus) {
    if (!state.selectedOrders.size) return;

    const updatePromises = state.orders
        .filter(order => state.selectedOrders.has(order._key))
        .map(order => updateOrderStatusViaAPI(order, nextStatus));

    await Promise.all(updatePromises);

    state.orders = state.orders.map((order) => {
        if (!state.selectedOrders.has(order._key)) return order;
        return { ...order, status: nextStatus };
    });

    state.customers = getCustomersFromOrders();
    renderCurrentView();
}

function handleTableInteractions(event) {
    const orderCheckbox = event.target.closest('.order-row-checkbox');
    const customerRow = event.target.closest('.customer-row');

    if (orderCheckbox) {
        const orderKey = orderCheckbox.dataset.orderKey;
        if (orderCheckbox.checked) {
            state.selectedOrders.add(orderKey);
        } else {
            state.selectedOrders.delete(orderKey);
        }
        renderOrdersTable();
        return;
    }

    if (customerRow && state.view === 'customers' && !event.target.closest('button') && !event.target.closest('select')) {
        state.activeCustomerEmail = customerRow.dataset.customerEmail;
        renderCustomerDrawer(state.activeCustomerEmail);
        return;
    }

    // Product Delete Interactions
    const deleteProductBtn = event.target.closest('.delete-product-btn');
    if (deleteProductBtn) {
        const productRow = event.target.closest('.product-row');
        if (productRow) {
            deleteBackendProduct(productRow.dataset.productId);
        }
        return;
    }

    // Product Edit Interactions
    const editProductBtn = event.target.closest('.edit-product-btn');
    if (editProductBtn) {
        const productRow = event.target.closest('.product-row');
        if (productRow) {
            const product = state.dbProducts.find(p => p._id === productRow.dataset.productId || p.customId === productRow.dataset.productId);
            if (product) {
                const newPrice = prompt(`Enter new price for ${product.name}:`, product.price);
                if (newPrice !== null && !isNaN(Number(newPrice))) {
                    fetch(`${API_BASE_URL}/products/${product._id || product.customId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ price: Number(newPrice) })
                    }).then(() => {
                        fetchAdminProducts().then(() => renderProductsTable());
                    }).catch(err => alert('Failed to update price.'));
                }
            }
        }
    }
}

async function handleTableChanges(event) {
    const statusSelect = event.target.closest('.admin-order-status');
    const customerStatusSelect = event.target.closest('.admin-customer-status');

    if (statusSelect) {
        await updateOrderStatusByKey(statusSelect.dataset.orderKey, statusSelect.value);
        return;
    }

    if (customerStatusSelect) {
        const customerEmail = customerStatusSelect.dataset.customerEmail;
        const customerOrders = state.orders.filter((order) => order.customerEmail === customerEmail);

        await Promise.all(
            customerOrders.map(order => updateOrderStatusViaAPI(order, customerStatusSelect.value))
        );

        state.orders = state.orders.map((order) => {
            if (order.customerEmail !== customerEmail) return order;
            return { ...order, status: customerStatusSelect.value };
        });

        state.customers = getCustomersFromOrders();
        renderCurrentView();
    }
}

function initializeControls() {
    const logoutButton = document.getElementById('admin-logout-btn');
    const ordersSearch = document.getElementById('orders-search');
    const customersSearch = document.getElementById('customers-search');
    const productsSearch = document.getElementById('products-search');
    const filterType = document.getElementById('orders-filter-type');
    const filterStatus = document.getElementById('orders-filter-status');
    const filterDate = document.getElementById('orders-filter-date');
    const selectAll = document.getElementById('orders-select-all');
    const drawerClose = document.getElementById('customer-drawer-close');
    const drawerBackdrop = document.getElementById('customer-drawer-backdrop');
    const drawerTrackBtn = document.getElementById('drawer-track-btn');
    const drawerRefundBtn = document.getElementById('drawer-refund-btn');

    document.querySelectorAll('[data-admin-view-link]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            setAdminView(link.dataset.adminViewLink);
        });
    });

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('isAdmin');
            window.location.href = 'admin-login.html';
        });
    }

    if (ordersSearch) {
        ordersSearch.addEventListener('input', (event) => {
            state.filters.search = event.target.value;
            renderOrdersTable();
        });
    }

    if (customersSearch) {
        customersSearch.addEventListener('input', (event) => {
            state.filters.customerSearch = event.target.value;
            renderCustomersTable();
        });
    }

    if (productsSearch) {
        productsSearch.addEventListener('input', (event) => {
            state.filters.productSearch = event.target.value;
            renderProductsTable();
        });
    }

    if (filterType) {
        filterType.addEventListener('change', (event) => {
            state.filters.type = event.target.value;
            renderOrdersTable();
        });
    }

    if (filterStatus) {
        filterStatus.addEventListener('change', (event) => {
            state.filters.status = event.target.value;
            renderOrdersTable();
        });
    }

    if (filterDate) {
        filterDate.addEventListener('change', (event) => {
            state.filters.date = event.target.value;
            renderOrdersTable();
        });
    }

    if (selectAll) {
        selectAll.addEventListener('change', (event) => {
            const filteredOrders = getFilteredOrders();
            if (event.target.checked) {
                filteredOrders.forEach((order) => state.selectedOrders.add(order._key));
            } else {
                filteredOrders.forEach((order) => state.selectedOrders.delete(order._key));
            }
            renderOrdersTable();
        });
    }

    document.addEventListener('click', (event) => {
        if (event.target.closest('[data-bulk-status]')) {
            applyBulkStatusUpdate(event.target.closest('[data-bulk-status]').dataset.bulkStatus);
            return;
        }

        handleTableInteractions(event);
    });

    document.addEventListener('change', handleTableChanges);

    if (drawerClose) drawerClose.addEventListener('click', closeCustomerDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeCustomerDrawer);
    if (drawerTrackBtn) {
        drawerTrackBtn.addEventListener('click', () => {
            if (!state.activeCustomerEmail) return;
            alert(`Tracking order flow for ${state.activeCustomerEmail}`);
        });
    }
    if (drawerRefundBtn) {
        drawerRefundBtn.addEventListener('click', () => {
            if (!state.activeCustomerEmail) return;
            alert(`Refund review started for ${state.activeCustomerEmail}`);
        });
    }
}

function getInitialViewFromURL() {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view === 'orders' || view === 'customers') {
        return view;
    }
    return 'dashboard';
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize UI Controls first (Event Listeners)
    try {
        initializeControls();
    } catch (error) {
        console.error('Failed to initialize controls:', error);
    }

    // 2. Load Data and Show View
    try {
        populateStatusFilter();
        hydrateAdminData();
        
        const initialView = getInitialViewFromURL();
        setAdminView(initialView);
    } catch (error) {
        console.error('Data hydration failure:', error);
        
        // Even if data fails, try to show the initial view
        try {
            const initialView = getInitialViewFromURL();
            setAdminView(initialView);
        } catch (innerError) {
            console.error('Fallthrough view failure:', innerError);
        }
    }
});

// ============================================================
// ADMIN REVIEWS MANAGEMENT
// ============================================================
let adminReviews = [];

async function fetchAndRenderAdminReviews() {
    const tbody = document.getElementById('admin-reviews-tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:#999;">Loading reviews...</td></tr>';

    try {
        // Ensure products are loaded so we can resolve product names
        if (!state.dbProducts || state.dbProducts.length === 0) {
            try {
                const prodRes = await fetch(`${API_BASE_URL}/products`);
                if (prodRes.ok) state.dbProducts = await prodRes.json();
            } catch (e) {
                console.error('Failed to load products for reviews mapping');
            }
        }

        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/reviews`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch reviews');
        adminReviews = await res.json();
        renderAdminReviewsTable();
    } catch (err) {
        console.error('Error fetching admin reviews:', err);
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:#c53030;">Failed to load reviews.</td></tr>';
    }
}

function renderAdminReviewsTable() {
    const tbody = document.getElementById('admin-reviews-tbody');
    if (!tbody) return;

    const searchInput = document.getElementById('reviews-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    const filtered = adminReviews.filter(r => {
        if (!searchTerm) return true;
        const author = r.author || (r.user ? `${r.user.firstName} ${r.user.lastName}` : '');
        const pMatch = state.dbProducts.find(p => p._id === r.productId || p.customId === r.productId);
        const pName = pMatch ? pMatch.name : r.productId;

        return author.toLowerCase().includes(searchTerm)
            || (pName || '').toLowerCase().includes(searchTerm)
            || (r.title || '').toLowerCase().includes(searchTerm)
            || (r.comment || '').toLowerCase().includes(searchTerm);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:#999;">No reviews found.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(r => {
        const firstName = r.user && r.user.firstName ? r.user.firstName : (r.author ? r.author.split(' ')[0] : 'Anon');
        const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '';
        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        const commentShort = r.comment && r.comment.length > 50 ? r.comment.substring(0, 50) + '...' : (r.comment || '');
        
        // Find product name
        const pMatch = state.dbProducts.find(p => String(p._id) === String(r.productId) || String(p.customId) === String(r.productId));
        const productName = pMatch ? pMatch.name : r.productId;

        // Escape JSON for modal
        const rJson = encodeURIComponent(JSON.stringify({
            title: r.title,
            comment: r.comment,
            rating: r.rating,
            author: firstName,
            productName: productName,
            date: dateStr
        }));

        return `
            <tr>
                <td style="font-weight:600;">${firstName}</td>
                <td style="font-size:13px;color:#555;">${productName}</td>
                <td style="color:#f4a11b;letter-spacing:1px;font-size:12px;">${stars}</td>
                <td style="font-size:13px;font-weight:500;">${r.title || ''}</td>
                <td style="font-size:13px;color:#666;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${commentShort}</td>
                <td style="font-size:12px;color:#999;">${dateStr}</td>
                <td>
                    <div style="display:flex;gap:6px;">
                        <button onclick="openAdminReviewModal('${rJson}')" style="background:#eee;color:#333;border:none;padding:5px 12px;border-radius:4px;font-size:12px;cursor:pointer;font-weight:600;">View</button>
                        <button onclick="deleteAdminReview('${r._id}')" style="background:#fff1f1;color:#c53030;border:1px solid #ffd4d4;padding:5px 12px;border-radius:4px;font-size:12px;cursor:pointer;font-weight:600;">Delete</button>
                    </div>
                </td>
            </tr>`;
    }).join('');
}

function openAdminReviewModal(encodedJson) {
    try {
        const data = JSON.parse(decodeURIComponent(encodedJson));
        document.getElementById('modal-review-title').textContent = data.title || 'Review';
        document.getElementById('modal-review-stars').textContent = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);
        document.getElementById('modal-review-comment').textContent = data.comment;
        document.getElementById('modal-review-author').textContent = data.author;
        document.getElementById('modal-review-product').textContent = data.productName;
        document.getElementById('modal-review-date').textContent = data.date;
        document.getElementById('admin-view-review-modal').style.display = 'flex';
    } catch (e) {
        console.error('Error opening review modal', e);
    }
}

async function deleteAdminReview(reviewId) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/reviews/delete/${reviewId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            fetchAndRenderAdminReviews();
        } else {
            const data = await res.json();
            alert(data.message || 'Failed to delete review.');
        }
    } catch (err) {
        console.error('Delete review error:', err);
        alert('Network error deleting review.');
    }
}

// Wire up reviews search
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('reviews-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => renderAdminReviewsTable());
    }
});
