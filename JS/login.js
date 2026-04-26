function getLoginCartItems() {
    return typeof getCurrentUserCart === 'function' ? getCurrentUserCart() : [];
}

function updateLoginCartCount() {
    const total = getLoginCartItems().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const cartCount = document.getElementById('login-cart-count');
    if (cartCount) {
        cartCount.textContent = total;
    }
}

function initializeLoginForm() {
    // Check if we just returned from Google OAuth with a token
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
        localStorage.setItem('token', urlToken);
        
        // Also ensure UI state is correctly marked as logged in
        // A minimal profile allows the navbar to display properly
        const urlEmail = urlParams.get('email');
        const urlName = urlParams.get('name');
        if (urlEmail && typeof setCurrentUser === 'function') {
            setCurrentUser(urlEmail);
            localStorage.setItem('loginIdentifier', urlEmail);
            if (urlName && typeof saveCurrentUserProfile === 'function') {
                saveCurrentUserProfile({ firstName: urlName, email: urlEmail });
            }
        }

        // Clean up URL to hide token
        window.history.replaceState({}, document.title, window.location.pathname);
        // Give a tiny delay before redirecting
        setTimeout(() => {
            const redirectURL = localStorage.getItem('redirectUrlAfterLogin');
            window.location.href = redirectURL ? redirectURL : '../index.html';
        }, 500);
    }

    const loginSection = document.getElementById('login-section');
    const registrationSection = document.getElementById('registration-section');
    const otpSection = document.getElementById('otp-section');

    const loginForm = document.getElementById('login-form');
    const registrationForm = document.getElementById('registration-form');
    const otpForm = document.getElementById('otp-form');

    const createAccountBtn = document.getElementById('create-account-btn');
    const backToLoginBtn = document.getElementById('back-to-login-btn');
    const changeEmailBtn = document.getElementById('change-email-btn');
    const resendCodeBtn = document.getElementById('resend-code-btn');

    const feedback = document.getElementById('login-feedback');
    const regFeedback = document.getElementById('reg-feedback');
    const otpFeedback = document.getElementById('otp-feedback');

    const emailInput = document.getElementById('login-identifier');
    const regEmailInput = document.getElementById('reg-email');
    const otpInput = document.getElementById('otp-code');
    const otpEmailDisplay = document.getElementById('otp-email-display');

    let currentAuthEmail = '';

    const showRegistrationSection = () => {
        if (!loginSection || !registrationSection || !otpSection) return;
        loginSection.style.display = 'none';
        otpSection.style.display = 'none';
        registrationSection.style.display = 'block';
        window.scrollTo(0, 0);
    };

    const showLoginSection = () => {
        if (!loginSection || !registrationSection || !otpSection) return;
        registrationSection.style.display = 'none';
        otpSection.style.display = 'none';
        loginSection.style.display = 'block';
        window.scrollTo(0, 0);
    };

    const showOtpSection = (email) => {
        currentAuthEmail = email;
        if (otpEmailDisplay) otpEmailDisplay.textContent = email;
        if (!loginSection || !registrationSection || !otpSection) return;
        loginSection.style.display = 'none';
        registrationSection.style.display = 'none';
        otpSection.style.display = 'block';
        window.scrollTo(0, 0);
    };

    if (createAccountBtn) {
        createAccountBtn.onclick = (e) => {
            e.preventDefault();
            const email = emailInput ? emailInput.value.trim() : '';
            if (regEmailInput) regEmailInput.value = email;
            showRegistrationSection();
        };
    }

    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginSection();
        });
    }

    if (changeEmailBtn) {
        changeEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginSection();
        });
    }

    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5001/api/auth' 
        : 'https://e-commerce-backend-4rnw.onrender.com/api/auth';

    const loginPasswordInput = document.getElementById('login-password');
    const togglePassword = document.getElementById('togglePassword');
    const regPasswordInput = document.getElementById('reg-password');
    const toggleRegPassword = document.getElementById('toggleRegPassword');

    [ {toggle: togglePassword, input: loginPasswordInput}, {toggle: toggleRegPassword, input: regPasswordInput} ].forEach(item => {
        if (item.toggle && item.input) {
            item.toggle.addEventListener('click', () => {
                const type = item.input.getAttribute('type') === 'password' ? 'text' : 'password';
                item.input.setAttribute('type', type);
                item.toggle.classList.toggle('fa-eye');
                item.toggle.classList.toggle('fa-eye-slash');
            });
        }
    });

    const requestOtp = async (email, firstName = '', lastName = '', password = '', isResend = false) => {
        const activeFeedback = isResend ? otpFeedback : (firstName ? regFeedback : feedback);
        
        if (!email) {
            activeFeedback.hidden = false;
            activeFeedback.textContent = 'Please enter an email address.';
            activeFeedback.style.color = 'red';
            return false;
        }

        try {
            const res = await fetch(`${API_URL}/request-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, firstName, lastName, password })
            });
            const data = await res.json();

            if (res.ok) {
                if (isResend) {
                    activeFeedback.hidden = false;
                    activeFeedback.style.color = '#0d9b5d';
                    activeFeedback.textContent = 'A new code has been sent.';
                }
                return true;
            } else {
                activeFeedback.hidden = false;
                activeFeedback.style.color = 'red';
                activeFeedback.textContent = data.message || 'Failed to send code.';
                return false;
            }
        } catch (error) {
            activeFeedback.hidden = false;
            activeFeedback.style.color = 'red';
            activeFeedback.textContent = 'Network error. Please try again.';
            console.error(error);
            return false;
        }
    };

    if (loginForm) {
        loginForm.addEventListener('submit', async event => {
            event.preventDefault();
            const email = emailInput.value.trim();
            const password = loginPasswordInput ? loginPasswordInput.value.trim() : '';

            if (!email || !password) {
                feedback.hidden = false;
                feedback.textContent = 'Please enter both email and password.';
                feedback.style.color = 'red';
                return;
            }

            try {
                const res = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();

                if (res.ok && data.token) {
                    localStorage.setItem('token', data.token);
                    if (typeof setCurrentUser === 'function') setCurrentUser(data.email);
                    localStorage.setItem('loginIdentifier', data.email);
                    if (typeof saveCurrentUserProfile === 'function') {
                        saveCurrentUserProfile({ firstName: data.firstName, lastName: data.lastName, email: data.email });
                    }
                    
                    if (typeof mergeGuestDataIntoUser === 'function') mergeGuestDataIntoUser();

                    feedback.hidden = false;
                    feedback.style.color = '#0d9b5d';
                    feedback.textContent = `Signed in successfully.`;

                    const redirectURL = localStorage.getItem('redirectUrlAfterLogin');
                    setTimeout(() => {
                        window.location.href = redirectURL ? redirectURL : '../index.html';
                        localStorage.removeItem('redirectUrlAfterLogin');
                    }, 1000);
                } else {
                    feedback.hidden = false;
                    feedback.style.color = 'red';
                    feedback.textContent = data.message || 'Invalid email or password';
                }
            } catch (error) {
                feedback.hidden = false;
                feedback.style.color = 'red';
                feedback.textContent = 'Network error. Please try again later.';
                console.error(error);
            }
        });
    }

    let savedRegPassword = '';

    if (registrationForm) {
        registrationForm.addEventListener('submit', async event => {
            event.preventDefault();
            const email = regEmailInput.value.trim();
            const firstName = document.getElementById('reg-first-name').value.trim();
            const lastName = document.getElementById('reg-last-name').value.trim();
            const password = regPasswordInput ? regPasswordInput.value.trim() : '';
            
            savedRegPassword = password; // Save for resend if needed

            const success = await requestOtp(email, firstName, lastName, password);
            if (success) {
                showOtpSection(email);
            }
        });
    }

    if (resendCodeBtn) {
        resendCodeBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await requestOtp(currentAuthEmail, '', '', true);
        });
    }

    if (otpForm) {
        otpForm.addEventListener('submit', async event => {
            event.preventDefault();
            const otpCode = otpInput.value.trim();
            
            if (!otpCode || otpCode.length !== 6) {
                otpFeedback.hidden = false;
                otpFeedback.style.color = 'red';
                otpFeedback.textContent = 'Please enter a valid 6-digit code.';
                return;
            }

            try {
                const res = await fetch(`${API_URL}/verify-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: currentAuthEmail, otp: otpCode })
                });
                const data = await res.json();

                if (res.ok && data.token) {
                    localStorage.setItem('token', data.token);
                    if (typeof setCurrentUser === 'function') setCurrentUser(data.email);
                    localStorage.setItem('loginIdentifier', data.email);
                    if (typeof saveCurrentUserProfile === 'function') {
                        saveCurrentUserProfile({ firstName: data.firstName, lastName: data.lastName, email: data.email });
                    }
                    
                    if (typeof mergeGuestDataIntoUser === 'function') mergeGuestDataIntoUser();

                    otpFeedback.hidden = false;
                    otpFeedback.style.color = '#0d9b5d';
                    otpFeedback.textContent = 'Verified! Signing you in...';

                    const redirectURL = localStorage.getItem('redirectUrlAfterLogin');
                    setTimeout(() => {
                        if (redirectURL) {
                            localStorage.removeItem('redirectUrlAfterLogin');
                            window.location.href = redirectURL;
                        } else {
                            window.location.href = '../index.html';
                        }
                    }, 1000);
                } else {
                    otpFeedback.hidden = false;
                    otpFeedback.style.color = 'red';
                    otpFeedback.textContent = data.message || 'Invalid or expired code.';
                }
            } catch (error) {
                otpFeedback.hidden = false;
                otpFeedback.style.color = 'red';
                otpFeedback.textContent = 'Network error. Please try again.';
                console.error(error);
            }
        });
    }

    // Social Login Handlers
    const googleBtn = document.querySelector('.google-login-btn');
    const appleBtn = document.querySelector('.apple-login-btn');

    if (googleBtn) {
        const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:5001'
            : 'https://e-commerce-backend-4rnw.onrender.com';
        googleBtn.addEventListener('click', () => {
            window.location.href = `${BACKEND_URL}/api/auth/google`;
        });
    }

    if (appleBtn) {
        appleBtn.addEventListener('click', () => {
            alert('Apple authentication is not fully implemented on backend yet.');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateLoginCartCount();
    initializeLoginForm();
});
