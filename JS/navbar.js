/**
 * Shared Navbar Logic
 * Handles Sticky Header hide/reveal and Category Slider scroll
 */

function initNavbarScroll() {
    const stickyHeader = document.getElementById('sticky-header-container');
    if (!stickyHeader) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    const hideThreshold = 100;
    const downDelta = 10;
    const upDelta = 2;

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        const scrollDifference = currentScrollY - lastScrollY;

        if (currentScrollY <= 0) {
            stickyHeader.classList.remove('header-hidden');
            lastScrollY = 0;
            ticking = false;
            return;
        }

        if (scrollDifference > downDelta && currentScrollY > hideThreshold) {
            stickyHeader.classList.add('header-hidden');
            lastScrollY = currentScrollY;
        } else if (scrollDifference < -upDelta) {
            stickyHeader.classList.remove('header-hidden');
            lastScrollY = currentScrollY;
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
}

function initCategoryScroll() {
    const slider = document.getElementById('category-slider');
    if (!slider) return;
    const list = slider.querySelector('.category-list');
    const left = slider.querySelector('.scroll-arrow.left');
    const right = slider.querySelector('.scroll-arrow.right');
    if (!list) return;
    if (left) left.addEventListener('click', () => list.scrollBy({ left: -200, behavior: 'smooth' }));
    if (right) right.addEventListener('click', () => list.scrollBy({ left: 200, behavior: 'smooth' }));
}

function initFooterLinkFallback() {
    document.addEventListener('click', (event) => {
        const footerLink = event.target.closest('footer a[href="about.html"], footer a[href="contact.html"]');
        if (!footerLink) return;

        event.preventDefault();
        window.location.href = footerLink.getAttribute('href');
    });
}

// Mobile drawer logic (if shared)
function initMobileDrawer() {
    const header = document.getElementById('header');
    const bar = document.getElementById('bar');
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

    if (!bar || !overlay || !drawer) return;

    const menuData = {
        newin: {
            title: 'New in',
            subtitle: 'New products',
            links: [
                { label: 'View all', href: 'products.html?gender=women&category=clothing' },
                { label: 'New In: Today', href: 'products.html?gender=women&category=clothing&q=new%20in' },
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
                { label: 'Sandals', href: 'products.html?gender=women&category=sandals' },
                { label: 'Heels', href: 'products.html?gender=women&category=heels' },
                { label: 'Adidas', href: 'products.html?gender=women&category=adidas' },
                { label: 'Birkenstock', href: 'products.html?gender=women&category=birkenstock' },
                { label: 'Asos Design', href: 'products.html?gender=women&category=asos-design' },
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

    function isMobileViewport() {
        return window.innerWidth <= 799;
    }

    function showMainPanel() {
        if (!mainPanel || !subPanel) return;
        mainPanel.classList.remove('is-shifted');
        subPanel.classList.remove('is-active');
    }

    function closeMenu() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('mobile-nav-open');
        showMainPanel();
        if (header) {
            header.classList.remove('mobile-search-open');
        }
    }

    function openMenu() {
        if (!isMobileViewport()) return;
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('mobile-nav-open');
    }

    function showSubmenu(categoryKey) {
        const config = menuData[categoryKey];
        if (!config || !mainPanel || !subPanel || !title || !subtitle || !linksContainer) return;

        title.textContent = config.title;
        subtitle.textContent = config.subtitle;
        linksContainer.innerHTML = config.links
            .map((link) => `<a href="${link.href}" class="mobile-nav-sublink">${link.label}</a>`)
            .join('');

        mainPanel.classList.add('is-shifted');
        subPanel.classList.add('is-active');
    }

    bar.addEventListener('click', openMenu);

    closeButtons.forEach((button) => {
        button.addEventListener('click', closeMenu);
    });

    if (backButton) {
        backButton.addEventListener('click', showMainPanel);
    }

    parentButtons.forEach((button) => {
        button.addEventListener('click', () => {
            showSubmenu(button.dataset.mobileCategory);
        });
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeMenu();
    });

    drawer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    window.addEventListener('resize', () => {
        if (!isMobileViewport()) {
            closeMenu();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initCategoryScroll();
    initMobileDrawer();
    initFooterLinkFallback();
});
