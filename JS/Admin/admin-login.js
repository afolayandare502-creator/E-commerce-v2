const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5001/api/auth' 
    : 'https://e-commerce-backend-4rnw.onrender.com/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('admin-login-form');
    const emailInput = document.getElementById('admin-email');
    const passwordInput = document.getElementById('admin-password');
    const feedback = document.getElementById('admin-login-feedback');

    if (!form || !emailInput || !passwordInput || !feedback) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        feedback.textContent = 'Logging in...';
        feedback.style.color = '#333';

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok && data.token) {
                if (data.role !== 'admin') {
                    feedback.textContent = 'Access Denied. You are not an administrator.';
                    feedback.style.color = 'red';
                    return;
                }
                
                localStorage.setItem('token', data.token);
                localStorage.setItem('isAdmin', 'true');
                window.location.href = 'admin.html';
            } else {
                localStorage.removeItem('isAdmin');
                feedback.textContent = data.message || 'Invalid admin credentials.';
                feedback.style.color = 'red';
            }
        } catch (error) {
            console.error('Login error', error);
            feedback.textContent = 'Network error fetching backend.';
            feedback.style.color = 'red';
        }
    });
});
