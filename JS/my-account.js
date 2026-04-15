document.addEventListener('DOMContentLoaded', () => {
    if (typeof getCurrentUser !== 'function') return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    let profile = typeof getCurrentUserProfile === 'function'
        ? (getCurrentUserProfile() || {})
        : {};

    const displayName = typeof getCurrentUserDisplayName === 'function'
        ? getCurrentUserDisplayName()
        : currentUser;

    const greeting = document.getElementById('account-greeting');
    if (greeting) {
        greeting.textContent = displayName;
    }

    const avatar = document.getElementById('account-avatar');
    if (avatar) {
        const initials = displayName
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0))
            .join('')
            .toUpperCase();

        avatar.textContent = initials || 'U';
    }

    const viewTriggers = document.querySelectorAll('[data-account-view-trigger]');
    const views = document.querySelectorAll('[data-account-view]');

    const setActiveView = (viewName) => {
        viewTriggers.forEach((trigger) => {
            trigger.classList.toggle('active', trigger.dataset.accountViewTrigger === viewName);
        });

        views.forEach((view) => {
            const isActive = view.dataset.accountView === viewName;
            view.hidden = !isActive;
            view.classList.toggle('is-active', isActive);
        });

        const accountLayout = document.querySelector('.account-layout');
        if (accountLayout) {
            accountLayout.classList.add('view-active');
            
            // Inject mobile back button once if it doesn't exist
            const contentArea = document.querySelector('.account-content');
            if (contentArea && !document.querySelector('.mobile-account-back')) {
                const backBtn = document.createElement('button');
                backBtn.className = 'mobile-account-back';
                backBtn.innerHTML = '<i class="fal fa-chevron-left"></i> My Account';
                backBtn.addEventListener('click', () => {
                    accountLayout.classList.remove('view-active');
                });
                contentArea.insertBefore(backBtn, contentArea.firstChild);
            }
        }
    };

    viewTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            setActiveView(trigger.dataset.accountViewTrigger);
        });
    });

    const daySelect = document.getElementById('account-dob-day');
    const monthSelect = document.getElementById('account-dob-month');
    const yearSelect = document.getElementById('account-dob-year');

    const populateDob = () => {
        if (!daySelect || !monthSelect || !yearSelect) return;

        const dayOptions = ['<option value="">Day</option>'];
        for (let day = 1; day <= 31; day += 1) {
            dayOptions.push(`<option value="${day}">${String(day).padStart(2, '0')}</option>`);
        }
        daySelect.innerHTML = dayOptions.join('');

        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        monthSelect.innerHTML = ['<option value="">Month</option>']
            .concat(months.map((month, index) => `<option value="${index + 1}">${month}</option>`))
            .join('');

        const currentYearValue = new Date().getFullYear();
        const yearOptions = ['<option value="">Year</option>'];
        for (let year = currentYearValue; year >= currentYearValue - 100; year -= 1) {
            yearOptions.push(`<option value="${year}">${year}</option>`);
        }
        yearSelect.innerHTML = yearOptions.join('');
    };

    populateDob();

    const firstNameInput = document.getElementById('account-first-name');
    const lastNameInput = document.getElementById('account-last-name');
    const emailInput = document.getElementById('account-email');
    const detailsForm = document.getElementById('account-details-form');
    const feedback = document.getElementById('account-details-feedback');
    const addressFirstNameInput = document.getElementById('account-address-first-name');
    const addressLastNameInput = document.getElementById('account-address-last-name');
    const addressMobileInput = document.getElementById('account-address-mobile');
    const addressCountryInput = document.getElementById('account-address-country');
    const addressForm = document.getElementById('account-address-form');
    const addressFeedback = document.getElementById('account-address-feedback');
    const paymentEmptyState = document.getElementById('account-payment-empty');
    const paymentReadyState = document.getElementById('account-payment-ready');
    const paymentReadyCopy = document.getElementById('account-payment-ready-copy');
    const paymentAddressCta = document.getElementById('account-payment-address-cta');
    const contactForm = document.getElementById('account-contact-form');
    const contactClearButton = document.getElementById('account-contact-clear');
    const contactFeedback = document.getElementById('account-contact-feedback');
    const socialButtons = document.querySelectorAll('[data-social-provider]');
    const socialFeedback = document.getElementById('account-social-feedback');

    if (firstNameInput) firstNameInput.value = profile.firstName || '';
    if (lastNameInput) lastNameInput.value = profile.lastName || '';
    if (emailInput) emailInput.value = profile.email || currentUser;
    if (daySelect) daySelect.value = profile.dobDay || '';
    if (monthSelect) monthSelect.value = profile.dobMonth || '';
    if (yearSelect) yearSelect.value = profile.dobYear || '';

    const interestValue = profile.interest || 'Womenswear';
    const selectedInterest = document.querySelector(`input[name="interest"][value="${interestValue}"]`);
    if (selectedInterest) {
        selectedInterest.checked = true;
    }

    if (addressFirstNameInput) addressFirstNameInput.value = profile.addressFirstName || profile.firstName || '';
    if (addressLastNameInput) addressLastNameInput.value = profile.addressLastName || profile.lastName || '';
    if (addressMobileInput) addressMobileInput.value = profile.mobile || '';
    if (addressCountryInput) addressCountryInput.value = profile.country || '';
    const contactStockEmail = document.getElementById('contact-stock-email');
    const contactDiscountsEmail = document.getElementById('contact-discounts-email');
    const contactDiscountsText = document.getElementById('contact-discounts-text');

    if (contactStockEmail) contactStockEmail.checked = Boolean(profile.contactStockEmail);
    if (contactDiscountsEmail) contactDiscountsEmail.checked = Boolean(profile.contactDiscountsEmail);
    if (contactDiscountsText) contactDiscountsText.checked = Boolean(profile.contactDiscountsText);

    if (detailsForm) {
        detailsForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const updatedProfile = {
                ...profile,
                firstName: firstNameInput ? firstNameInput.value.trim() : '',
                lastName: lastNameInput ? lastNameInput.value.trim() : '',
                email: emailInput ? emailInput.value.trim().toLowerCase() : currentUser,
                dobDay: daySelect ? daySelect.value : '',
                dobMonth: monthSelect ? monthSelect.value : '',
                dobYear: yearSelect ? yearSelect.value : '',
                interest: (document.querySelector('input[name="interest"]:checked') || {}).value || 'Womenswear'
            };

            if (!updatedProfile.firstName || !updatedProfile.lastName || !updatedProfile.email) {
                if (feedback) {
                    feedback.hidden = false;
                    feedback.style.color = 'red';
                    feedback.textContent = 'Please fill in your first name, last name, and email.';
                }
                return;
            }

            if (typeof saveCurrentUserProfile === 'function') {
                saveCurrentUserProfile(updatedProfile);
            }
            profile = updatedProfile;

            if (greeting) {
                greeting.textContent = `${updatedProfile.firstName} ${updatedProfile.lastName}`.trim();
            }

            if (avatar) {
                const initials = `${updatedProfile.firstName} ${updatedProfile.lastName}`
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part.charAt(0))
                    .join('')
                    .toUpperCase();
                avatar.textContent = initials || 'U';
            }

            if (feedback) {
                feedback.hidden = false;
                feedback.style.color = '#0d9b5d';
                feedback.textContent = 'Your details have been saved.';
            }
        });
    }

    if (addressForm) {
        addressForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const updatedProfile = {
                ...profile,
                addressFirstName: addressFirstNameInput ? addressFirstNameInput.value.trim() : '',
                addressLastName: addressLastNameInput ? addressLastNameInput.value.trim() : '',
                mobile: addressMobileInput ? addressMobileInput.value.trim() : '',
                country: addressCountryInput ? addressCountryInput.value : ''
            };

            if (!updatedProfile.addressFirstName || !updatedProfile.addressLastName || !updatedProfile.country) {
                if (addressFeedback) {
                    addressFeedback.hidden = false;
                    addressFeedback.style.color = 'red';
                    addressFeedback.textContent = 'Please complete first name, last name, and country.';
                }
                return;
            }

            if (typeof saveCurrentUserProfile === 'function') {
                saveCurrentUserProfile(updatedProfile);
            }
            profile = updatedProfile;

            if (addressFeedback) {
                addressFeedback.hidden = false;
                addressFeedback.style.color = '#0d9b5d';
                addressFeedback.textContent = 'Your address book details have been saved.';
            }

            if (paymentEmptyState && paymentReadyState) {
                paymentEmptyState.hidden = true;
                paymentReadyState.hidden = false;
            }

            if (paymentReadyCopy) {
                paymentReadyCopy.textContent = `${updatedProfile.addressFirstName} ${updatedProfile.addressLastName}, ${updatedProfile.country}${updatedProfile.mobile ? `, ${updatedProfile.mobile}` : ''}`;
            }
        });
    }

    if (paymentAddressCta) {
        paymentAddressCta.addEventListener('click', () => {
            setActiveView('address');
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const updatedProfile = {
                ...profile,
                contactStockEmail: Boolean(contactStockEmail && contactStockEmail.checked),
                contactDiscountsEmail: Boolean(contactDiscountsEmail && contactDiscountsEmail.checked),
                contactDiscountsText: Boolean(contactDiscountsText && contactDiscountsText.checked)
            };

            if (typeof saveCurrentUserProfile === 'function') {
                saveCurrentUserProfile(updatedProfile);
            }
            profile = updatedProfile;

            if (contactFeedback) {
                contactFeedback.hidden = false;
                contactFeedback.style.color = '#0d9b5d';
                contactFeedback.textContent = 'Your contact preferences have been updated.';
            }
        });
    }

    if (contactClearButton) {
        contactClearButton.addEventListener('click', () => {
            if (contactStockEmail) contactStockEmail.checked = false;
            if (contactDiscountsEmail) contactDiscountsEmail.checked = false;
            if (contactDiscountsText) contactDiscountsText.checked = false;

            if (contactFeedback) {
                contactFeedback.hidden = false;
                contactFeedback.style.color = '#666';
                contactFeedback.textContent = 'Selections cleared. Confirm preferences to save your changes.';
            }
        });
    }

    const socialProviders = {
        google: Boolean(profile.socialGoogleConnected ?? true),
        apple: Boolean(profile.socialAppleConnected),
        facebook: Boolean(profile.socialFacebookConnected)
    };

    const renderSocialState = () => {
        socialButtons.forEach((button) => {
            const provider = button.dataset.socialProvider;
            const isConnected = Boolean(socialProviders[provider]);
            button.classList.toggle('is-connected', isConnected);
            button.textContent = isConnected ? 'Disconnect' : 'Not connected';
        });
    };

    renderSocialState();

    socialButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const provider = button.dataset.socialProvider;
            socialProviders[provider] = !socialProviders[provider];

            const updatedProfile = {
                ...profile,
                socialGoogleConnected: socialProviders.google,
                socialAppleConnected: socialProviders.apple,
                socialFacebookConnected: socialProviders.facebook
            };

            if (typeof saveCurrentUserProfile === 'function') {
                saveCurrentUserProfile(updatedProfile);
            }
            profile = updatedProfile;

            renderSocialState();

            if (socialFeedback) {
                socialFeedback.hidden = false;
                socialFeedback.style.color = '#0d9b5d';
                socialFeedback.textContent = `${provider.charAt(0).toUpperCase() + provider.slice(1)} connection updated.`;
            }
        });
    });

    const hasBillingAddress = Boolean(profile.addressFirstName && profile.addressLastName && profile.country);
    if (paymentEmptyState && paymentReadyState) {
        paymentEmptyState.hidden = hasBillingAddress;
        paymentReadyState.hidden = !hasBillingAddress;
    }

    if (hasBillingAddress && paymentReadyCopy) {
        paymentReadyCopy.textContent = `${profile.addressFirstName} ${profile.addressLastName}, ${profile.country}${profile.mobile ? `, ${profile.mobile}` : ''}`;
    }

    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach((item) => {
        const trigger = item.querySelector('.accordion-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => {
                const isOpen = item.classList.contains('is-open');
                
                // Close other items
                accordionItems.forEach((otherItem) => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('is-open');
                        const otherTrigger = otherItem.querySelector('.accordion-trigger i');
                        if (otherTrigger) {
                            otherTrigger.classList.replace('fa-minus', 'fa-plus');
                        }
                    }
                });

                // Toggle current item
                item.classList.toggle('is-open');
                const icon = trigger.querySelector('i');
                if (icon) {
                    if (!isOpen) {
                        icon.classList.replace('fa-plus', 'fa-minus');
                    } else {
                        icon.classList.replace('fa-minus', 'fa-plus');
                    }
                }
            });
        }
    });

    setActiveView('orders');
    if (window.innerWidth <= 860) {
        const layout = document.querySelector('.account-layout');
        if (layout) layout.classList.remove('view-active');
    }

    const orders = typeof getCurrentUserOrders === 'function'
        ? getCurrentUserOrders()
        : [];

    const ordersList = document.getElementById('account-orders-list');
    const emptyState = document.getElementById('account-orders-empty');

    if (ordersList && emptyState) {
        if (!orders.length) {
            emptyState.hidden = false;
            ordersList.hidden = true;
        } else {
            emptyState.hidden = true;
            ordersList.hidden = false;
            ordersList.innerHTML = orders.map((order) => {
                const quantity = Number(order.quantity) || 1;
                const price = `$${Number(order.price || 0).toFixed(2)}`;
                const placedAt = order.placedAt
                    ? new Date(order.placedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })
                    : 'Recently placed';

                return `
                    <article class="account-order-card">
                        <div class="account-order-top">
                            <div>
                                <h3>${order.name || 'Order item'}</h3>
                                <p>Placed on ${placedAt}</p>
                            </div>
                            <span class="account-order-status">Order placed</span>
                        </div>
                        <div class="account-order-meta">
                            <p>Price: ${price}</p>
                            <p>Quantity: ${quantity}</p>
                            <p>Size: ${order.size || 'N/A'}</p>
                            <p>Payment: ${order.paymentMethod || 'Cash On Delivery'}</p>
                        </div>
                    </article>
                `;
            }).join('');
        }
    }

    const signOutButton = document.getElementById('account-signout-button');
    if (signOutButton) {
        signOutButton.addEventListener('click', () => {
            if (typeof clearCurrentUserSession === 'function') {
                clearCurrentUserSession();
            }

            window.location.href = '../index.html';
        });
    }
});
