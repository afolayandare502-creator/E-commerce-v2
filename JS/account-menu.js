function escapeAccountMenuHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function buildSignedInAccountMenu() {
    const displayName = typeof getCurrentUserDisplayName === 'function'
        ? getCurrentUserDisplayName()
        : '';

    return `
        <div class="login-dropdown-welcome">Hi, ${escapeAccountMenuHtml(displayName || 'there')}</div>
        <div class="login-dropdown-links">
            <a href="my-account.html" class="dropdown-link dropdown-link-featured">
                <i class="far fa-user-circle"></i>
                <span>My Account</span>
            </a>
            <a href="my-orders.html" class="dropdown-link dropdown-link-featured">
                <i class="far fa-shopping-bag"></i>
                <span>My Orders</span>
            </a>
        </div>
        <a href="../index.html" class="account-sign-out-link" data-sign-out>Sign Out</a>
    `;
}

function initializeAccountMenu() {
    const loginMenus = document.querySelectorAll('.login-menu');
    if (!loginMenus.length || typeof getCurrentUser !== 'function') return;

    const currentUser = getCurrentUser();

    loginMenus.forEach((menu) => {
        const userIconLink = menu.querySelector('.user-icon');
        const dropdown = menu.querySelector('.login-dropdown');

        if (!userIconLink || !dropdown) return;

        if (!currentUser) {
            userIconLink.setAttribute('href', 'login.html');
            return;
        }

        userIconLink.setAttribute('href', 'my-account.html');
        dropdown.innerHTML = buildSignedInAccountMenu();
    });

    document.querySelectorAll('[data-sign-out]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            if (typeof clearCurrentUserSession === 'function') {
                clearCurrentUserSession();
            }

            window.location.href = '../index.html';
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeAccountMenu);
