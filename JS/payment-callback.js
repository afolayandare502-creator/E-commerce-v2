(async function() {
    const API_URL = 'http://localhost:5001/api';

    const spinner = document.getElementById('loading-spinner');
    const title = document.getElementById('status-title');
    const message = document.getElementById('status-message');
    const errorBox = document.getElementById('error-box');
    const errorAction = document.getElementById('error-action');

    // Extract the ?reference= parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');

    console.log('[Payment Callback] Reference from URL:', reference);

    if (!reference) {
        showError('No payment reference found. This page should only be accessed after a Paystack checkout.');
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        showError('You are not logged in. Please log in and try again.');
        return;
    }

    try {
        console.log('[Payment Callback] Calling verify endpoint...');
        const response = await fetch(`${API_URL}/paystack/verify/${reference}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log('[Payment Callback] Backend response status:', response.status);
        console.log('[Payment Callback] Backend response data:', data);

        if (data.success) {
            // Payment verified successfully
            spinner.style.display = 'none';
            title.textContent = 'Payment Successful!';
            title.style.color = '#1a7f37';
            message.textContent = 'Your payment has been verified and your order is now marked as paid. Redirecting to your orders...';

            // Clear the cart since payment is complete
            if (typeof clearCurrentUserCart === 'function') {
                clearCurrentUserCart();
            }

            setTimeout(() => {
                window.location.href = 'my-orders.html';
            }, 2500);
        } else {
            showError(data.message || 'Payment verification failed. Please contact support.');
        }
    } catch (error) {
        console.error('[Payment Callback] Verification error:', error);
        showError('Could not connect to the server. Please check your internet and try again.');
    }

    function showError(msg) {
        spinner.style.display = 'none';
        title.textContent = 'Payment Verification Failed';
        title.style.color = '#d93025';
        message.textContent = '';
        errorBox.style.display = 'block';
        errorBox.textContent = msg;
        errorAction.style.display = 'inline-block';
    }
})();
