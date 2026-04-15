// 🔥 ADD THIS AT THE TOP OF products.js
async function fetchWithRetry(url, retries = 3) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    return res;
  } catch (err) {
    if (retries > 0) {
      console.log('Retrying...', retries);
      await new Promise(r => setTimeout(r, 2000));
      return fetchWithRetry(url, retries - 1);
    }
    throw err;
  }
}



// Fetch and display products on the products page
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

let currentProducts = [];
let currentCategoryKey = '';
let currentSortOrder = 'recommended';

// Category to JSON file mapping
const categoryFileMap = {
    // New In categories
    'dresses': '../Data/Women/New-in/dresses.json',
    'tops': '../Data/Women/New-in/tops.json',
    'jumpers': '../Data/Women/New-in/jumpers.json',
    'jeans-trousers': '../Data/Women/New-in/jeans-trousers.json',
    'hoodies': '../Data/Women/New-in/hoodies.json',
    'today': '../Data/Women/New-in/dresses.json', // Same as dresses for now
    'selling-fast': '../Data/Women/New-in/tops.json', // Same as tops for now
    
    // Clothing categories
    'jeans': '../Data/Women/Clothing/jeans.json',
    'tops-clothing': '../Data/Women/Clothing/tops.json',
    'jumpers-cardigans': '../Data/Women/Clothing/jumpers-cardigans.json',
    'blouses': '../Data/Women/Clothing/blouses.json',
    'coats-jackets': '../Data/Women/Clothing/coats-Jackets.json',
    'nightwear': '../Data/Women/Clothing/nightwear.json',
    'occasion-dresses': '../Data/Women/Clothing/occasion-dresses.json',
    'shirts': '../Data/Women/Clothing/shirts.json',
    'shorts-clothing': '../Data/Women/Clothing/shorts.json',
    'skirts': '../Data/Women/Clothing/skirts.json',
    'suits-tailoring': '../Data/Women/Clothing/suits-Tailoring.json',
    'swimwear-beachwear': '../Data/Women/Clothing/swimwear-beachwear.json',
    'trousers': '../Data/Women/Clothing/trousers.json',
    'wedding-dresses': '../Data/Women/Clothing/wedding-dresses.json',

    // Shoes categories
    'boots': '../Data/Women/Shoes/Boots.json',
    'ballet-pumps': '../Data/Women/Shoes/ballet-pumps.json',
    'sandals': '../Data/Women/Shoes/Sandals.json',
    'heels': '../Data/Women/Shoes/Heels.json',
    'adidas': '../Data/Women/Shoes/addidas.json',
    'birkenstock': '../Data/Women/Shoes/birkenstock.json',
    'asos-design': '../Data/Women/Shoes/asos-design.json',
    'balenciaga': '../Data/Women/Shoes/balenciaga.json',
    'puma': '../Data/Women/Shoes/Puma.json',

    // Face + Body categories
    'facebody-makeup': '../Data/Women/Face+Body/makeup.json',
    'facebody-skin-care': '../Data/Women/Face+Body/skin-care.json',
    'facebody-hair-care': '../Data/Women/Face+Body/hair-care.json',
    'facebody-body-care': '../Data/Women/Face+Body/body-care.json',
    'facebody-suncare-tanning': '../Data/Women/Face+Body/suncare-tranning.json',
    'facebody-tools-accessories': '../Data/Women/Face+Body/tools-accessories.json',
    'facebody-hottest-drop': '../Data/Women/Face+Body/makeup.json',
    'facebody-up-to-40-off': '../Data/Women/Face+Body/makeup.json',
    'facebody-beauty-gifts': '../Data/Women/Face+Body/makeup.json',

    // Activewear categories
    'activewear-trainers': '../Data/Women/Activewear/trainers.json',
    'activewear-tops': '../Data/Women/Activewear/tops-activewear.json',
    'activewear-sports-bras': '../Data/Women/Activewear/sports-bras.json',
    'activewear-shorts': '../Data/Women/Activewear/shorts.json',
    'activewear-hoodies-sweatshirts': '../Data/Women/Activewear/hoodies-sweatshirts.json',
    'activewear-addidas': '../Data/Women/Activewear/addidas-activewear.json',
    'activewear-jackets': '../Data/Women/Activewear/jackets.json',

    // Accessories categories
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

    // Men New In categories
    'new-in-t-shirts': '../Data/Men/New-in/t-shirts.json',
    'new-in-hoodies-sweatshirts': '../Data/Men/New-in/hoodies-sweatshirts.json',
    'new-in-jeans-trousers': '../Data/Men/New-in/jeans-trousers.json',
    'new-in-underwear': '../Data/Men/New-in/underwear.json',
    'new-in-jumpers': '../Data/Men/New-in/jumpers.json',
    'new-in-today': '../Data/Men/New-in/t-shirts.json',

    // Men clothing categories
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

    // Men shoes categories
    'shoes-trainers': '../Data/Men/Shoes/trainers.json',
    'shoes-boots': '../Data/Men/Shoes/boots.json',
    'shoes-sandals': '../Data/Men/Shoes/sandals.json',
    'shoes-sliders': '../Data/Men/Shoes/sliders.json',
    'shoes-loafers': '../Data/Men/Shoes/loafers.json',
    'shoes-adidas': '../Data/Men/Shoes/adidas.json',
    'shoes-balenciaga-on': '../Data/Men/Shoes/balenciaga-on.json',
    'shoes-new-in': '../Data/Men/Shoes/trainers.json',

    // Men face + body categories
    'men-facebody-skincare': '../Data/Men/Face+Body/skincare.json',
    'men-facebody-hair-care': '../Data/Men/Face+Body/hair-care.json',
    'men-facebody-body-care': '../Data/Men/Face+Body/body-care.json',
    'men-facebody-fragrance': '../Data/Men/Face+Body/fragrance.json',
    'men-facebody-tools-accessories': '../Data/Men/Face+Body/tools-accessories.json',
    'men-facebody-up-to-40-off': '../Data/Men/Face+Body/skincare.json',

    // Men activewear categories
    'men-activewear-tops-on': '../Data/Men/Activewear/tops-on.json',
    'men-activewear-shorts-on': '../Data/Men/Activewear/shorts-on.json',
    'men-activewear-jackets-on': '../Data/Men/Activewear/jackets-on.json',
    'men-activewear-ski-snowboard': '../Data/Men/Activewear/ski-snowboard.json',
    'men-activewear-trousers-tights': '../Data/Men/Activewear/trousers-tights.json',
    'men-activewear-hoodies-activewear': '../Data/Men/Activewear/hoodies-activewear.json',
    'men-activewear-active-accessories': '../Data/Men/Activewear/active-accessories.json',

    // Men accessories categories
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

const newInCategoryKeys = [
    'dresses',
    'tops',
    'jumpers',
    'jeans-trousers',
    'hoodies',
    'today',
    'selling-fast'
];

const clothingCategoryKeys = [
    'shorts-clothing',
    'jumpers-cardigans',
    'jeans',
    'blouses',
    'suits-tailoring',
    'wedding-dresses',
    'nightwear',
    'occasion-dresses',
    'coats-jackets',
    'swimwear-beachwear',
    'trousers',
    'skirts',
    'shirts',
    'modest-fashion',
    'tops-clothing'
];

const shoeCategoryKeys = [
    'boots',
    'ballet-pumps',
    'sandals',
    'heels',
    'adidas',
    'birkenstock',
    'asos-design',
    'balenciaga',
    'puma'
];

const faceBodyCategoryKeys = [
    'facebody-makeup',
    'facebody-skin-care',
    'facebody-hair-care',
    'facebody-body-care',
    'facebody-suncare-tanning',
    'facebody-tools-accessories',
    'facebody-hottest-drop',
    'facebody-up-to-40-off',
    'facebody-beauty-gifts'
];

const activewearCategoryKeys = [
    'activewear-trainers',
    'activewear-tops',
    'activewear-sports-bras',
    'activewear-shorts',
    'activewear-hoodies-sweatshirts',
    'activewear-addidas',
    'activewear-jackets'
];

const accessoriesProductCategoryKeys = [
    'accessories-sunglasses',
    'accessories-belts',
    'accessories-caps',
    'accessories-gloves',
    'accessories-hair-accessories',
    'accessories-new-in'
];

const accessoriesBagCategoryKeys = [
    'accessories-cross-body-bags',
    'accessories-tote-bags',
    'accessories-travel-bags',
    'accessories-shoulder-bags',
    'accessories-clutches'
];

const accessoriesJewelleryCategoryKeys = [
    'accessories-earrings',
    'accessories-necklaces',
    'accessories-rings',
    'accessories-bracelets'
];

const accessoriesCategoryKeys = [
    ...accessoriesProductCategoryKeys,
    ...accessoriesBagCategoryKeys,
    ...accessoriesJewelleryCategoryKeys
];

const menNewInCategoryKeys = [
    'new-in-t-shirts',
    'new-in-hoodies-sweatshirts',
    'new-in-jeans-trousers',
    'new-in-underwear',
    'new-in-jumpers',
    'new-in-today'
];

const menClothingCategoryKeys = [
    'men-shorts',
    'men-jumpers-cardigans',
    'men-coats-jackets',
    'men-trousers-chinos',
    'men-joggers',
    'men-swimwear',
    'men-jeans',
    'men-cargo-trousers',
    'men-suits-tailoring',
    'men-socks',
    'men-casual-shirts',
    'men-underwear-clothing'
];

const menShoeCategoryKeys = [
    'shoes-trainers',
    'shoes-boots',
    'shoes-sandals',
    'shoes-sliders',
    'shoes-loafers',
    'shoes-adidas',
    'shoes-balenciaga-on',
    'shoes-new-in'
];

const menFaceBodyCategoryKeys = [
    'men-facebody-skincare',
    'men-facebody-hair-care',
    'men-facebody-body-care',
    'men-facebody-fragrance',
    'men-facebody-tools-accessories',
    'men-facebody-up-to-40-off'
];

const menActivewearCategoryKeys = [
    'men-activewear-tops-on',
    'men-activewear-shorts-on',
    'men-activewear-jackets-on',
    'men-activewear-ski-snowboard',
    'men-activewear-trousers-tights',
    'men-activewear-hoodies-activewear',
    'men-activewear-active-accessories'
];

const menAccessoriesProductCategoryKeys = [
    'men-accessories-product-view-all',
    'men-accessories-sunglasses',
    'men-accessories-watches',
    'men-accessories-belts',
    'men-accessories-ties',
    'men-accessories-cap-hats',
    'men-accessories-gloves',
    'men-accessories-accessories-on'
];

const menAccessoriesBagCategoryKeys = [
    'men-accessories-bags-view-all-bags',
    'men-accessories-bags-wallets',
    'men-accessories-bags-backpacks',
    'men-accessories-bags-travel-bags-on',
    'men-accessories-bags-bum-bags',
    'men-accessories-bags-shopper-bags'
];

const menAccessoriesJewelleryCategoryKeys = [
    'men-accessories-jewellery-view-all-jewellery',
    'men-accessories-jewellery-earrings',
    'men-accessories-jewellery-necklaces',
    'men-accessories-jewellery-rings',
    'men-accessories-jewellery-bracelets',
    'men-accessories-jewellery-plated-sterling-on'
];

const menAccessoriesCategoryKeys = [
    ...menAccessoriesProductCategoryKeys,
    ...menAccessoriesBagCategoryKeys,
    ...menAccessoriesJewelleryCategoryKeys
];

const categoryLabelMap = {
    'newin': 'New In Clothing',
    'clothing': 'Clothing',
    'dresses': 'Dresses',
    'tops': 'Tops',
    'jumpers': 'Jumpers',
    'jeans-trousers': 'Jeans & Trousers',
    'hoodies': 'Hoodies',
    'today': 'New In: Today',
    'selling-fast': 'Selling Fast',
    'shorts-clothing': 'Shorts',
    'jumpers-cardigans': 'Jumpers & Cardigans',
    'jeans': 'Jeans',
    'blouses': 'Blouses',
    'suits-tailoring': 'Suits & Tailoring',
    'wedding-dresses': 'Wedding Dresses',
    'nightwear': 'Nightwear',
    'occasion-dresses': 'Occasion Dresses',
    'coats-jackets': 'Coats & Jackets',
    'swimwear-beachwear': 'Swimwear & Beachwear',
    'trousers': 'Trousers',
    'skirts': 'Skirts',
    'shirts': 'Shirts',
    'tops-clothing': 'Tops',
    'shoes': 'Shoes',
    'boots': 'Boots',
    'ballet-pumps': 'Ballet Pumps',
    'sandals': 'Sandals',
    'heels': 'Heels',
    'adidas': 'Adidas',
    'birkenstock': 'Birkenstock',
    'asos-design': 'Asos Design',
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

const sectionContentMap = {
    newin: {
        sectionLabel: 'New In',
        currentLabel: 'New In: Clothing',
        title: 'New In Clothing for Women',
        description: "Want to update your wardrobe with the latest styles? Our edit of women's clothing brings together just dropped new-in pieces, all in one place. Shop ASOS DESIGN for everything from staples to standout pieces."
    },
    clothing: {
        sectionLabel: 'Clothing',
        currentLabel: 'All Clothing',
        title: 'Clothing for Women',
        description: "Browse the full women's clothing edit in one place, from everyday staples to dressier pieces. Use the clothing mega menu to jump straight into each category and shop the latest 24-product drops."
    },
    shoes: {
        sectionLabel: 'Shoes',
        currentLabel: 'All Shoes',
        title: 'Shoes for Women',
        description: "Browse the full women's shoes edit in one place, from everyday pairs to statement styles. Use the shoes mega menu to jump straight into each category and shop the latest 24-product drops."
    },
    facebody: {
        sectionLabel: 'Face + Body',
        currentLabel: 'All Face + Body',
        title: 'Face + Body for Women',
        description: "Browse the full women's face and body edit in one place, from makeup staples to skincare, haircare, and tools. Use the face + body mega menu to jump straight into each category and shop the latest 24-product drops."
    },
    activewear: {
        sectionLabel: 'Activewear',
        currentLabel: 'All Activewear',
        title: 'Activewear for Women',
        description: "Browse the full women's activewear edit in one place, from trainers and sports bras to hoodies, jackets, and branded performance gear. Use the activewear mega menu to jump straight into each category and shop the latest 24-product drops."
    },
    accessories: {
        sectionLabel: 'Accessories',
        currentLabel: 'All Accessories',
        title: 'Accessories for Women',
        description: "Browse the full women's accessories edit in one place, from everyday add-ons to bags and jewellery. Use the accessories mega menu to jump straight into each category and shop the latest 24-product drops."
    }
};

// All JSON files for "View All" functionality
const allNewInFiles = [
    '../Data/Women/New-in/dresses.json',
    '../Data/Women/New-in/tops.json',
    '../Data/Women/New-in/jumpers.json',
    '../Data/Women/New-in/jeans-trousers.json',
    '../Data/Women/New-in/hoodies.json'
];

const allClothingFiles = clothingCategoryKeys.map(category => categoryFileMap[category]);
const allShoeFiles = shoeCategoryKeys.map(category => categoryFileMap[category]);
const allFaceBodyFiles = [
    categoryFileMap['facebody-makeup'],
    categoryFileMap['facebody-skin-care'],
    categoryFileMap['facebody-hair-care'],
    categoryFileMap['facebody-body-care'],
    categoryFileMap['facebody-suncare-tanning'],
    categoryFileMap['facebody-tools-accessories']
];
const allActivewearFiles = activewearCategoryKeys.map(category => categoryFileMap[category]);
const allAccessoriesProductFiles = [
    categoryFileMap['accessories-sunglasses'],
    categoryFileMap['accessories-belts'],
    categoryFileMap['accessories-caps'],
    categoryFileMap['accessories-gloves'],
    categoryFileMap['accessories-hair-accessories']
];
const allAccessoriesBagFiles = accessoriesBagCategoryKeys.map(category => categoryFileMap[category]);
const allAccessoriesJewelleryFiles = accessoriesJewelleryCategoryKeys.map(category => categoryFileMap[category]);
const allAccessoriesFiles = [
    ...allAccessoriesProductFiles,
    ...allAccessoriesBagFiles,
    ...allAccessoriesJewelleryFiles
];
const allMenNewInFiles = [
    categoryFileMap['new-in-t-shirts'],
    categoryFileMap['new-in-hoodies-sweatshirts'],
    categoryFileMap['new-in-jeans-trousers'],
    categoryFileMap['new-in-underwear'],
    categoryFileMap['new-in-jumpers']
];
const allMenClothingFiles = menClothingCategoryKeys.map(category => categoryFileMap[category]);
const allMenShoeFiles = [
    categoryFileMap['shoes-trainers'],
    categoryFileMap['shoes-boots'],
    categoryFileMap['shoes-sandals'],
    categoryFileMap['shoes-sliders'],
    categoryFileMap['shoes-loafers'],
    categoryFileMap['shoes-adidas'],
    categoryFileMap['shoes-balenciaga-on']
];
const allMenFaceBodyFiles = [
    categoryFileMap['men-facebody-skincare'],
    categoryFileMap['men-facebody-hair-care'],
    categoryFileMap['men-facebody-body-care'],
    categoryFileMap['men-facebody-fragrance'],
    categoryFileMap['men-facebody-tools-accessories']
];
const allMenActivewearFiles = menActivewearCategoryKeys.map(category => categoryFileMap[category]);
const allMenAccessoriesProductFiles = [
    categoryFileMap['men-accessories-sunglasses'],
    categoryFileMap['men-accessories-watches'],
    categoryFileMap['men-accessories-belts'],
    categoryFileMap['men-accessories-ties'],
    categoryFileMap['men-accessories-cap-hats'],
    categoryFileMap['men-accessories-gloves'],
    categoryFileMap['men-accessories-accessories-on']
];
const allMenAccessoriesBagFiles = [
    categoryFileMap['men-accessories-bags-wallets'],
    categoryFileMap['men-accessories-bags-backpacks'],
    categoryFileMap['men-accessories-bags-travel-bags-on'],
    categoryFileMap['men-accessories-bags-bum-bags'],
    categoryFileMap['men-accessories-bags-shopper-bags']
];
const allMenAccessoriesJewelleryFiles = [
    categoryFileMap['men-accessories-jewellery-earrings'],
    categoryFileMap['men-accessories-jewellery-necklaces'],
    categoryFileMap['men-accessories-jewellery-rings'],
    categoryFileMap['men-accessories-jewellery-bracelets'],
    categoryFileMap['men-accessories-jewellery-plated-sterling-on']
];
const allMenAccessoriesFiles = [
    ...allMenAccessoriesProductFiles,
    ...allMenAccessoriesBagFiles,
    ...allMenAccessoriesJewelleryFiles
];

const fileToCategoryMap = Object.fromEntries(
    Object.entries(categoryFileMap).map(([category, file]) => [file, category])
);

function getLocalProducts(key) {
    try {
        const products = JSON.parse(localStorage.getItem(key)) || [];
        return Array.isArray(products) ? products : [];
    } catch (error) {
        console.error(`Unable to read ${key}:`, error);
        return [];
    }
}

const categoryGalleryMap = {
    'dresses': [
        '../images/product/women/dresses/DFM1.avif',
        '../images/product/women/dresses/PSG5.avif',
        '../images/product/women/dresses/PSG6.avif',
        '../images/product/women/dresses/PSG7.avif',
        '../images/product/women/dresses/PSG8.avif'
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

async function fetchProducts() {
    try {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search);
        const gender = params.get("gender") || 'women';
        const category = params.get("category") || (gender === 'men' ? 'new-in' : 'newin');
        const query = (params.get("q") || '').trim().toLowerCase();
        
        // Update page title based on category
        updatePageContent(category);
        
        const searchCatLower = category.toLowerCase();
        
        // Find the actual database category name using the categoryFileMap
        let dbCategory = searchCatLower;
        if (typeof categoryFileMap !== 'undefined' && categoryFileMap[searchCatLower]) {
            const filePath = categoryFileMap[searchCatLower];
            // Extract filename without .json
            const fileName = filePath.split('/').pop().replace('.json', '').toLowerCase();
            dbCategory = fileName;
        }

        const macroCategories = [
            'newin', 'clothing', 'shoes', 'activewear', 'accessories', 'facebody', 'new-in',
            'accessories-product', 'accessories-bags', 'accessories-jewellery'
        ];
        const isMacro = macroCategories.includes(searchCatLower);



        // FETCH FROM NEW BACKEND API
        let apiUrl = `https://e-commerce-backend-4rnw.onrender.com/api/products?gender=${gender}`;
        if (query) {
            apiUrl += `&query=${encodeURIComponent(query)}`;
        }
        
        if (isMacro) {
            // Map the macro category to the exact arrays of files that belong to it
            const isMen = gender === 'men';
            const macroFileMap = {
                'newin': isMen ? allMenNewInFiles : allNewInFiles,
                'new-in': isMen ? allMenNewInFiles : allNewInFiles,
                'clothing': isMen ? allMenClothingFiles : allClothingFiles,
                'shoes': isMen ? allMenShoeFiles : allShoeFiles,
                'facebody': isMen ? allMenFaceBodyFiles : allFaceBodyFiles,
                'activewear': isMen ? allMenActivewearFiles : allActivewearFiles,
                'accessories': isMen ? allMenAccessoriesFiles : allAccessoriesFiles,
                'accessories-product': isMen ? allMenAccessoriesProductFiles : allAccessoriesProductFiles,
                'accessories-bags': isMen ? allMenAccessoriesBagFiles : allAccessoriesBagFiles,
                'accessories-jewellery': isMen ? allMenAccessoriesJewelleryFiles : allAccessoriesJewelleryFiles
            };
            
            const categoryFiles = macroFileMap[searchCatLower] || [];
            
            // Extract all the subcategory database names and HTML aliases to perfectly query the DB
            const validCategories = categoryFiles.map(file => {
                if (!file) return null;
                const fileName = file.split('/').pop().replace('.json', '').toLowerCase();
                const htmlAlias = (typeof fileToCategoryMap !== 'undefined') ? fileToCategoryMap[file] : null;
                return htmlAlias && htmlAlias !== fileName ? `${htmlAlias},${fileName}` : fileName;
            }).filter(Boolean).join(',');
            
             // Map the macro category to the exact arrays of files that belong to it 
           

        
            
        } else {
            // Specific subcategory: Send both the HTML route and the database filename fallback
            const categoryKeys = searchCatLower === dbCategory ? searchCatLower : `${searchCatLower},${dbCategory}`;
            apiUrl += `&category=${encodeURIComponent(categoryKeys)}`;
        }
        
        // Note: For complex macro-categories (like 'clothing', 'newin') we could 
        // implement database-side filtering in the future. For now, since the frontend
        // has a robust mapping system, we fetch the gender data and filter locally 
        // if it's a specific subcategory.
        let products = [];
        
        try {
            const apiResponse = await fetchWithRetry(apiUrl);
            
            if (apiResponse.ok) {
                const apiData = await apiResponse.json();
                
                // If it is a direct subcategory string available in the DB, 
                // or if it's a macro-category, we would filter it.
                // For demonstration, we simply populate the API data directly if 
                // it returned successfully. A quick robust check:
                if (isMacro) {
                     // The user requested a macro category. Serve all this gender's products. 
                     products = apiData;
                } else {
                     // The backend already strictly filtered this to the given category, so just assign it.
                     products = apiData;
                }
            } else {
                console.warn('API returned non-OK status. Did you start the backend server?');
            }
        } catch (apiError) {
             console.error('Failed to connect to backend MongoDB API. Make sure the server is running on port 5001.', apiError);
             // Fallback behavior could be left here if needed
        }

        currentCategoryKey = category;
        currentProducts = [...products];
        renderProducts(getSortedProducts(products), category);
    } catch (error) {
        console.error('Error in fetchProducts logic:', error);
    }
}

function getSortedProducts(products) {
    const sortedProducts = [...products];

    if (currentSortOrder === 'whats-new') {
        sortedProducts.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
    } else if (currentSortOrder === 'price-high-to-low') {
        sortedProducts.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (currentSortOrder === 'price-low-to-high') {
        sortedProducts.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    return sortedProducts;
}

function rerenderCurrentProducts() {
    renderProducts(getSortedProducts(currentProducts), currentCategoryKey);
}

function updatePageContent(category) {
    const pageTitle = document.querySelector('title');
    const pageHeader = document.querySelector('.page-title');
    const pageDescription = document.getElementById('page-description');
    const breadcrumbCurrent = document.querySelector('.current');
    const breadcrumbSection = document.getElementById('breadcrumb-section-link');
    const breadcrumbGender = document.querySelector('.breadcrumb a[onclick^="navigateToGender"]');
    const chipsContainer = document.querySelector('.newin-chips');
    
    const gender = getCurrentGender();
    const audienceLabel = gender === 'men' ? 'Men' : 'Women';
    const sectionKey = getSectionForCategory(category);
    const sectionContent = sectionContentMap[sectionKey];
    const categoryLabel = getCategoryLabel(category);
    const isTopLevelCategory = ['newin', 'new-in', 'clothing', 'shoes', 'facebody', 'activewear', 'accessories'].includes(category);

    let titleText = sectionContent.title;
    let headerText = sectionContent.title;
    let breadcrumbText = sectionContent.currentLabel;
    let descriptionText = sectionContent.description;

    if (gender === 'men' && sectionKey === 'newin') {
        titleText = 'New In for Men';
        headerText = 'New In for Men';
        breadcrumbText = 'New In';
        descriptionText = "Browse the latest men's drops in one place, from everyday staples to fresh wardrobe updates. Use the men's new in mega menu to jump straight into each category and shop the newest edits.";
    }

    if (category && !isTopLevelCategory) {
        titleText = `${categoryLabel} for ${audienceLabel}`;
        headerText = `${categoryLabel} for ${audienceLabel}`;
        breadcrumbText = categoryLabel;
        descriptionText = `Shop ${gender === 'men' ? "men's" : "women's"} ${categoryLabel.toLowerCase()} in this dedicated edit. Each category pulls in its own 24-product collection so you can browse the full selection from the ${sectionContent.sectionLabel.toLowerCase()} mega menu.`;
    }
    
    if (pageTitle) {
        pageTitle.textContent = titleText;
    }
    
    if (pageHeader) {
        pageHeader.textContent = headerText;
    }
    
    if (pageDescription) {
        pageDescription.textContent = descriptionText;
    }

    if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = breadcrumbText;
    }

    if (breadcrumbGender) {
        breadcrumbGender.textContent = audienceLabel;
        breadcrumbGender.setAttribute('onclick', `navigateToGender('${gender}')`);
    }

    if (breadcrumbSection) {
        breadcrumbSection.textContent = sectionContent.sectionLabel;
        breadcrumbSection.href = `products.html?gender=${gender}&category=${getSectionCategory(sectionKey, gender)}`;
    }

    if (chipsContainer) {
        if (sectionKey === 'newin' && gender !== 'men') {
            chipsContainer.style.display = '';
            syncNewInChips(category);
        } else {
            chipsContainer.style.display = 'none';
        }
    }

    syncHeaderForGender(gender);
}

async function loadProductsFromFiles(files) {
    try {
        const productArrays = await Promise.all(files.map(file => loadProductsFromFile(file)));
        return productArrays.flat();
    } catch (error) {
        console.error('Error loading all products:', error);
        return [];
    }
}

async function loadCategoryProducts(category) {
    if (category === 'dresses') {
        const file = categoryFileMap[category];
        const staticProducts = file ? await loadProductsFromFile(file, category) : [];
        const localProducts = getLocalProducts('dresses_data').map((product) => ({
            ...product,
            _listingCategory: 'dresses',
            _sourceFile: 'localStorage:dresses_data'
        }));

        return [...staticProducts, ...localProducts];
    }

    const file = categoryFileMap[category];
    if (!file) {
        return [];
    }

    return loadProductsFromFile(file, category);
}

async function loadProductsFromFile(file, forcedCategory) {
    const response = await fetch(file);
    if (!response.ok) {
        return [];
    }

    const text = await response.text();
    if (!text.trim()) {
        return [];
    }

    const parsed = JSON.parse(text);
    const listingCategory = forcedCategory || fileToCategoryMap[file];

    return parsed.map(product => ({
        ...product,
        _listingCategory: listingCategory || product.category,
        _sourceFile: file
    }));
}

function renderProducts(products, category) {
    const productsGrid = document.getElementById('products-grid');
    const stylesCountElement = document.getElementById('styles-count');
    const selectedCategoryContainer = document.getElementById('selected-category-container');
    const topLevelCategories = ['newin', 'new-in', 'clothing', 'shoes', 'facebody', 'activewear', 'accessories'];
    
    if (!productsGrid) {
        console.error('Products grid container not found');
        return;
    }
    
    // Clear existing content
    productsGrid.innerHTML = '';
    
    // Update styles count
    if (stylesCountElement) {
        stylesCountElement.textContent = `${products.length.toLocaleString()} styles found`;
    }
    
    // Display selected category chip
    if (selectedCategoryContainer) {
        selectedCategoryContainer.innerHTML = ''; // Clear previous chip
        if (category && !topLevelCategories.includes(category)) {
            const categoryName = getCategoryLabel(category);
            const categoryChip = createCategoryChip(categoryName);
            selectedCategoryContainer.appendChild(categoryChip);
        }
    }
    
    // Loop through products and render them
    products.forEach(product => {
        const productCard = createProductCard(product, category);
        productsGrid.appendChild(productCard);
    });
}

function createCategoryChip(categoryName) {
    const chip = document.createElement('div');
    chip.className = 'selected-category-chip';
    chip.innerHTML = `
        <span>${categoryName}</span>
        <button class="clear-category-btn" aria-label="Clear category filter">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    const clearButton = chip.querySelector('.clear-category-btn');
    clearButton.addEventListener('click', () => {
        const params = new URLSearchParams(window.location.search);
        const currentCategory = params.get('category') || 'newin';
        params.set('category', getSectionForCategory(currentCategory));
        window.location.search = params.toString();
    });
    
    return chip;
}


//  Image  function swap first and second image 
function createProductCard(product, currentCategory) {
    const card = document.createElement('div');
    card.className = 'product-card';
    const productImage = getProductImage(product);
    const listingCategory = currentCategory || product._listingCategory || product.category;
    const gender = getCurrentGender();
    const actualId = product.customId || product._id || product.id;
    const productUrl = `product-details.html?id=${actualId}&gender=${encodeURIComponent(gender)}&category=${encodeURIComponent(listingCategory)}`;
    const wishlistProduct = {
        id: actualId,
        name: product.name,
        price: product.price,
        image: productImage.primary,
        secondaryImage: productImage.secondary,
        category: listingCategory,
        gender
    };
    const isSaved = window.WishlistStore ? window.WishlistStore.isSaved(wishlistProduct) : false;
    
    // Create product card HTML
    card.innerHTML = `
        <div class="product-image">
            <a href="${productUrl}">
                <img src="${productImage.primary}" alt="${product.name}" class="primary-img" loading="lazy">
                ${productImage.secondary ? `<img src="${productImage.secondary}" alt="${product.name}" class="secondary-img" loading="lazy">` : ''}
            </a>
            <button class="wishlist${isSaved ? ' active' : ''}" aria-label="Add to wishlist">
                <i class="${isSaved ? 'fas' : 'far'} fa-heart" aria-hidden="true"></i>
            </button>
        </div>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">$${product.price}</p>
    `;
    
    // Add click handler for product card (excluding wishlist button)
    const productLink = card.querySelector('.product-image a');
    productLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = productUrl;
    });

    const wishlistButton = card.querySelector('.wishlist');
    if (wishlistButton && window.WishlistStore) {
        wishlistButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const saved = window.WishlistStore.toggleItem(wishlistProduct);
            wishlistButton.classList.toggle('active', saved);
            const icon = wishlistButton.querySelector('i');
            if (icon) {
                icon.className = `${saved ? 'fas' : 'far'} fa-heart`;
            }
        });
    }
    
    // Add error handling for images
    card.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => {
            img.src = '../images/f1.jpg';
        }, { once: true });
    });
    
    return card;
}

function getProductImage(product) {
    let images = [];

    // 1. Array of images
    if (Array.isArray(product.images) && product.images.length > 0) {
        images = product.images;
    } 
    // 2. Single image string
    else if (product.image) {
        images = [product.image];
    } 
    // 3. Category gallery fallback
    else {
        const gallery = getCategoryGallery(product.category);
        if (gallery.length > 0) {
            const startIndex = getGalleryStartIndex(product, gallery);
            // Try to get two consecutive images if possible
            images = [
                gallery[startIndex],
                gallery[(startIndex + 1) % gallery.length]
            ];
        } else {
            images = ['../images/f1.jpg'];
        }
    }

    return {
        primary: images[0] || '../images/f1.jpg',
        secondary: images.length > 1 ? images[1] : null
    };
}

function getCategoryGallery(category) {
    return categoryGalleryMap[category] || [];
}

function getGalleryStartIndex(product, gallery) {
    if (!gallery.length) {
        return 0;
    }

    return Math.abs((product.id || 0) - 1) % gallery.length;
}

function getCategoryLabel(category) {
    return categoryLabelMap[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
}

function getSectionForCategory(category) {
    if (category === 'clothing' || clothingCategoryKeys.includes(category) || menClothingCategoryKeys.includes(category)) {
        return 'clothing';
    }

    if (category === 'shoes' || shoeCategoryKeys.includes(category) || menShoeCategoryKeys.includes(category)) {
        return 'shoes';
    }

    if (category === 'facebody' || faceBodyCategoryKeys.includes(category) || menFaceBodyCategoryKeys.includes(category)) {
        return 'facebody';
    }

    if (category === 'activewear' || activewearCategoryKeys.includes(category) || menActivewearCategoryKeys.includes(category)) {
        return 'activewear';
    }

    if (
        category === 'accessories' ||
        category === 'accessories-product' ||
        category === 'accessories-bags' ||
        category === 'accessories-jewellery' ||
        accessoriesCategoryKeys.includes(category) ||
        menAccessoriesCategoryKeys.includes(category)
    ) {
        return 'accessories';
    }

    if (category === 'new-in' || menNewInCategoryKeys.includes(category)) {
        return 'newin';
    }

    return 'newin';
}

function getSectionCategory(sectionKey, gender) {
    if (sectionKey === 'newin' && gender === 'men') {
        return 'new-in';
    }

    return sectionKey;
}

function getCurrentGender() {
    const params = new URLSearchParams(window.location.search);
    return params.get('gender') || 'women';
}

function syncNewInChips(category) {
    const chips = document.querySelectorAll('.chip-btn');
    const activeLabel = category === 'today'
        ? 'New in: Today'
        : category === 'newin'
            ? 'New In: Clothing'
            : null;

    chips.forEach(chip => {
        chip.classList.toggle('active', chip.textContent.trim() === activeLabel);
    });
}

// Gender toggle functionality for products page
function navigateToGender(gender) {
    window.location.href = gender === 'men' ? 'men.html' : 'women.html';
}

function applyMenProductsMegaMenus() {
    const menuTemplates = {
        'new-in-mega-menu': `
            <div class="mega-sidebar">
                <p class="mega-sidebar-title">SHOP BY PRODUCT</p>
                <ul class="mega-sidebar-links">
                    <li><a href="products.html?gender=men&category=new-in" class="mega-sidebar-main">View all</a></li>
                    <li><a href="products.html?gender=men&category=new-in-today" class="mega-sidebar-main">New in: Today</a></li>
                    <li><a href="products.html?gender=men&category=new-in-t-shirts">T-Shirts</a></li>
                    <li><a href="products.html?gender=men&category=new-in-hoodies-sweatshirts">Hoodies &amp; Sweatshirts</a></li>
                    <li><a href="products.html?gender=men&category=new-in-jeans-trousers">Jeans &amp; Trousers</a></li>
                    <li><a href="products.html?gender=men&category=new-in-underwear">Underwear</a></li>
                    <li><a href="products.html?gender=men&category=new-in-jumpers">Jumpers</a></li>
                </ul>
            </div>
            <div id="asos-layout" class="asos-layout">
                <div class="mega-brand-section">
                    <p class="mega-section-title">SUPPORTED BRAND</p>
                    <div class="mega-brand-list">
                        <a href="#" class="mega-brand-link">Caudalie</a>
                        <a href="#" class="mega-brand-link">e.l.f.</a>
                        <a href="#" class="mega-brand-link">Huda Beauty</a>
                        <a href="#" class="mega-brand-link">Kitsch</a>
                        <a href="#" class="mega-brand-link">LANEIGE</a>
                        <a href="#" class="mega-brand-link">NYX Professional Makeup</a>
                        <a href="#" class="mega-brand-link">Olaplex</a>
                        <a href="#" class="mega-brand-link">Revolution</a>
                        <a href="#" class="mega-brand-link">Sculpted by Aimee</a>
                        <a href="#" class="mega-brand-link">The Ordinary</a>
                        <a href="#" class="mega-brand-link mega-brand-main">A-Z of brands</a>
                    </div>
                </div>
                <div class="mega-edits-section">
                    <p class="mega-section-title">NEW EDITS</p>
                    <div class="mega-edit-card">
                        <img src="../images/KIT6.jpeg" alt="New Edits" class="mega-edit-img">
                        <div class="mega-edit-overlay">
                            <span class="mega-edit-text">ARRANGE</span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="grid-layout" class="mega-cards" style="display: none;">
                <div class="mega-card" id="mega-card-0"><img src="" alt="" class="mega-card-img"><span class="mega-card-label"></span></div>
                <div class="mega-card" id="mega-card-1"><img src="" alt="" class="mega-card-img"><span class="mega-card-label"></span></div>
                <div class="mega-card" id="mega-card-2"><img src="" alt="" class="mega-card-img"><span class="mega-card-label"></span></div>
            </div>
        `,
        'clothing-mega-menu': `
            <div class="clothing-products-section">
                <p class="clothing-section-title">SHOP BY PRODUCTS</p>
                <div class="clothing-links-grid">
                    <ul class="clothing-links">
                        <li><a href="products.html?gender=men&category=clothing" class="clothing-main-link">TOP rated Clothing</a></li>
                        <li><a href="products.html?gender=men&category=men-shorts">Shorts</a></li>
                        <li><a href="products.html?gender=men&category=men-jumpers-cardigans">Jumpers &amp; cardigans</a></li>
                        <li><a href="products.html?gender=men&category=men-coats-jackets">coats &amp; Jackets</a></li>
                        <li><a href="products.html?gender=men&category=men-trousers-chinos">Trousers &amp; Chinos</a></li>
                        <li><a href="products.html?gender=men&category=men-joggers">Joggers</a></li>
                        <li><a href="products.html?gender=men&category=men-swimwear">Swimwear</a></li>
                        <li><a href="products.html?gender=men&category=men-jeans">Jeans</a></li>
                    </ul>
                    <ul class="clothing-links">
                        <li><a href="products.html?gender=men&category=men-cargo-trousers">Cargo Trousers</a></li>
                        <li><a href="products.html?gender=men&category=men-suits-tailoring">Suits &amp; Tailoring</a></li>
                        <li><a href="products.html?gender=men&category=men-socks">Socks</a></li>
                        <li><a href="products.html?gender=men&category=men-casual-shirts">Casual shirts</a></li>
                    </ul>
                </div>
            </div>
            <div class="clothing-feature-grid" aria-label="Featured clothing collections">
                <a href="products.html?gender=men&category=clothing" class="clothing-feature-card">
                    <img src="../images/style1.jpeg" alt="Trending clothing feature">
                    <span>TRENDING CLOTHING</span>
                </a>
                <a href="products.html?gender=men&category=men-jeans" class="clothing-feature-card">
                    <img src="../images/style3.jpeg" alt="Trending clothing feature">
                    <span>TRENDING CLOTHING</span>
                </a>
            </div>
        `,
        'shoes-mega-menu': `
            <div class="shoes-menu-grid">
                <div class="shoes-menu-col">
                    <p class="clothing-section-title">SHOP BY PRODUCT</p>
                    <ul class="shoes-links">
                        <li><a href="products.html?gender=men&category=shoes" class="shoes-main-link">View all</a></li>
                        <li><a href="products.html?gender=men&category=shoes-new-in" class="shoes-main-link">New in</a></li>
                        <li><a href="products.html?gender=men&category=shoes-trainers">Trainers</a></li>
                        <li><a href="products.html?gender=men&category=shoes-boots">Boots</a></li>
                        <li><a href="products.html?gender=men&category=shoes-sandals">Sandals</a></li>
                        <li><a href="products.html?gender=men&category=shoes-sliders">Sliders</a></li>
                        <li><a href="products.html?gender=men&category=shoes-loafers">Loafers</a></li>
                        <li><a href="products.html?gender=men&category=shoes-adidas">Adidas</a></li>
                        <li><a href="products.html?gender=men&category=shoes-balenciaga-on">Balenciaga On</a></li>
                    </ul>
                </div>
                <div class="shoes-menu-col">
                    <p class="clothing-section-title">SHOP BY BRAND</p>
                    <ul class="shoes-edit-list">
                        <li><a href="#" class="shoes-edit-link"><img src="../images/SHOE5.jpeg" alt="ASOS DESIGN"><span>ASOS DESIGN</span></a></li>
                        <li><a href="#" class="shoes-edit-link"><img src="../images/SHOES1.jpeg" alt="adidas"><span>adidas</span></a></li>
                        <li><a href="#" class="shoes-edit-link"><img src="../images/SHOE6.avif" alt="Asics"><span>Asics</span></a></li>
                        <li><a href="#" class="shoes-edit-link"><img src="../images/MENSH.avif" alt="On"><span>New Balenciaga</span></a></li>
                    </ul>
                </div>
                <div class="shoes-menu-col">
                    <p class="clothing-section-title">SHOP BY TRAINER STYLE</p>
                    <ul class="shoes-links shoes-trainer-links">
                        <li><a href="products.html?gender=men&category=shoes-adidas">adidas Originals Samba</a></li>
                        <li><a href="products.html?gender=men&category=shoes-adidas">adidas Originals SL 72</a></li>
                        <li><a href="products.html?gender=men&category=shoes-adidas">adidas Originals Spezial</a></li>
                        <li><a href="products.html?gender=men&category=shoes-trainers">New Balance 530</a></li>
                        <li><a href="products.html?gender=men&category=shoes-trainers">New Balance 9060</a></li>
                        <li><a href="products.html?gender=men&category=shoes-trainers">Puma Speedcat</a></li>
                        <li><a href="products.html?gender=men&category=shoes-trainers">ON Cloudmonster</a></li>
                        <li><a href="products.html?gender=men&category=shoes-trainers">Puma Cali</a></li>
                    </ul>
                </div>
                <a href="#" class="shoes-feature-card"><img src="../images/SHOE5.jpeg" alt="Trending shoes"><span>TRENDING SHOES</span></a>
            </div>
        `,
        'facebody-mega-menu': `
            <div class="facebody-menu-grid">
                <div class="facebody-menu-col">
                    <p class="clothing-section-title">SHOP BY PRODUCT</p>
                    <ul class="facebody-links">
                        <li><a href="products.html?gender=men&category=men-facebody-up-to-40-off" class="facebody-accent-link">Up to 40% off</a></li>
                        <li><a href="products.html?gender=men&category=facebody">View all</a></li>
                        <li><a href="products.html?gender=men&category=men-facebody-skincare" class="facebody-main-link">Skincare</a></li>
                        <li><a href="products.html?gender=men&category=men-facebody-hair-care">Hair care</a></li>
                        <li><a href="products.html?gender=men&category=men-facebody-body-care">Body care</a></li>
                        <li><a href="products.html?gender=men&category=men-facebody-fragrance">Fragrance</a></li>
                        <li><a href="products.html?gender=men&category=men-facebody-tools-accessories">Tools &amp; Accessories</a></li>
                    </ul>
                </div>
                <div class="facebody-menu-col">
                    <p class="clothing-section-title">SHOP BY BRAND</p>
                    <ul class="facebody-links">
                        <li><a href="#">Caudalie</a></li>
                        <li><a href="#">e.l.f.</a></li>
                        <li><a href="#">Huda Beauty</a></li>
                        <li><a href="#">Kitsch</a></li>
                        <li><a href="#">LANEIGE</a></li>
                        <li><a href="#">NYX Professional Makeup</a></li>
                        <li><a href="#">Olaplex</a></li>
                        <li><a href="#">Revolution</a></li>
                        <li><a href="#">Sculpted by Aimee</a></li>
                        <li><a href="#">The Ordinary</a></li>
                        <li><a href="#" class="facebody-main-link">A-Z of brands</a></li>
                    </ul>
                </div>
                <a href="#" class="facebody-feature-card"><img src="../images/FHIM.jpeg" alt="Discover face and body"><span>DISCOVER FACE + BODY</span></a>
                <a href="#" class="facebody-feature-card"><img src="../images/FHIM.jpeg" alt="Discover face and body"><span>DISCOVER FACE + BODY</span></a>
            </div>
        `,
        'accessories-mega-menu': `
            <div class="accessories-menu-grid">
                <div class="accessories-menu-col">
                    <p class="clothing-section-title">SHOP BY PRODUCT On</p>
                    <ul class="accessories-links">
                        <li><a href="products.html?gender=men&category=men-accessories-product-view-all">View all</a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-sunglasses">Sunglasses</a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-watches">Watches</a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-belts">Belts</a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-ties">Ties</a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-cap-hats">Cap &amp; Hats</a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-gloves">Gloves</a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-accessories-on">Accessories On</a></li>
                    </ul>
                </div>
                <div class="accessories-menu-col">
                    <p class="clothing-section-title">SHOP BY BAGS On</p>
                    <ul class="accessories-edit-list">
                        <li><a href="products.html?gender=men&category=men-accessories-bags-view-all-bags" class="accessories-edit-link"><img src="../images/BAG1.avif" alt="View all bags"><span>View all</span></a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-bags-wallets" class="accessories-edit-link"><img src="../images/BAG2.avif" alt="Wallets"><span>Wallets</span></a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-bags-backpacks" class="accessories-edit-link"><img src="../images/BAG3.avif" alt="Backpacks"><span>Backpacks</span></a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-bags-travel-bags-on" class="accessories-edit-link"><img src="../images/BAG4.avif" alt="Travel bags On"><span>Travel bags On</span></a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-bags-bum-bags" class="accessories-edit-link"><img src="../images/BAG5.avif" alt="Bum Bags"><span>Bum Bags</span></a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-bags-shopper-bags" class="accessories-edit-link"><img src="../images/BAG6.avif" alt="Shopper Bags"><span>Shopper Bags</span></a></li>
                    </ul>
                </div>
                <div class="accessories-menu-col">
                    <p class="clothing-section-title">SHOP BY JEWELLERY On</p>
                    <ul class="accessories-edit-list">
                        <li><a href="products.html?gender=men&category=men-accessories-jewellery-view-all-jewellery" class="accessories-edit-link"><img src="../images/a1.png" alt="View all jewellery"><span>View all</span></a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-jewellery-earrings" class="accessories-edit-link"><img src="../images/a2.jpg" alt="Earrings"><span>Earrings</span></a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-jewellery-necklaces" class="accessories-edit-link"><img src="../images/a3.png" alt="Necklaces"><span>Necklaces</span></a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-jewellery-rings" class="accessories-edit-link"><img src="../images/a4.png" alt="Rings"><span>Rings</span></a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-jewellery-bracelets" class="accessories-edit-link"><img src="../images/a5.jpg" alt="Bracelets"><span>Bracelets</span></a></li>
                        <li><a href="products.html?gender=men&category=men-accessories-jewellery-plated-sterling-on" class="accessories-edit-link"><img src="../images/a6.jpg" alt="Plated Jewellery"><span>Plated &amp; Sterling Jewellery</span></a></li>
                    </ul>
                </div>
                <a href="#" class="accessories-feature-card"><img src="../images/b17.jpg" alt="Winter accessories"><span>WINTER ACCESSORIES</span></a>
            </div>
        `,
        'activewear-mega-menu': `
            <div class="activewear-menu-grid">
                <div class="activewear-menu-col">
                    <p class="clothing-section-title">SHOP BY PRODUCT</p>
                    <ul class="activewear-links">
                        <li><a href="products.html?gender=men&category=activewear">View all</a></li>
                        <li><a href="products.html?gender=men&category=men-activewear-tops-on">Tops On</a></li>
                        <li><a href="products.html?gender=men&category=men-activewear-shorts-on">Shorts On</a></li>
                        <li><a href="products.html?gender=men&category=men-activewear-jackets-on">Jackets</a></li>
                        <li><a href="products.html?gender=men&category=men-activewear-ski-snowboard">Ski &amp; Snowboard</a></li>
                        <li><a href="products.html?gender=men&category=men-activewear-trousers-tights">Trousers &amp; Tights</a></li>
                        <li><a href="products.html?gender=men&category=men-activewear-hoodies-activewear">Hoodies &amp; active shirts</a></li>
                        <li><a href="products.html?gender=men&category=men-activewear-active-accessories">Active Accessories</a></li>
                    </ul>
                </div>
                <div class="activewear-menu-col">
                    <p class="clothing-section-title">SHOP BY ACTIVITY</p>
                    <div class="activewear-activity-grid">
                        <a href="products.html?gender=men&category=men-activewear-jackets-on" class="activewear-activity-item"><img src="../images/style1.jpeg" alt="Running"><span>Jackets</span></a>
                        <a href="products.html?gender=men&category=men-activewear-trousers-tights" class="activewear-activity-item activewear-activity-highlight"><img src="../images/style2.png" alt="Gym"><span>Trousers &amp; Tights</span></a>
                        <a href="products.html?gender=men&category=men-activewear-shorts-on" class="activewear-activity-item"><img src="../images/style3.jpeg" alt="Yoga"><span>Shorts On</span></a>
                        <a href="products.html?gender=men&category=men-activewear-ski-snowboard" class="activewear-activity-item"><img src="../images/style4.jpeg" alt="Ski"><span>Ski &amp; Snowboard</span></a>
                    </div>
                </div>
                <div class="activewear-menu-col">
                    <p class="clothing-section-title">SHOP BY EDIT</p>
                    <div class="activewear-tile-stack">
                        <a href="#" class="activewear-tile-card"><img src="../images/KIT6.jpeg" alt="Run ready"><span>RUN READY</span></a>
                        <a href="#" class="activewear-tile-card"><img src="../images/PSG1.avif" alt="Match day fits"><span>MATCH DAY 'FITS</span></a>
                    </div>
                </div>
                <div class="activewear-menu-col activewear-brand-col">
                    <p class="clothing-section-title">SHOP BY BRAND</p>
                    <div class="activewear-tile-stack">
                        <a href="#" class="activewear-tile-card"><img src="../images/PSG4.avif" alt="4505"><span>4505</span></a>
                        <a href="#" class="activewear-tile-card"><img src="../images/PSG6.avif" alt="Adidas performance"><span>ADIDAS PERFORMANCE</span></a>
                    </div>
                </div>
            </div>
        `
    };

    Object.entries(menuTemplates).forEach(([id, html]) => {
        const menu = document.getElementById(id);
        if (menu) {
            menu.innerHTML = html;
        }
    });
}

function syncHeaderForGender(gender) {
    const isMen = gender === 'men';
    const title = document.querySelector('title');
    const genderButtons = document.querySelectorAll('.gender-btn');
    const categoryLinks = document.querySelectorAll('#category-slider .category-item');
    const genderToggleLinks = {
        women: document.querySelector('.gender-toggle .gender-btn[href="women.html"]'),
        men: document.querySelector('.gender-toggle .gender-btn[href="men.html"]')
    };
    const navTargets = isMen
        ? {
            newin: 'products.html?gender=men&category=new-in',
            clothing: 'products.html?gender=men&category=clothing',
            shoes: 'products.html?gender=men&category=shoes',
            facebody: 'products.html?gender=men&category=facebody',
            accessories: 'products.html?gender=men&category=accessories',
            activewear: 'products.html?gender=men&category=activewear'
        }
        : {
            newin: 'products.html?gender=women&category=clothing',
            clothing: 'products.html?gender=women&category=clothing',
            shoes: 'products.html?gender=women&category=shoes',
            facebody: 'products.html?gender=women&category=facebody',
            accessories: 'products.html?gender=women&category=accessories',
            activewear: 'products.html?gender=women&category=activewear'
        };

    if (isMen) {
        applyMenProductsMegaMenus();
    }

    if (title && isMen && title.textContent.includes('Women')) {
        title.textContent = title.textContent.replace(/Women/g, 'Men');
    }

    genderButtons.forEach(button => {
        const href = button.getAttribute('href');
        const buttonGender = href === 'men.html' ? 'men' : 'women';
        button.classList.toggle('active', buttonGender === gender);
        button.dataset.gender = buttonGender;
    });

    if (genderToggleLinks.women) {
        genderToggleLinks.women.href = 'women.html';
    }

    if (genderToggleLinks.men) {
        genderToggleLinks.men.href = 'men.html';
    }

    categoryLinks.forEach(link => {
        const trigger = link.closest('.mega-trigger');
        const categoryKey = trigger?.getAttribute('data-category');
        if (categoryKey && navTargets[categoryKey]) {
            link.href = navTargets[categoryKey];
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const genderButtons = document.querySelectorAll('.gender-btn');
    
    genderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gender = button.getAttribute('data-gender');
            
            // Update active state
            genderButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Navigate to homepage with selected gender
            navigateToGender(gender);
        });
    });

    // Initialize mega menu for products page
    initASOSMegaMenu();
    
    // Initialize chip navigation
    initChipNavigation();
    
    // Initialize New In chip buttons
    initNewInChips();
    
    // Initialize sort and filter functionality
    const sortBtn = document.querySelector('.products-toolbar .sort-btn');
    const filterBtn = document.querySelector('.products-toolbar .filter-btn');
    const sortDrawer = document.getElementById('sort-drawer');
    const sortDrawerBackdrop = document.getElementById('sort-drawer-backdrop');
    const sortDrawerClose = document.getElementById('sort-drawer-close');
    const sortDrawerSubmit = document.getElementById('sort-drawer-submit');
    const sortDrawerForm = document.getElementById('sort-drawer-form');

    const openSortDrawer = () => {
        if (!sortDrawer || !sortDrawerBackdrop) return;
        sortDrawer.hidden = false;
        sortDrawerBackdrop.hidden = false;
        sortDrawer.setAttribute('aria-hidden', 'false');
        sortDrawer.classList.add('is-open');
        sortDrawerBackdrop.classList.add('is-open');
        if (sortDrawerForm) {
            sortDrawerForm.scrollTop = 0;
        }
        document.body.style.overflow = 'hidden';
    };

    const closeSortDrawer = () => {
        if (!sortDrawer || !sortDrawerBackdrop) return;
        sortDrawer.setAttribute('aria-hidden', 'true');
        sortDrawer.classList.remove('is-open');
        sortDrawerBackdrop.classList.remove('is-open');
        document.body.style.overflow = '';
        window.setTimeout(() => {
            if (!sortDrawer.classList.contains('is-open')) {
                sortDrawer.hidden = true;
                sortDrawerBackdrop.hidden = true;
            }
        }, 280);
    };

    if (sortDrawerForm) {
        const activeSortInput = sortDrawerForm.querySelector(`input[value="${currentSortOrder}"]`);
        if (activeSortInput) {
            activeSortInput.checked = true;
        }

        sortDrawerForm.addEventListener('change', (event) => {
            const selectedValue = event.target instanceof HTMLInputElement ? event.target.value : '';
            if (!selectedValue) return;
            currentSortOrder = selectedValue;
            rerenderCurrentProducts();
        });
    }

    if (sortBtn) {
        sortBtn.addEventListener('click', openSortDrawer);
    }

    if (sortDrawerClose) {
        sortDrawerClose.addEventListener('click', closeSortDrawer);
    }

    if (sortDrawerBackdrop) {
        sortDrawerBackdrop.addEventListener('click', closeSortDrawer);
    }

    if (sortDrawerSubmit) {
        sortDrawerSubmit.addEventListener('click', closeSortDrawer);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeSortDrawer();
        }
    });
    
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            alert('Filter functionality coming soon!');
        });
    }
});

// Chip navigation functionality
function initChipNavigation() {
    const chipsContainer = document.querySelector('.newin-chips');
    const leftBtn = document.querySelector('.chip-nav-left');
    const rightBtn = document.querySelector('.chip-nav-right');
    
    if (!chipsContainer || !leftBtn || !rightBtn) return;
    
    let scrollPosition = 0;
    
    function updateNavigationButtons() {
        const maxScroll = chipsContainer.scrollWidth - chipsContainer.clientWidth;
        leftBtn.disabled = scrollPosition <= 0;
        rightBtn.disabled = scrollPosition >= maxScroll;
    }
    
    leftBtn.addEventListener('click', () => {
        scrollPosition -= 200;
        if (scrollPosition < 0) scrollPosition = 0;
        chipsContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        updateNavigationButtons();
    });
    
    rightBtn.addEventListener('click', () => {
        const maxScroll = chipsContainer.scrollWidth - chipsContainer.clientWidth;
        scrollPosition += 200;
        if (scrollPosition > maxScroll) scrollPosition = maxScroll;
        chipsContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        updateNavigationButtons();
    });
    
    // Initialize button states
    updateNavigationButtons();
    
    // Update buttons on window resize
    window.addEventListener('resize', updateNavigationButtons);
}

// New In chips functionality
function initNewInChips() {
    const chips = document.querySelectorAll('.chip-btn');
    
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Remove active class from all chips
            chips.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked chip
            chip.classList.add('active');
            
            // Get the category from chip text
            const chipText = chip.textContent.trim();
            let category = 'newin'; // default
            
            switch(chipText) {
                case 'New in: Today':
                    category = 'today';
                    break;
                case 'New In: Clothing':
                    category = 'newin';
                    break;
                case 'New In: Shoes':
                    category = 'shoes';
                    break;
                case 'New In: Accessories':
                    category = 'accessories';
                    break;
                case 'New In: Face + Body':
                    category = 'facebody';
                    break;
            }
            
            // Navigate to the selected category
            const params = new URLSearchParams(window.location.search);
            params.set('category', category);
            window.location.search = params.toString();
        });
    });
}
