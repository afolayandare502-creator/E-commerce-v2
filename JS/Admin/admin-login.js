const ADMIN_EMAIL = 'admin@dare.com';
const ADMIN_PASSWORD = 'Afolayan123@@';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('admin-login-form');
    const emailInput = document.getElementById('admin-email');
    const passwordInput = document.getElementById('admin-password');
    const feedback = document.getElementById('admin-login-feedback');

    if (!form || !emailInput || !passwordInput || !feedback) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            localStorage.setItem('isAdmin', 'true');
            window.location.href = 'admin.html';
            return;
        }

        localStorage.removeItem('isAdmin');
        feedback.textContent = 'Invalid admin credentials.';
    });
});
