// women.js — Women's page specific JavaScript
// Depends on script.js for addToCart() and showToast()

// ============================================================
// MEGA MENU DATA — Women's categories
// ============================================================
const megaMenuData = {
    newin: [
        { img: '../images/KIT6.jpeg', label: 'YOUR MOST HYPED' },
        { img: '../images/KITE.avif', label: 'VIEW ALL' },
        { img: '../images/KITE2.avif', label: 'DRESSES' }
    ],
    clothing: [
        { img: '../images/style1.jpeg', label: 'DRESSES' },
        { img: '../images/style2.png', label: 'SPRING LAYERS' },
        { img: '../images/style4.jpeg', label: 'TRENDING NOW' }
    ],
    dresses: [
        { img: '../images/KIT6.jpeg', label: 'MIDI DRESSES' },
        { img: '../images/KITE.avif', label: 'MAXI DRESSES' },
        { img: '../images/KITE2.avif', label: 'PARTY DRESSES' }
    ],
    shoes: [
        { img: '../images/SHOES1.jpeg', label: 'TRAINERS' },
        { img: '../images/SHOE5.jpeg', label: 'HEELS' },
        { img: '../images/SHOE3.jpeg', label: 'BOOTS' }
    ],
    facebody: [
        { img: '../images/KIT6.jpeg', label: 'MAKEUP' },
        { img: '../images/KITE.avif', label: 'SKINCARE' },
        { img: '../images/KITE2.avif', label: 'FRAGRANCE' }
    ],
    accessories: [
        { img: '../images/KIT6.jpeg', label: 'BAGS' },
        { img: '../images/KITE.avif', label: 'JEWELLERY' },
        { img: '../images/KITE2.avif', label: 'SUNGLASSES' }
    ],
    activewear: [
        { img: '../images/KIT6.jpeg', label: 'LEGGINGS' },
        { img: '../images/KITE.avif', label: 'SPORTS BRAS' },
        { img: '../images/KITE2.avif', label: 'WORKOUT SETS' }
    ],
    sale: [
        { img: '../images/KIT6.jpeg', label: 'UP TO 70% OFF' },
        { img: '../images/KITE.avif', label: 'SALE DRESSES' },
        { img: '../images/KITE2.avif', label: 'CLEARANCE' }
    ]
};

const mobileMenuData = {
    newin: {
        title: 'New in',
        subtitle: 'New products',
        links: [
            { label: 'View all', href: 'products.html?gender=women&category=clothing' },
            { label: 'New In: Selling Fast', href: 'products.html?gender=women&category=clothing&q=selling%20fast' },
            { label: 'Dresses', href: 'products.html?gender=women&category=dresses' },
            { label: 'Tops', href: 'products.html?gender=women&category=tops-clothing' },
            { label: 'Jumpers', href: 'products.html?gender=women&category=jumpers-cardigans' },
            { label: 'Jeans & Trousers', href: 'products.html?gender=women&category=jeans' },
            { label: 'Hoodies', href: 'products.html?gender=women&category=hoodies' }
        ]
    },
    clothing: {
        title: 'Clothing',
        subtitle: 'Shop by products',
        links: [
            { label: 'Shorts', href: 'products.html?gender=women&category=shorts-clothing' },
            { label: 'Jumpers & Cardigans', href: 'products.html?gender=women&category=jumpers-cardigans' },
            { label: 'Jeans', href: 'products.html?gender=women&category=jeans' },
            { label: 'Blouses', href: 'products.html?gender=women&category=blouses' },
            { label: 'Suits & Tailoring', href: 'products.html?gender=women&category=suits-tailoring' },
            { label: 'Wedding Dresses', href: 'products.html?gender=women&category=wedding-dresses' },
            { label: 'Nightwear', href: 'products.html?gender=women&category=nightwear' },
            { label: 'Occasion Dresses', href: 'products.html?gender=women&category=occasion-dresses' },
            { label: 'Coats & Jackets', href: 'products.html?gender=women&category=coats-jackets' },
            { label: 'Swimwear & Beachwear', href: 'products.html?gender=women&category=swimwear-beachwear' },
            { label: 'Trousers', href: 'products.html?gender=women&category=trousers' },
            { label: 'Skirts', href: 'products.html?gender=women&category=skirts' },
            { label: 'Shirts', href: 'products.html?gender=women&category=shirts' },
            { label: 'Tops', href: 'products.html?gender=women&category=tops-clothing' }
        ]
    },
    shoes: {
        title: 'Shoes',
        subtitle: 'Shop by product',
        links: [
            { label: 'View all', href: 'products.html?gender=women&category=shoes' },
            { label: 'Boots', href: 'products.html?gender=women&category=boots' },
            { label: 'Ballet Pumps', href: 'products.html?gender=women&category=ballet-pumps' },
            { label: 'Heels', href: 'products.html?gender=women&category=heels' },
            { label: 'Adidas', href: 'products.html?gender=women&category=adidas' },
            { label: 'Balenciaga', href: 'products.html?gender=women&category=balenciaga' },
            { label: 'Puma', href: 'products.html?gender=women&category=puma' }
        ]
    },
    facebody: {
        title: 'Face + Body',
        subtitle: 'Shop by product',
        links: [
            { label: 'Up to 40% off', href: 'products.html?gender=women&category=facebody' },
            { label: 'View all', href: 'products.html?gender=women&category=facebody' },
            { label: 'Hottest Drop', href: 'products.html?gender=women&category=facebody' },
            { label: 'Makeup', href: 'products.html?gender=women&category=facebody-makeup' },
            { label: 'Skin care', href: 'products.html?gender=women&category=facebody-skin-care' },
            { label: 'Hair care', href: 'products.html?gender=women&category=facebody-hair-care' },
            { label: 'Body care', href: 'products.html?gender=women&category=facebody-body-care' },
            { label: 'Tools & Accessories', href: 'products.html?gender=women&category=facebody-tools-accessories' }
        ]
    },
    accessories: {
        title: 'Accessories',
        subtitle: 'Shop by product',
        links: [
            { label: 'View all', href: 'products.html?gender=women&category=accessories' },
            { label: 'New in', href: 'products.html?gender=women&category=accessories' },
            { label: 'Sunglasses', href: 'products.html?gender=women&category=accessories-sunglasses' },
            { label: 'Belts', href: 'products.html?gender=women&category=accessories-belts' },
            { label: 'Caps', href: 'products.html?gender=women&category=accessories-caps' },
            { label: 'Gloves', href: 'products.html?gender=women&category=accessories-gloves' },
            { label: 'Hair Accessories', href: 'products.html?gender=women&category=accessories-hair-accessories' },
            { label: 'Bags', href: 'products.html?gender=women&category=accessories-bags' },
            { label: 'Jewellery', href: 'products.html?gender=women&category=accessories-jewellery' }
        ]
    },
    activewear: {
        title: 'Activewear',
        subtitle: 'Shop by product',
        links: [
            { label: 'View all', href: 'products.html?gender=women&category=activewear' },
            { label: 'Trainers', href: 'products.html?gender=women&category=activewear-trainers' },
            { label: 'Tops', href: 'products.html?gender=women&category=activewear-tops' },
            { label: 'Sports bras', href: 'products.html?gender=women&category=activewear-sports-bras' },
            { label: 'Shorts', href: 'products.html?gender=women&category=activewear-shorts' },
            { label: 'Hoodies & Sweatshirts', href: 'products.html?gender=women&category=activewear-hoodies-sweatshirts' },
            { label: 'Addidas', href: 'products.html?gender=women&category=activewear-addidas' },
            { label: 'Jackets', href: 'products.html?gender=women&category=activewear-jackets' }
        ]
    }
};


// ============================================================
// ASOS MEGA MENU — Women
// ============================================================
function initASOSMegaMenu() {
    const megaMenu = document.getElementById('new-in-mega-menu');
    const clothingMegaMenu = document.getElementById('clothing-mega-menu');
    const shoesMegaMenu = document.getElementById('shoes-mega-menu');
    const faceBodyMegaMenu = document.getElementById('facebody-mega-menu');
    const accessoriesMegaMenu = document.getElementById('accessories-mega-menu');
    const activewearMegaMenu = document.getElementById('activewear-mega-menu');
    const blurOverlay = document.getElementById('mega-blur-overlay');
    const triggers = document.querySelectorAll('.nav-item.mega-trigger');
    const cards = document.querySelectorAll('#grid-layout .mega-card');
    const cardImgs = document.querySelectorAll('#grid-layout .mega-card-img');
    const cardLabels = document.querySelectorAll('#grid-layout .mega-card-label');

    if (!megaMenu || !blurOverlay || !triggers.length) return;

    let closeTimer = null;
    let currentCat = null;
    let isOpen = false;

    // No longer needed as CSS handles position: absolute; top: 100% inside fixed container

    function updateCards(category) {
        const data = megaMenuData[category];
        if (!data) return;

        const asosLayout = document.getElementById('asos-layout');
        const gridLayout = document.getElementById('grid-layout');
        const womenLayout = document.getElementById('women-layout');

        if (category === 'newin') {
            if (asosLayout) asosLayout.style.display = 'flex';
            if (womenLayout) womenLayout.style.display = 'none';
            if (gridLayout) gridLayout.style.display = 'none';
        } else {
            if (asosLayout) asosLayout.style.display = 'none';
            if (womenLayout) womenLayout.style.display = 'none';
            if (gridLayout) gridLayout.style.display = 'grid';

            cards.forEach((card, i) => {
                card.classList.add('is-swapping');
                setTimeout(() => {
                    cardImgs[i].src = data[i].img;
                    cardImgs[i].alt = data[i].label;
                    cardLabels[i].textContent = data[i].label;
                    card.classList.remove('is-swapping');
                }, 120);
            });
        }
    }


    function openMenu(category) {
        const customMenus = {
            clothing: clothingMegaMenu,
            shoes: shoesMegaMenu,
            facebody: faceBodyMegaMenu,
            accessories: accessoriesMegaMenu,
            activewear: activewearMegaMenu
        };
        const customMenu = customMenus[category];

        if (customMenu) {
            megaMenu.classList.remove('is-open');
            Object.values(customMenus).forEach(m => { if (m && m !== customMenu) m.classList.remove('is-open'); });
            customMenu.classList.add('is-open');
        } else {
            Object.values(customMenus).forEach(m => { if (m) m.classList.remove('is-open'); });
            if (category !== currentCat) { updateCards(category); currentCat = category; }
            megaMenu.classList.add('is-open');
        }

        blurOverlay.classList.add('is-active');
        isOpen = true;
        currentCat = category;

        triggers.forEach(t => t.classList.remove('mega-active'));
        const active = document.querySelector(`.mega-trigger[data-category="${category}"]`);
        if (active) active.classList.add('mega-active');
    }

    
    function closeMenu() {
        [megaMenu, clothingMegaMenu, shoesMegaMenu, faceBodyMegaMenu, accessoriesMegaMenu, activewearMegaMenu]
            .forEach(m => { if (m) m.classList.remove('is-open'); });
        blurOverlay.classList.remove('is-active');
        triggers.forEach(t => t.classList.remove('mega-active'));
        isOpen = false;
        currentCat = null;
    }

    function scheduleClose() { clearTimeout(closeTimer); closeTimer = setTimeout(closeMenu, 200); }
    function cancelClose() { clearTimeout(closeTimer); }

    triggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', () => { cancelClose(); openMenu(trigger.getAttribute('data-category')); });
        trigger.addEventListener('mouseleave', scheduleClose);
    });

    [megaMenu, clothingMegaMenu, shoesMegaMenu, faceBodyMegaMenu, accessoriesMegaMenu, activewearMegaMenu]
        .forEach(m => {
            if (!m) return;
            m.addEventListener('mouseenter', cancelClose);
            m.addEventListener('mouseleave', scheduleClose);
        });

    blurOverlay.addEventListener('click', closeMenu);

    updateCards('clothing');
}


// ============================================================
// PRODUCT CARD SLIDER
// ============================================================
function initializeSlider(sectionOrId) {
    const section = typeof sectionOrId === 'string'
        ? document.querySelector(`#${sectionOrId}`)
        : sectionOrId;
    if (!section || section.dataset.sliderInitialized === 'true') return;

    const track = section.querySelector('.pc-track');
    const items = section.querySelectorAll('.pc-item');
    const nextBtn = section.querySelector('.arrow.right');
    const prevBtn = section.querySelector('.arrow.left');
    const dots = section.querySelectorAll('.dot');

    if (!track || items.length === 0 || !nextBtn || !prevBtn) return;

    function updateDots() {
        const itemWidth = items[0].offsetWidth;
        const scrollPosition = track.scrollLeft;
        const index = Math.round(scrollPosition / ((itemWidth + 9) * 4));
        
        dots.forEach(d => d.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
    }

    nextBtn.addEventListener('click', () => { 
        const itemWidth = items[0].offsetWidth;
        track.scrollBy({ left: (itemWidth + 9) * 4, behavior: 'smooth' }); 
    });
    
    prevBtn.addEventListener('click', () => { 
        const itemWidth = items[0].offsetWidth;
        track.scrollBy({ left: -((itemWidth + 9) * 4), behavior: 'smooth' }); 
    });
    
    dots.forEach((dot, i) => dot.addEventListener('click', () => { 
        const itemWidth = items[0].offsetWidth;
        track.scrollTo({ left: i * 4 * (itemWidth + 9), behavior: 'smooth' }); 
    }));
    
    track.addEventListener('scroll', () => {
        // Debounce or directly update dots based on scroll position
        updateDots();
    });

    setTimeout(updateDots, 100);
    section.dataset.sliderInitialized = 'true';
}


// ============================================================
// NAVBAR SCROLL HIDE / SHOW
// ============================================================
// Shared Navbar and Category logic moved to JS/navbar.js


// ============================================================
// HEADER SEARCH
// ============================================================
function initHeaderSearch() {
    const header = document.getElementById('header');
    const searchBox = document.querySelector('.search-box');
    const input = document.getElementById('search-input');
    const button = document.querySelector('.search-button');
    const mobileTrigger = document.querySelector('.mobile-search-trigger');
    const tags = document.querySelectorAll('.search-discovery .tag');

    if (!searchBox || !input || !button) return;

    const keywordMap = [
        { match: ['dress', 'dresses', 'gown'], category: 'dresses' },
        { match: ['top', 'tops', 'blouse', 'shirt'], category: 'tops-clothing' },
        { match: ['jean', 'jeans', 'trouser', 'trousers', 'denim'], category: 'jeans' },
        { match: ['jumpers', 'jumper', 'cardigan', 'knitwear'], category: 'jumpers-cardigans' },
        { match: ['hoodie', 'hoodies', 'sweatshirt'], category: 'hoodies' },
        { match: ['shoe', 'shoes', 'heel', 'heels', 'boot', 'boots', 'sandals', 'trainer', 'trainers'], category: 'shoes' },
        { match: ['makeup', 'skin', 'skincare', 'hair', 'nails', 'body'], category: 'facebody' },
        { match: ['bag', 'bags', 'accessory', 'accessories', 'jewellery', 'jewelry', 'ring', 'earrings', 'necklace', 'bracelet', 'sunglasses', 'phone case'], category: 'accessories' },
        { match: ['activewear', 'sports', 'gym', 'workout', 'legging', 'leggings'], category: 'activewear' }
    ];

    function normalize(value) {
        return value.trim().toLowerCase();
    }

    function getCategoryFromQuery(query) {
        const normalizedQuery = normalize(query);
        if (!normalizedQuery) return 'clothing';

        const matchedEntry = keywordMap.find(entry =>
            entry.match.some(keyword => normalizedQuery.includes(keyword))
        );

        return matchedEntry ? matchedEntry.category : 'clothing';
    }

    function submitSearch(rawQuery) {
        const query = normalize(rawQuery);
        const category = getCategoryFromQuery(query);
        const params = new URLSearchParams();
        params.set('gender', 'women');
        params.set('category', category);
        if (query) params.set('q', query);
        window.location.href = `products.html?${params.toString()}`;
    }

    function openDiscovery() {
        searchBox.classList.add('is-open');
    }

    function closeDiscovery() {
        searchBox.classList.remove('is-open');
    }

    function isMobileViewport() {
        return window.innerWidth <= 799;
    }

    input.addEventListener('focus', openDiscovery);

    input.addEventListener('input', () => {
        if (document.activeElement === input) openDiscovery();
    });

    input.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        submitSearch(input.value);
    });

    button.addEventListener('click', (event) => {
        event.preventDefault();
        submitSearch(input.value);
    });

    if (mobileTrigger && header) {
        mobileTrigger.addEventListener('click', () => {
            if (!isMobileViewport()) {
                input.focus();
                return;
            }

            const isOpen = header.classList.toggle('mobile-search-open');
            if (isOpen) {
                setTimeout(() => input.focus(), 0);
            }
        });
    }

    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            input.value = tag.textContent.trim();
            submitSearch(input.value);
        });
    });

    document.addEventListener('click', (event) => {
        if (!searchBox.contains(event.target)) {
            closeDiscovery();
        }

        if (header && mobileTrigger && isMobileViewport()) {
            const clickedTrigger = mobileTrigger.contains(event.target);
            const clickedHeader = header.contains(event.target);

            if (!clickedTrigger && !clickedHeader) {
                header.classList.remove('mobile-search-open');
            }
        }
    });

    window.addEventListener('resize', () => {
        if (!isMobileViewport() && header) {
            header.classList.remove('mobile-search-open');
        }
    });
}

function initMobileDrawer() {
    const header = document.getElementById('header');
    const trigger = document.getElementById('mobile');
    const overlay = document.getElementById('mobile-nav-overlay');
    const drawer = document.getElementById('mobile-nav-drawer');
    const mainPanel = overlay ? overlay.querySelector('.mobile-nav-main') : null;
    const subPanel = overlay ? overlay.querySelector('.mobile-nav-subpanel') : null;
    const title = document.getElementById('mobile-submenu-title');
    const subtitle = document.getElementById('mobile-submenu-subtitle');
    const linksContainer = document.getElementById('mobile-submenu-links');
    const parentButtons = overlay ? overlay.querySelectorAll('.mobile-nav-parent') : [];
    const closeButtons = overlay ? overlay.querySelectorAll('.mobile-nav-close') : [];
    const backButton = overlay ? overlay.querySelector('.mobile-nav-back') : null;

    if (!trigger || !overlay || !drawer || !mainPanel || !subPanel || !title || !subtitle || !linksContainer) return;

    function isMobileViewport() {
        return window.innerWidth <= 799;
    }

    function closeDrawer() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('mobile-nav-open');
        mainPanel.classList.remove('is-shifted');
        subPanel.classList.remove('is-active');
        if (header) {
            header.classList.remove('mobile-search-open');
        }
    }

    function openDrawer() {
        if (!isMobileViewport()) return;
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('mobile-nav-open');
    }

    function showMainPanel() {
        mainPanel.classList.remove('is-shifted');
        subPanel.classList.remove('is-active');
    }

    function showSubmenu(categoryKey) {
        const config = mobileMenuData[categoryKey];
        if (!config) return;

        title.textContent = config.title;
        subtitle.textContent = config.subtitle;
        linksContainer.innerHTML = config.links
            .map(link => `<a href="${link.href}" class="mobile-nav-sublink">${link.label}</a>`)
            .join('');

        mainPanel.classList.add('is-shifted');
        subPanel.classList.add('is-active');
    }

    trigger.addEventListener('click', () => {
        if (!isMobileViewport()) return;
        openDrawer();
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', closeDrawer);
    });

    if (backButton) {
        backButton.addEventListener('click', showMainPanel);
    }

    parentButtons.forEach(button => {
        button.addEventListener('click', () => {
            showSubmenu(button.dataset.mobileCategory);
        });
    });

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeDrawer();
        }
    });

    drawer.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    window.addEventListener('resize', () => {
        if (!isMobileViewport()) {
            closeDrawer();
        }
    });
}


// ============================================================
// RENDER HOVER CART
// ============================================================
function renderHoverCartMenu() {
    const hoverCartItems = document.getElementById('hover-cart-items');
    if (!hoverCartItems) return;
    const cart = typeof getCurrentUserCart === 'function' ? getCurrentUserCart() : [];
    if (cart.length === 0) {
        hoverCartItems.innerHTML = '<p class="hover-cart-empty">Shopping cart is empty.</p>';
        return;
    }
    hoverCartItems.innerHTML = cart.map(item => `
        <div class="hover-cart-item">
            <img src="${item.image || ''}" alt="${item.name || 'Product'}">
            <div class="hover-cart-item-details">
                <p class="hover-cart-item-name">${item.name || 'Product'}</p>
                <p>Qty: ${Number(item.quantity) || 1}</p>
                <p>$${(Number(item.price) || 0).toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}

function initSidebarCheckout() {
    const checkoutButton = document.getElementById('proceed-checkout-btn');
    if (!checkoutButton) return;

    checkoutButton.addEventListener('click', () => {
        const cart = typeof getCurrentUserCart === 'function' ? getCurrentUserCart() : [];

        if (!cart.length) return;
        if (typeof getCurrentUser === 'function' && !getCurrentUser()) {
            localStorage.setItem(REDIRECT_URL_STORAGE_KEY, 'delivery.html');
            window.location.href = 'login.html';
            return;
        }
        window.location.href = 'delivery.html';
    });
}

window.addEventListener('storage', (e) => {
    if (e.key === 'cart') renderHoverCartMenu();
});


// ============================================================
// INIT ALL
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initASOSMegaMenu();
    initMobileDrawer();
    initSidebarCheckout();
    renderHoverCartMenu();

    const cartHoverMenu = document.querySelector('.cart-menu');
    if (cartHoverMenu) cartHoverMenu.addEventListener('mouseenter', renderHoverCartMenu);

    setTimeout(() => {
        document.querySelectorAll('.product-category').forEach(initializeSlider);
    }, 200);
});
