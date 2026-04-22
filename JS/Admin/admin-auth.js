// Admin Authentication Guard
(function() {
    // 1. Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
        // No token = not logged in
        window.location.href = '../login.html';
        return;
    }

    try {
        // 2. Decode the JWT payload (Base64 URL encoded)
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));

        // 3. Check if user is strictly an admin
        if (decodedPayload.role !== 'admin') {
            alert('Access Denied: You do not have administrator privileges.');
            window.location.href = '../../index.html'; // Kick them back to the shop
        }
        
        // If they pass, the page will continue to load normally!
    } catch (e) {
        console.error('Invalid token structure', e);
        // Token is malformed, kick them out
        localStorage.removeItem('token');
        window.location.href = '../login.html';
    }
})();
