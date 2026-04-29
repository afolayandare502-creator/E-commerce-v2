// product-details.js
// Depends on script.js for cart utilities

// ============================================================
// CATEGORY FILE MAP
// ============================================================
const categoryFileMap = {
    'dresses':        '../Data/Women/New-in/dresses.json',
    'tops':           '../Data/Women/New-in/tops.json',
    'jumpers':        '../Data/Women/New-in/jumpers.json',
    'jeans-trousers': '../Data/Women/New-in/jeans-trousers.json',
    'hoodies':        '../Data/Women/New-in/hoodies.json',
    'today':          '../Data/Women/New-in/dresses.json',
    'selling-fast':   '../Data/Women/New-in/tops.json',
    'jeans':          '../Data/Women/Clothing/jeans.json',
    'tops-clothing':  '../Data/Women/Clothing/tops.json',
    'jumpers-cardigans': '../Data/Women/Clothing/jumpers-cardigans.json',
    'blouses':        '../Data/Women/Clothing/blouses.json',
    'coats-jackets':  '../Data/Women/Clothing/coats-Jackets.json',
    'modest-fashion': '../Data/Women/Clothing/modest-fashion.json',
    'nightwear':      '../Data/Women/Clothing/nightwear.json',
    'occasion-dresses': '../Data/Women/Clothing/occasion-dresses.json',
    'shirts':         '../Data/Women/Clothing/shirts.json',
    'shorts-clothing': '../Data/Women/Clothing/shorts.json',
    'skirts':         '../Data/Women/Clothing/skirts.json',
    'suits-tailoring': '../Data/Women/Clothing/suits-Tailoring.json',
    'swimwear-beachwear': '../Data/Women/Clothing/swimwear-beachwear.json',
    'trousers':       '../Data/Women/Clothing/trousers.json',
    'wedding-dresses': '../Data/Women/Clothing/wedding-dresses.json',
    'boots':          '../Data/Women/Shoes/Boots.json',
    'ballet-pumps':   '../Data/Women/Shoes/ballet-pumps.json',
    'sandals':        '../Data/Women/Shoes/Sandals.json',
    'heels':          '../Data/Women/Shoes/Heels.json',
    'adidas':         '../Data/Women/Shoes/addidas.json',
    'birkenstock':    '../Data/Women/Shoes/birkenstock.json',
    'balenciaga':     '../Data/Women/Shoes/balenciaga.json',
    'puma':           '../Data/Women/Shoes/Puma.json',
    'facebody-makeup': '../Data/Women/Face+Body/makeup.json',
    'facebody-skin-care': '../Data/Women/Face+Body/skin-care.json',
    'facebody-hair-care': '../Data/Women/Face+Body/hair-care.json',
    'facebody-body-care': '../Data/Women/Face+Body/body-care.json',
    'facebody-suncare-tanning': '../Data/Women/Face+Body/suncare-tranning.json',
    'facebody-tools-accessories': '../Data/Women/Face+Body/tools-accessories.json',
    'facebody-hottest-drop': '../Data/Women/Face+Body/makeup.json',
    'facebody-up-to-40-off': '../Data/Women/Face+Body/makeup.json',
    'facebody-beauty-gifts': '../Data/Women/Face+Body/makeup.json',
    'activewear-trainers': '../Data/Women/Activewear/trainers.json',
    'activewear-tops': '../Data/Women/Activewear/tops-activewear.json',
    'activewear-sports-bras': '../Data/Women/Activewear/sports-bras.json',
    'activewear-shorts': '../Data/Women/Activewear/shorts.json',
    'activewear-hoodies-sweatshirts': '../Data/Women/Activewear/hoodies-sweatshirts.json',
    'activewear-addidas': '../Data/Women/Activewear/addidas-activewear.json',
    'activewear-jackets': '../Data/Women/Activewear/jackets.json',
    'accessories-sunglasses': '../Data/Women/Accessories/Product/sunglasses.json',
    'accessories-belts': '../Data/Women/Accessories/Product/belts.json',
    'accessories-caps': '../Data/Women/Accessories/Product/caps.json',
    'accessories-gloves': '../Data/Women/Accessories/Product/gloves.json',
    'accessories-hair-accessories': '../Data/Women/Accessories/Product/hair-accessories.json',
    'accessories-cross-body-bags': '../Data/Women/Accessories/Bags/cross-bag.json',
    'accessories-tote-bags': '../Data/Women/Accessories/Bags/tote-bags.json',
    'accessories-travel-bags': '../Data/Women/Accessories/Bags/travel-bags.json',
    'accessories-shoulder-bags': '../Data/Women/Accessories/Bags/shoulder-bags.json',
    'accessories-clutches': '../Data/Women/Accessories/Bags/clutches.json',
    'accessories-earrings': '../Data/Women/Accessories/Jewellery/earrings.json',
    'accessories-necklaces': '../Data/Women/Accessories/Jewellery/necklaces.json',
    'accessories-rings': '../Data/Women/Accessories/Jewellery/rings.json',
    'accessories-bracelets': '../Data/Women/Accessories/Jewellery/bracelets.json',
    'accessories-new-in': '../Data/Women/Accessories/Product/sunglasses.json',
    'new-in-t-shirts': '../Data/Men/New-in/t-shirts.json',
    'new-in-hoodies-sweatshirts': '../Data/Men/New-in/hoodies-sweatshirts.json',
    'new-in-jeans-trousers': '../Data/Men/New-in/jeans-trousers.json',
    'new-in-underwear': '../Data/Men/New-in/underwear.json',
    'new-in-jumpers': '../Data/Men/New-in/jumpers.json',
    'new-in-today': '../Data/Men/New-in/t-shirts.json',
    'men-shorts': '../Data/Men/Clothing/shorts.json',
    'men-jumpers-cardigans': '../Data/Men/Clothing/jumpers-cardigans.json',
    'men-coats-jackets': '../Data/Men/Clothing/coats-jackets.json',
    'men-trousers-chinos': '../Data/Men/Clothing/trousers-chinos.json',
    'men-joggers': '../Data/Men/Clothing/joggers.json',
    'men-swimwear': '../Data/Men/Clothing/swimwear.json',
    'men-jeans': '../Data/Men/Clothing/jeans.json',
    'men-cargo-trousers': '../Data/Men/Clothing/cargo-trousers.json',
    'men-suits-tailoring': '../Data/Men/Clothing/suits-tailoring.json',
    'men-socks': '../Data/Men/Clothing/socks.json',
    'men-casual-shirts': '../Data/Men/Clothing/casual-shirts.json',
    'men-underwear-clothing': '../Data/Men/Clothing/underwear.json',
    'shoes-trainers': '../Data/Men/Shoes/trainers.json',
    'shoes-boots': '../Data/Men/Shoes/boots.json',
    'shoes-sandals': '../Data/Men/Shoes/sandals.json',
    'shoes-sliders': '../Data/Men/Shoes/sliders.json',
    'shoes-loafers': '../Data/Men/Shoes/loafers.json',
    'shoes-adidas': '../Data/Men/Shoes/adidas.json',
    'shoes-balenciaga-on': '../Data/Men/Shoes/balenciaga-on.json',
    'shoes-new-in': '../Data/Men/Shoes/trainers.json',
    'men-facebody-skincare': '../Data/Men/Face+Body/skincare.json',
    'men-facebody-hair-care': '../Data/Men/Face+Body/hair-care.json',
    'men-facebody-body-care': '../Data/Men/Face+Body/body-care.json',
    'men-facebody-fragrance': '../Data/Men/Face+Body/fragrance.json',
    'men-facebody-tools-accessories': '../Data/Men/Face+Body/tools-accessories.json',
    'men-facebody-up-to-40-off': '../Data/Men/Face+Body/skincare.json',
    'men-activewear-tops-on': '../Data/Men/Activewear/tops-on.json',
    'men-activewear-shorts-on': '../Data/Men/Activewear/shorts-on.json',
    'men-activewear-jackets-on': '../Data/Men/Activewear/jackets-on.json',
    'men-activewear-ski-snowboard': '../Data/Men/Activewear/ski-snowboard.json',
    'men-activewear-trousers-tights': '../Data/Men/Activewear/trousers-tights.json',
    'men-activewear-hoodies-activewear': '../Data/Men/Activewear/hoodies-activewear.json',
    'men-activewear-active-accessories': '../Data/Men/Activewear/active-accessories.json',
    'men-accessories-product-view-all': '../Data/Men/Accessories/shop by product On /accessories-on.json',
    'men-accessories-sunglasses': '../Data/Men/Accessories/shop by product On /sunglasses.json',
    'men-accessories-watches': '../Data/Men/Accessories/shop by product On /watches.json',
    'men-accessories-belts': '../Data/Men/Accessories/shop by product On /belts.json',
    'men-accessories-ties': '../Data/Men/Accessories/shop by product On /ties.json',
    'men-accessories-cap-hats': '../Data/Men/Accessories/shop by product On /cap-hats.json',
    'men-accessories-gloves': '../Data/Men/Accessories/shop by product On /gloves.json',
    'men-accessories-accessories-on': '../Data/Men/Accessories/shop by product On /accessories-on.json',
    'men-accessories-bags-view-all-bags': '../Data/Men/Accessories/Shop by Bags On/view-all-bags.json',
    'men-accessories-bags-wallets': '../Data/Men/Accessories/Shop by Bags On/wallets.json',
    'men-accessories-bags-backpacks': '../Data/Men/Accessories/Shop by Bags On/backpacks.json',
    'men-accessories-bags-travel-bags-on': '../Data/Men/Accessories/Shop by Bags On/travel-bags on.json',
    'men-accessories-bags-bum-bags': '../Data/Men/Accessories/Shop by Bags On/bum-bags.json',
    'men-accessories-bags-shopper-bags': '../Data/Men/Accessories/Shop by Bags On/shopper-bags.json',
    'men-accessories-jewellery-view-all-jewellery': '../Data/Men/Accessories/Shop by Jewellery On/view-all-jewellery.json',
    'men-accessories-jewellery-earrings': '../Data/Men/Accessories/Shop by Jewellery On/earrings.json',
    'men-accessories-jewellery-necklaces': '../Data/Men/Accessories/Shop by Jewellery On/necklaces.json',
    'men-accessories-jewellery-rings': '../Data/Men/Accessories/Shop by Jewellery On/rings.json',
    'men-accessories-jewellery-bracelets': '../Data/Men/Accessories/Shop by Jewellery On/bracelets.json',
    'men-accessories-jewellery-plated-sterling-on': '../Data/Men/Accessories/Shop by Jewellery On/plated-sterling-on.json'
};

const allCategoryFiles = Object.values(categoryFileMap).filter((v, i, a) => a.indexOf(v) === i);

const categoryLabelMap = {
    'dresses': 'Dresses',
    'tops': 'Tops',
    'jumpers': 'Jumpers',
    'jeans-trousers': 'Jeans & Trousers',
    'hoodies': 'Hoodies',
    'today': 'New In: Today',
    'selling-fast': 'Selling Fast',
    'jeans': 'Jeans',
    'tops-clothing': 'Tops',
    'jumpers-cardigans': 'Jumpers & Cardigans',
    'blouses': 'Blouses',
    'coats-jackets': 'Coats & Jackets',
    'modest-fashion': 'Modest Fashion',
    'nightwear': 'Nightwear',
    'occasion-dresses': 'Occasion Dresses',
    'shirts': 'Shirts',
    'shorts-clothing': 'Shorts',
    'skirts': 'Skirts',
    'suits-tailoring': 'Suits & Tailoring',
    'swimwear-beachwear': 'Swimwear & Beachwear',
    'trousers': 'Trousers',
    'wedding-dresses': 'Wedding Dresses',
    'boots': 'Boots',
    'ballet-pumps': 'Ballet Pumps',
    'sandals': 'Sandals',
    'heels': 'Heels',
    'adidas': 'Adidas',
    'birkenstock': 'Birkenstock',
    'balenciaga': 'Balenciaga',
    'puma': 'Puma',
    'facebody': 'Face + Body',
    'facebody-makeup': 'Makeup',
    'facebody-skin-care': 'Skin care',
    'facebody-hair-care': 'Hair care',
    'facebody-body-care': 'Body care',
    'facebody-suncare-tanning': 'Suncare & Tanning',
    'facebody-tools-accessories': 'Tools & Accessories',
    'facebody-hottest-drop': 'Hottest Drop',
    'facebody-up-to-40-off': 'Up to 40% off',
    'facebody-beauty-gifts': 'Beauty gifts',
    'activewear': 'Activewear',
    'activewear-trainers': 'Trainers',
    'activewear-tops': 'Tops',
    'activewear-sports-bras': 'Sports bras',
    'activewear-shorts': 'Shorts',
    'activewear-hoodies-sweatshirts': 'Hoodies & Sweatshirts',
    'activewear-addidas': 'Addidas',
    'activewear-jackets': 'Jackets',
    'accessories': 'Accessories',
    'accessories-product': 'Accessories',
    'accessories-bags': 'Bags',
    'accessories-jewellery': 'Jewellery',
    'accessories-new-in': 'New in',
    'accessories-sunglasses': 'Sunglasses',
    'accessories-belts': 'Belts',
    'accessories-caps': 'Caps',
    'accessories-gloves': 'Gloves',
    'accessories-hair-accessories': 'Hair Accessories',
    'accessories-cross-body-bags': 'Cross Body Bags',
    'accessories-tote-bags': 'Tote Bags',
    'accessories-travel-bags': 'Travel Bags',
    'accessories-shoulder-bags': 'Shoulder Bags',
    'accessories-clutches': 'Clutches',
    'accessories-earrings': 'Earrings',
    'accessories-necklaces': 'Necklaces',
    'accessories-rings': 'Rings',
    'accessories-bracelets': 'Bracelets',
    'new-in': 'New In',
    'new-in-today': 'New in: Today',
    'new-in-t-shirts': 'T-Shirts',
    'new-in-hoodies-sweatshirts': 'Hoodies & Sweatshirts',
    'new-in-jeans-trousers': 'Jeans & Trousers',
    'new-in-underwear': 'Underwear',
    'new-in-jumpers': 'Jumpers',
    'men-shorts': 'Shorts',
    'men-jumpers-cardigans': 'Jumpers & Cardigans',
    'men-coats-jackets': 'Coats & Jackets',
    'men-trousers-chinos': 'Trousers & Chinos',
    'men-joggers': 'Joggers',
    'men-swimwear': 'Swimwear',
    'men-jeans': 'Jeans',
    'men-cargo-trousers': 'Cargo Trousers',
    'men-suits-tailoring': 'Suits & Tailoring',
    'men-socks': 'Socks',
    'men-casual-shirts': 'Casual Shirts',
    'men-underwear-clothing': 'Underwear',
    'shoes-trainers': 'Trainers',
    'shoes-boots': 'Boots',
    'shoes-sandals': 'Sandals',
    'shoes-sliders': 'Sliders',
    'shoes-loafers': 'Loafers',
    'shoes-adidas': 'Adidas',
    'shoes-balenciaga-on': 'Balenciaga On',
    'shoes-new-in': 'New in',
    'men-facebody-skincare': 'Skincare',
    'men-facebody-hair-care': 'Hair care',
    'men-facebody-body-care': 'Body care',
    'men-facebody-fragrance': 'Fragrance',
    'men-facebody-tools-accessories': 'Tools & Accessories',
    'men-facebody-up-to-40-off': 'Up to 40% off',
    'men-activewear-tops-on': 'Tops On',
    'men-activewear-shorts-on': 'Shorts On',
    'men-activewear-jackets-on': 'Jackets',
    'men-activewear-ski-snowboard': 'Ski & Snowboard',
    'men-activewear-trousers-tights': 'Trousers & Tights',
    'men-activewear-hoodies-activewear': 'Hoodies & active shirts',
    'men-activewear-active-accessories': 'Active Accessories',
    'men-accessories-product-view-all': 'View all',
    'men-accessories-sunglasses': 'Sunglasses',
    'men-accessories-watches': 'Watches',
    'men-accessories-belts': 'Belts',
    'men-accessories-ties': 'Ties',
    'men-accessories-cap-hats': 'Cap & Hats',
    'men-accessories-gloves': 'Gloves',
    'men-accessories-accessories-on': 'Accessories On',
    'men-accessories-bags-view-all-bags': 'View all',
    'men-accessories-bags-wallets': 'Wallets',
    'men-accessories-bags-backpacks': 'Backpacks',
    'men-accessories-bags-travel-bags-on': 'Travel bags On',
    'men-accessories-bags-bum-bags': 'Bum Bags',
    'men-accessories-bags-shopper-bags': 'Shopper Bags',
    'men-accessories-jewellery-view-all-jewellery': 'View all',
    'men-accessories-jewellery-earrings': 'Earrings',
    'men-accessories-jewellery-necklaces': 'Necklaces',
    'men-accessories-jewellery-rings': 'Rings',
    'men-accessories-jewellery-bracelets': 'Bracelets',
    'men-accessories-jewellery-plated-sterling-on': 'Plated & Sterling Jewellery'
};

const categoryGalleryMap = {
    'dresses': [
        '../images/product/women/Dresses/DFM1.avif',
        '../images/product/women/Dresses/DFM2.avif',
        '../images/product/women/Dresses/DFM3.avif',
        '../images/product/women/Dresses/DFM4.avif',
    ],
    'tops': [
        '../images/product/women/Tops/style2.jpeg',
        '../images/product/women/Tops/style3.jpeg',
        '../images/product/women/Tops/style4.jpeg',
        '../images/product/women/Tops/stylepj.jpeg',
        '../images/product/women/Tops/stylepk.jpeg'
    ],
    'jumpers': [
        '../images/product/women/Jumpers/style2.jpeg',
        '../images/product/women/Jumpers/style3.jpeg',
        '../images/product/women/Jumpers/style4.jpeg',
        '../images/product/women/Jumpers/stylepj.jpeg',
        '../images/product/women/Jumpers/stylepk.jpeg'
    ],
    'jeans-trousers': [
        '../images/product/women/Jeans & Trousers/style2.jpeg',
        '../images/product/women/Jeans & Trousers/style3.jpeg',
        '../images/product/women/Jeans & Trousers/style4.jpeg',
        '../images/product/women/Jeans & Trousers/stylepj.jpeg',
        '../images/product/women/Jeans & Trousers/stylepk.jpeg'
    ],
    'hoodies': [
        '../images/product/women/Hoddies/PSG4.avif',
        '../images/product/women/Hoddies/PSG5.avif',
        '../images/product/women/Hoddies/PSG6.avif',
        '../images/product/women/Hoddies/PSG7.avif',
        '../images/product/women/Hoddies/PSG8.avif'
    ]
};

let currentProduct = null;
let selectedSize   = null;
let selectedQuantity = 1;

const categoryStorageKeyMap = {
    'dresses': 'dresses_data',
    'tops': 'tops',
    'jumpers': 'jumpers',
    'jeans-trousers': 'jeans-trousers',
    'hoodies': 'hoodies',
    'jeans': 'jeans',
    'tops-clothing': 'tops-clothing',
    'jumpers-cardigans': 'jumpers-cardigans',
    'blouses': 'blouses',
    'coats-jackets': 'coats-jackets',
    'nightwear': 'nightwear',
    'occasion-dresses': 'occasion-dresses',
    'shirts': 'shirts',
    'shorts-clothing': 'shorts-clothing',
    'skirts': 'skirts',
    'suits-tailoring': 'suits-tailoring',
    'swimwear-beachwear': 'swimwear-beachwear',
    'trousers': 'trousers',
    'wedding-dresses': 'wedding-dresses',
    'boots': 'boots',
    'ballet-pumps': 'ballet-pumps',
    'sandals': 'sandals',
    'heels': 'heels',
    'adidas': 'adidas',
    'birkenstock': 'birkenstock',
    'balenciaga': 'balenciaga',
    'puma': 'puma',
    'facebody-makeup': 'facebody-makeup',
    'facebody-skin-care': 'facebody-skin-care',
    'facebody-hair-care': 'facebody-hair-care',
    'facebody-body-care': 'facebody-body-care',
    'facebody-tools-accessories': 'facebody-tools-accessories',
    'facebody-hottest-drop': 'facebody-hottest-drop',
    'accessories-sunglasses': 'accessories-sunglasses',
    'accessories-bags': 'accessories-bags',
    'accessories-jewellery': 'accessories-jewellery',
    'activewear-trainers': 'activewear-trainers',
    'activewear-tops': 'activewear-tops',
    'activewear-sports-bras': 'activewear-sports-bras',
    'activewear-shorts': 'activewear-shorts',
    'activewear-hoodies-sweatshirts': 'activewear-hoodies-sweatshirts',
    'activewear-jackets': 'activewear-jackets'
};

// ============================================================
// BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
    initializeSizeSelection();
    initializeQuantityControl();
    initializeAddToCart();
    updateCartCount();
    initSavedItemsLink();
    initReviewModal();
});

// ============================================================
// LOAD PRODUCT
// ============================================================
async function loadProductDetails() {
    const params    = new URLSearchParams(window.location.search);
    const productId = String(params.get('id') || '').trim();
    const category  = params.get('category');

    if (!productId) { showError('Product not found.'); return; }

    showLoading();

    const product = await findProductById(productId, category);

    if (!product) { showError('Product not found.'); return; }

    if (category) {
        product._listingCategory = category;
    }

    currentProduct = product;
    displayProductDetails(product);
    updateBreadcrumb(product);

    // Load "You Might Also Like" from same category
    loadRelatedProducts(product);
}

// ============================================================
// FIND PRODUCT BY ID
// ============================================================
async function findProductById(productId, requestedCategory) {
    try {
        // Fetch from new Express backend API
        const response = await fetch(`https://e-commerce-backend-4rnw.onrender.com/api/products/${productId}`);
        if (response.ok) {
            const product = await response.json();
            product._listingCategory = requestedCategory || product.category;
            return product;
        } else {
            console.warn(`API returned ${response.status} for product ${productId}. Is the backend running?`);
        }
    } catch (e) {
        console.error('findProductById error (Are you running the server?):', e);
    }
    return null;
}

function getStoredProducts(key) {
    try {
        const items = JSON.parse(localStorage.getItem(key)) || [];
        return Array.isArray(items) ? items : [];
    } catch (error) {
        console.error(`Unable to read ${key}:`, error);
        return [];
    }
}

function getLocalStorageSearchKeys(requestedCategory) {
    const keys = ['products'];

    if (requestedCategory && categoryStorageKeyMap[requestedCategory]) {
        keys.unshift(categoryStorageKeyMap[requestedCategory]);
    }

    return [...new Set(keys)];
}

function normalizeFoundProduct(product, sourceKey, requestedCategory) {
    return {
        ...product,
        _sourceFile: `localStorage:${sourceKey}`,
        _listingCategory: requestedCategory || product._listingCategory || product.category
    };
}

function findProductInLocalStorage(productId, requestedCategory) {
    const normalizedId = String(productId);
    const keys = getLocalStorageSearchKeys(requestedCategory);

    for (const key of keys) {
        const items = getStoredProducts(key);
        const found = items.find((product) => String(product.id) === normalizedId);
        if (found) {
            return normalizeFoundProduct(found, key, requestedCategory);
        }
    }

    return null;
}

async function findProductInFile(file, productId, forcedCategory) {
    const res = await fetch(file);
    if (!res.ok) return null;

    const text = await res.text();
    if (!text.trim()) return null;

    const products = JSON.parse(text);
    const found = products.find(p => String(p.id) === String(productId));

    if (!found) return null;

    return {
        ...found,
        _sourceFile: file,
        _listingCategory: forcedCategory || getListingCategoryFromFile(file, found)
    };
}

// ============================================================
// DISPLAY PRODUCT
// ============================================================
function displayProductDetails(product) {
    document.title = product.name + ' — Casa';

    document.getElementById('product-name').textContent  = product.name;
    document.getElementById('product-price').textContent = `$${Number(product.price).toFixed(2)}`;

    // Description — use JSON field if available
    if (product.description) {
        document.getElementById('product-description').innerHTML = `<p>${product.description}</p>`;
    }

    // Rating — use real data from backend
    const rating = product.rating || 0;
    const count  = product.numReviews || 0;
    renderStars(rating);
    const ratingCountEl = document.getElementById('rating-count');
    ratingCountEl.textContent = `(${count})`;

    // Load the reviews section
    const productId = product._id || product.customId || product.id;
    loadProductReviews(productId);

    // Link stars to the reviews page
    const starsContainer = document.getElementById('product-stars');
    if (starsContainer) {
        starsContainer.style.cursor = 'pointer';
        starsContainer.onclick = () => {
            const productId = product._id || product.id || product.customId;
            const params = new URLSearchParams(window.location.search);
            const gender = params.get('gender') || 'women';
            const cat = product._listingCategory || product.category || params.get('category') || '';
            window.location.href = `reviews.html?id=${productId}&gender=${gender}&category=${cat}`;
        };
    }
    
    // Also make rating count clickable
    ratingCountEl.style.cursor = 'pointer';
    ratingCountEl.onclick = starsContainer.onclick;

    const images = getProductImages(product);

    // Main image
    const mainImg  = document.getElementById('main-product-image');
    mainImg.src    = images[0];
    mainImg.alt    = product.name;

    // Thumbnails
    displayThumbnails(images);

    hideLoading();
}

function getProductImages(product) {
    // First, try to use the product's own images from JSON data
    if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images;
    }

    // Fallback to single image property if available
    if (product.image) {
        return [product.image];
    }

    // Last resort, use gallery images
    const gallery = categoryGalleryMap[product.category] || [];
    if (gallery.length > 0) {
        const numericId = Number(product.id) || 1;
        const startIndex = Math.abs(numericId - 1) % gallery.length;
        return [
            ...gallery.slice(startIndex),
            ...gallery.slice(0, startIndex)
        ];
    }

    return ['../images/f1.jpg'];
}

// ============================================================
// RENDER STARS
// ============================================================
function renderStars(rating) {
    const container = document.getElementById('product-stars');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        if (i <= Math.floor(rating)) {
            star.className = 'fas fa-star';
        } else if (i - rating < 1 && i - rating > 0) {
            star.className = 'fas fa-star-half-alt';
        } else {
            star.className = 'far fa-star empty';
        }
        container.appendChild(star);
    }
}

// ============================================================
// THUMBNAILS
// ============================================================
function displayThumbnails(images) {
    const container = document.getElementById('thumbnail-container');
    container.innerHTML = '';

    images.forEach((src, i) => {
        const thumb = document.createElement('div');
        thumb.className = `thumbnail${i === 0 ? ' active' : ''}`;
        thumb.innerHTML = `<img src="${src}" alt="View ${i + 1}">`;
        thumb.addEventListener('click', () => changeMainImage(src, thumb));
        container.appendChild(thumb);
    });
}

function changeMainImage(src, thumbEl) {
    const mainImg       = document.getElementById('main-product-image');
    mainImg.style.opacity = '0';
    setTimeout(() => { mainImg.src = src; mainImg.style.opacity = '1'; }, 150);
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbEl.classList.add('active');
}

// ============================================================
// BREADCRUMB
// ============================================================
function updateBreadcrumb(product) {
    // Product name
    const name = document.getElementById('breadcrumb-product');
    if (name) name.textContent = product.name;

    // Category link
    const catLink = document.getElementById('breadcrumb-category-link');
    const listingCategory = product._listingCategory || product.category;
    if (catLink && listingCategory) {
        const label = getCategoryLabel(listingCategory);
        const params = new URLSearchParams(window.location.search);
        const gender = params.get('gender') || 'women';
        catLink.textContent = label;
        catLink.href = `products.html?gender=${gender}&category=${listingCategory}`;
    }
}

// ============================================================
// SIZE SELECTION
// ============================================================
function initializeSizeSelection() {
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSize = btn.dataset.size;
            // Remove any size warning
            const warn = document.querySelector('.size-warning');
            if (warn) warn.remove();
        });
    });
}

// ============================================================
// ADD TO CART
// ============================================================
function initializeAddToCart() {
    const btn = document.getElementById('add-to-cart-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        if (!selectedSize) {
            showSizeWarning();
            return;
        }
        addProductToCart();
    });
}

function showSizeWarning() {
    if (document.querySelector('.size-warning')) return;
    const warn = document.createElement('p');
    warn.className = 'size-warning';
    warn.textContent = 'Please select a size';
    warn.style.cssText = 'color:#c0392b;font-size:13px;margin-top:6px;';
    document.querySelector('.size-selection').appendChild(warn);
    setTimeout(() => warn.remove(), 3000);
}

function addProductToCart() {
    if (!currentProduct || !selectedSize) return;

    let cart = getCurrentUserCart();
    
    const cId = currentProduct._id || currentProduct.id || currentProduct.customId;
    const existing = cart.find(i => {
        const iId = i._id || i.id || i.customId;
        return iId == cId && i.size === selectedSize && i.name === currentProduct.name;
    });
    
    const params = new URLSearchParams(window.location.search);
    const gender = params.get('gender') || currentProduct._gender || 'women';

    if (existing) {
        existing.quantity += selectedQuantity;
    } else {
        cart.push({
            id:       cId,
            name:     currentProduct.name,
            price:    currentProduct.price,
            image:    Array.isArray(currentProduct.images) ? currentProduct.images[0] : (currentProduct.image || ''),
            size:     selectedSize,
            quantity: selectedQuantity,
            category: currentProduct.category,
            gender
        });
    }

    saveCurrentUserCart(cart);
    updateCartCount();
    showCartSuccess();
}

function showCartSuccess() {
    const btn = document.getElementById('add-to-cart-btn');
    const orig = btn.textContent;
    btn.classList.add('success');
    btn.textContent = '✓ ADDED TO CART';
    setTimeout(() => { btn.classList.remove('success'); btn.textContent = orig; }, 2000);
}

function updateCartCount() {
    const cart  = typeof getCurrentUserCart === 'function' ? getCurrentUserCart() : [];
    const total = cart.reduce((s, i) => s + i.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = total);
}

function initializeQuantityControl() {
    const decreaseBtn = document.getElementById('quantity-decrease');
    const increaseBtn = document.getElementById('quantity-increase');
    const valueEl = document.getElementById('quantity-value');
    if (!decreaseBtn || !increaseBtn || !valueEl) return;

    function syncQuantity() {
        valueEl.textContent = String(selectedQuantity);
        decreaseBtn.disabled = selectedQuantity <= 1;
    }

    decreaseBtn.addEventListener('click', () => {
        if (selectedQuantity > 1) {
            selectedQuantity -= 1;
            syncQuantity();
        }
    });

    increaseBtn.addEventListener('click', () => {
        selectedQuantity += 1;
        syncQuantity();
    });

    syncQuantity();
}

// ============================================================
// YOU MIGHT ALSO LIKE
// ============================================================
async function loadRelatedProducts(product) {
    const section = document.getElementById('you-might-like');
    const grid    = document.getElementById('related-products-grid');
    if (!section || !grid) return;

    try {
        const gender = product.gender || 'women';
        const category = product.category || 'general';
        const res = await fetch(`https://e-commerce-backend-4rnw.onrender.com/api/products?gender=${encodeURIComponent(gender)}&category=${encodeURIComponent(category)}`);
        
        if (!res.ok) return;

        const allProducts = await res.json();
        
        const listingCategory = product.category || 'general';

        // Add mapping fields to make card build work cleanly
        const all = allProducts.map(item => ({
            ...item,
            _listingCategory: listingCategory,
            _gender: gender
        }));

        // Exclude current product, take up to 10 in original order
        const others = all
            .filter(p => p._id !== product._id && String(p.customId) !== String(product.customId))
            .slice(0, 10);

        if (others.length === 0) return;

        grid.innerHTML = others.map(p => buildRelatedCard(p)).join('');

        // Show section
        section.style.display = 'block';

        // Wishlist toggle
        grid.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                if (!window.WishlistStore) return;
                const payload = {
                    id: Number(btn.dataset.id) || btn.dataset.id,
                    name: btn.dataset.name,
                    price: Number(btn.dataset.price),
                    image: btn.dataset.image,
                    category: btn.dataset.category,
                    gender: btn.dataset.gender
                };
                const saved = window.WishlistStore.toggleItem(payload);
                btn.classList.toggle('active', saved);
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.className = `${saved ? 'fas' : 'far'} fa-heart`;
                }
            });
        });

    } catch (e) {
        console.error('loadRelatedProducts error:', e);
    }
}

function buildRelatedCard(product) {
    const resolvedImages = getProductImages(product);
    const img = resolvedImages[0] || product.image || '../images/f1.jpg';
    const listingCategory = product._listingCategory || product.category;
    const gender = product._gender || 'women';
    const actualId = product.customId || product._id || product.id;
    const url = `product-details.html?id=${actualId}&gender=${encodeURIComponent(gender)}&category=${encodeURIComponent(listingCategory)}`;
    const isSaved = window.WishlistStore
        ? window.WishlistStore.isSaved({ id: actualId, category: listingCategory, gender })
        : false;

    // Support optional sale price
    let priceHtml = '';
    if (product.salePrice) {
        const discount = Math.round((1 - product.salePrice / product.price) * 100);
        priceHtml = `
            <span class="sale-price">$${Number(product.salePrice).toFixed(2)}</span>
            <span class="discount-pct">(-${discount}%)</span>
            <span class="original-price">$${Number(product.price).toFixed(2)}</span>`;
    } else {
        priceHtml = `<span>$${Number(product.price).toFixed(2)}</span>`;
    }

    return `
        <a href="${url}" class="related-product-card">
            <div class="related-img-wrapper">
                <img src="${img}" alt="${product.name}" class="related-product-img"
                     onerror="this.src='../images/f1.jpg'">
                <button class="wishlist-btn${isSaved ? ' active' : ''}" title="Save"
                    data-id="${actualId}"
                    data-name="${product.name.replace(/"/g, '&quot;')}"
                    data-price="${product.price}"
                    data-image="${img}"
                    data-category="${listingCategory}"
                    data-gender="${gender}">
                    <i class="${isSaved ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="related-product-info">
                <p class="related-price">${priceHtml}</p>
                <p class="related-name">${product.name}</p>
            </div>
        </a>`;
}

function getListingCategoryFromFile(file, product) {
    const match = Object.entries(categoryFileMap).find(([, value]) => value === file);
    return match ? match[0] : product.category;
}

function getCategoryLabel(category) {
    return categoryLabelMap[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
}

function initSavedItemsLink() {
    const heartLink = document.querySelector('.heart-icon');
    if (heartLink) {
        heartLink.href = 'saved-items.html';
    }
}

// ============================================================
// LOADING / ERROR
// ============================================================
function showLoading() {
    document.getElementById('product-detail-wrapper').style.display = 'none';
    const s = getStatus();
    s.className = 'loading';
    s.textContent = 'Loading product…';
    s.style.display = 'flex';
}

function hideLoading() {
    const s = getStatus();
    s.style.display = 'none';
    document.getElementById('product-detail-wrapper').style.display = 'grid';
}

function showError(msg) {
    document.getElementById('product-detail-wrapper').style.display = 'none';
    const s = getStatus();
    s.className = 'error';
    s.textContent = msg;
    s.style.display = 'flex';
}

function getStatus() {
    let el = document.getElementById('product-details-status');
    if (!el) {
        el = document.createElement('div');
        el.id = 'product-details-status';
        document.querySelector('.product-details-container').appendChild(el);
    }
    return el;
}

// ============================================================
// KEYBOARD & SWIPE NAVIGATION
// ============================================================
document.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const thumbs  = document.querySelectorAll('.thumbnail');
    const active  = document.querySelector('.thumbnail.active');
    if (!active || !thumbs.length) return;

    let idx = Array.from(thumbs).indexOf(active);
    idx = e.key === 'ArrowLeft'
        ? (idx > 0 ? idx - 1 : thumbs.length - 1)
        : (idx < thumbs.length - 1 ? idx + 1 : 0);

    const next = thumbs[idx];
    changeMainImage(next.querySelector('img').src, next);
});

let touchStartX = 0;
document.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
document.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) < 50) return;
    const thumbs = document.querySelectorAll('.thumbnail');
    const active = document.querySelector('.thumbnail.active');
    if (!active || !thumbs.length) return;
    let idx = Array.from(thumbs).indexOf(active);
    idx = diff > 0
        ? (idx < thumbs.length - 1 ? idx + 1 : 0)
        : (idx > 0 ? idx - 1 : thumbs.length - 1);
    const next = thumbs[idx];
    changeMainImage(next.querySelector('img').src, next);
});

// ============================================================
// REVIEWS — Fetch, Render, Submit
// ============================================================
const REVIEW_API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5001/api/reviews'
    : 'https://e-commerce-backend-4rnw.onrender.com/api/reviews';

async function loadProductReviews(productId) {
    if (!productId) return;
    try {
        const res = await fetch(`${REVIEW_API}/${productId}`);
        if (!res.ok) return;
        const reviews = await res.json();
        renderReviewsSummary(reviews);
        renderReviewCards(reviews);
        document.getElementById('product-reviews-section').style.display = 'block';
    } catch (e) {
        console.error('Error loading reviews:', e);
        // Still show section with 0 reviews
        document.getElementById('product-reviews-section').style.display = 'block';
    }
}

function getStarsHtml(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) html += '<i class="fas fa-star" style="color:#f4a11b"></i>';
        else if (i - rating < 1 && i - rating > 0) html += '<i class="fas fa-star-half-alt" style="color:#f4a11b"></i>';
        else html += '<i class="far fa-star" style="color:#ddd"></i>';
    }
    return html;
}

function renderReviewsSummary(reviews) {
    const count = reviews.length;
    document.getElementById('pd-total-reviews').textContent = `(${count} Review${count !== 1 ? 's' : ''})`;

    if (count === 0) {
        document.getElementById('pd-average-rating').textContent = '0';
        document.getElementById('pd-rating-bars').innerHTML = '';
        document.getElementById('pd-latest-review').innerHTML = '<p style="color:#999;font-size:13px;">No reviews yet. Be the first!</p>';
        return;
    }

    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    const avg = (sum / count).toFixed(1);
    document.getElementById('pd-average-rating').textContent = avg;

    // Rating bars
    const counts = [0, 0, 0, 0, 0, 0];
    reviews.forEach(r => { counts[Math.floor(r.rating)]++; });
    let barsHtml = '';
    for (let i = 5; i >= 1; i--) {
        const pct = (counts[i] / count) * 100;
        barsHtml += `
            <div class="rating-bar-row">
                <span class="bar-label"><i class="fas fa-star" style="color:#f4a11b;font-size:11px;"></i> ${i}</span>
                <div class="bar-bg"><div class="bar-fill" style="width:${pct}%"></div></div>
            </div>`;
    }
    document.getElementById('pd-rating-bars').innerHTML = barsHtml;

    // Latest review preview
    const latest = reviews[0];
    const authorName = latest.author || (latest.user ? `${latest.user.firstName} ${latest.user.lastName}` : 'Anonymous');
    const dateStr = latest.createdAt ? new Date(latest.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    document.getElementById('pd-latest-review').innerHTML = `
        <div class="preview-card">
            <div class="preview-header">
                <strong>${authorName}</strong>
                <span class="preview-date">${dateStr}</span>
            </div>
            <div class="preview-stars">${getStarsHtml(latest.rating)}</div>
            <p class="preview-comment">"${latest.comment}"</p>
        </div>`;
}

function renderReviewCards(reviews) {
    const container = document.getElementById('pd-reviews-list');
    if (reviews.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:30px;color:#999;">No reviews yet.</p>';
        return;
    }
    container.innerHTML = reviews.map(r => {
        const authorName = r.author || (r.user ? `${r.user.firstName} ${r.user.lastName}` : 'Anonymous');
        const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
        return `
            <div class="pd-review-card">
                <div class="pd-review-top">
                    <div class="pd-review-stars">${getStarsHtml(r.rating)}</div>
                    <span class="pd-review-date">${dateStr}</span>
                </div>
                <h4 class="pd-review-title">${r.title || ''}</h4>
                <p class="pd-review-body">${r.comment}</p>
                <p class="pd-review-author">— ${authorName}</p>
            </div>`;
    }).join('');
}

function initReviewModal() {
    const modal = document.getElementById('pd-review-modal');
    const openBtn = document.getElementById('pd-open-review-modal');
    const closeBtn = document.getElementById('pd-close-review-modal');
    if (!modal || !openBtn || !closeBtn) return;

    openBtn.addEventListener('click', () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please sign in to write a review.');
            window.location.href = 'login.html';
            return;
        }
        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    // Star selection inside modal
    document.querySelectorAll('#pd-modal-stars i').forEach(star => {
        star.addEventListener('click', () => {
            const val = star.getAttribute('data-val');
            document.getElementById('pd-review-rating-input').value = val;
            document.querySelectorAll('#pd-modal-stars i').forEach(s => {
                s.className = s.getAttribute('data-val') <= val ? 'fas fa-star' : 'far fa-star';
            });
        });
    });

    // Submit
    document.getElementById('pd-write-review-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const rating = document.getElementById('pd-review-rating-input').value;
        const title = document.getElementById('pd-review-title').value;
        const comment = document.getElementById('pd-review-comment').value;
        const token = localStorage.getItem('token');

        if (!rating) { alert('Please select a star rating.'); return; }

        const productId = currentProduct ? (currentProduct._id || currentProduct.customId || currentProduct.id) : null;
        if (!productId) { alert('Product not found.'); return; }

        const btn = document.getElementById('pd-submit-review-btn');
        btn.textContent = 'Submitting...';
        btn.disabled = true;

        try {
            const res = await fetch(REVIEW_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ productId: String(productId), rating: Number(rating), title, comment })
            });
            const data = await res.json();
            if (res.ok) {
                modal.classList.remove('active');
                // Reload reviews
                loadProductReviews(String(productId));
                // Reset form
                document.getElementById('pd-write-review-form').reset();
                document.querySelectorAll('#pd-modal-stars i').forEach(s => s.className = 'far fa-star');
                document.getElementById('pd-review-rating-input').value = '';
            } else {
                alert(data.message || 'Failed to submit review.');
            }
        } catch (err) {
            console.error(err);
            alert('Network error. Please try again.');
        } finally {
            btn.textContent = 'Submit Review';
            btn.disabled = false;
        }
    });
}
