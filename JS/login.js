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
    const loginSection = document.getElementById('login-section');
    const registrationSection = document.getElementById('registration-section');
    const loginForm = document.getElementById('login-form');
    const registrationForm = document.getElementById('registration-form');
    const createAccountBtn = document.getElementById('create-account-btn');
    const editEmailBtn = null; // EDIT button removed from UI
    const feedback = document.getElementById('login-feedback');
    const regFeedback = document.getElementById('reg-feedback');
    const emailInput = document.getElementById('login-identifier');
    const passwordInput = document.getElementById('login-password');
    const togglePassword = document.getElementById('togglePassword');
    const toggleRegPassword = document.getElementById('toggleRegPassword');
    const regEmailDisplay = document.getElementById('reg-email-display');

    const regEmailInput = document.getElementById('reg-email');

    const showRegistrationSection = () => {
        if (!loginSection || !registrationSection) return;
        loginSection.style.display = 'none';
        registrationSection.style.display = 'block';
        window.scrollTo(0, 0);
    };

    // Toggle Password Visibility
    [ {toggle: togglePassword, input: passwordInput}, {toggle: toggleRegPassword, input: document.getElementById('reg-password')} ].forEach(item => {
        if (item.toggle && item.input) {
            item.toggle.addEventListener('click', () => {
                const type = item.input.getAttribute('type') === 'password' ? 'text' : 'password';
                item.input.setAttribute('type', type);
                item.toggle.classList.toggle('fa-eye');
                item.toggle.classList.toggle('fa-eye-slash');
            });
        }
    });

    // Switch to Registration
    console.log('Login section element:', loginSection);
    console.log('Registration section element:', registrationSection);
    console.log('Create account button element:', createAccountBtn);

    if (createAccountBtn && loginSection && registrationSection) {
        createAccountBtn.onclick = (e) => {
            e.preventDefault();
            console.log('Create account button clicked - switching forms');
            const email = emailInput ? emailInput.value.trim() : '';
            
            if (regEmailInput) {
                regEmailInput.value = email;
            }
            
            showRegistrationSection();
            console.log('Styles updated: login hidden, registration visible');
        };
    } else {
        console.error('Missing elements for switching to registration:', {
            btn: !!createAccountBtn,
            login: !!loginSection,
            reg: !!registrationSection
        });
    }

    // Switch back to Login from registration section
    const backToLoginBtn = document.getElementById('back-to-login-btn');
    if (backToLoginBtn && loginSection && registrationSection) {
        backToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registrationSection.style.display = 'none';
            loginSection.style.display = 'block';
            window.scrollTo(0, 0);
        });
    }

    const newsletterSignupEmail = new URLSearchParams(window.location.search).get('signupEmail');
    if (newsletterSignupEmail) {
        const trimmedEmail = newsletterSignupEmail.trim();
        if (emailInput) {
            emailInput.value = trimmedEmail;
        }
        if (regEmailInput) {
            regEmailInput.value = trimmedEmail;
        }
        showRegistrationSection();
    }

    // Populate Date of Birth Selects
    const populateDOB = () => {
        const daySelect = document.querySelector('select[name="dob-day"]');
        const monthSelect = document.querySelector('select[name="dob-month"]');

        if (!daySelect || !monthSelect) return;

        for (let i = 1; i <= 31; i++) {
            daySelect.add(new Option(i, i));
        }

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        months.forEach((month, index) => {
            monthSelect.add(new Option(month, index + 1));
        });

        const currentYear = new Date().getFullYear();
        // Year is now an <input type="number">, no need to populate
    };
    populateDOB();

    if (!loginForm || !feedback || !emailInput) return;

    // Login Form Submission
    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput ? passwordInput.value.trim() : '';
        
        if (!email || !password) {
            feedback.hidden = false;
            feedback.textContent = 'Please enter both email and password.';
            feedback.style.color = 'red';
            return;
        }

        const normalizedEmail = setCurrentUser(email);
        localStorage.setItem('loginIdentifier', email);
        
        // Register user globally if profile exists
        const profile = getCurrentUserProfile();
        if (profile) registerGlobalUser(profile);
        
        mergeGuestDataIntoUser();

        const redirectURL = localStorage.getItem(REDIRECT_URL_STORAGE_KEY);
        feedback.hidden = false;
        feedback.style.color = '#0d9b5d';
        feedback.textContent = `Signed in as ${normalizedEmail}.`;

        setTimeout(() => {
            if (redirectURL) {
                localStorage.removeItem(REDIRECT_URL_STORAGE_KEY);
                window.location.href = redirectURL;
            } else {
                window.location.href = '../index.html';
            }
        }, 1000);
    });

    // Registration Form Submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', event => {
            event.preventDefault();
            const email = regEmailInput ? regEmailInput.value.trim() : '';
            const firstName = document.getElementById('reg-first-name').value.trim();
            const password = document.getElementById('reg-password').value.trim();

            if (password.length < 10) {
                regFeedback.hidden = false;
                regFeedback.textContent = 'Password must be at least 10 characters long.';
                regFeedback.style.color = 'red';
                return;
            }

            const normalizedEmail = setCurrentUser(email);
            localStorage.setItem('loginIdentifier', email);
            const profile = {
                firstName,
                lastName: document.getElementById('reg-last-name').value.trim(),
                email: normalizedEmail
            };
            saveCurrentUserProfile(profile);
            registerGlobalUser(profile); // Sync to global list for Admin
            mergeGuestDataIntoUser();

            regFeedback.hidden = false;
            regFeedback.style.color = '#0d9b5d';
            regFeedback.textContent = `Account created! Welcome, ${firstName}.`;

            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        });
    }

    // Social Login Handlers
    const googleBtn = document.querySelector('.google-login-btn');
    const appleBtn = document.querySelector('.apple-login-btn');

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            console.log('Google login initiated');
        });
    }

    if (appleBtn) {
        appleBtn.addEventListener('click', () => {
            console.log('iCloud/Apple login initiated');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateLoginCartCount();
    initializeLoginForm();
});
