const ADMIN_PRODUCTS_KEY = 'products';
const DRESSES_STORAGE_KEY = 'dresses_data';
const INDIVIDUAL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const SUBCATEGORY_JSON_FILE_MAP = {
    dresses: '../../Data/Women/New-in/dresses.json',
    tops: '../../Data/Women/New-in/tops.json',
    jumpers: '../../Data/Women/New-in/jumpers.json',
    'jeans-trousers': '../../Data/Women/New-in/jeans-trousers.json',
    hoodies: '../../Data/Women/New-in/hoodies.json',
    'shorts-clothing': '../../Data/Women/Clothing/shorts.json',
    'jumpers-cardigans': '../../Data/Women/Clothing/jumpers-cardigans.json',
    jeans: '../../Data/Women/Clothing/jeans.json',
    blouses: '../../Data/Women/Clothing/blouses.json',
    'suits-tailoring': '../../Data/Women/Clothing/suits-Tailoring.json',
    'wedding-dresses': '../../Data/Women/Clothing/wedding-dresses.json',
    nightwear: '../../Data/Women/Clothing/nightwear.json',
    'occasion-dresses': '../../Data/Women/Clothing/occasion-dresses.json',
    'coats-jackets': '../../Data/Women/Clothing/coats-Jackets.json',
    'swimwear-beachwear': '../../Data/Women/Clothing/swimwear-beachwear.json',
    trousers: '../../Data/Women/Clothing/trousers.json',
    skirts: '../../Data/Women/Clothing/skirts.json',
    shirts: '../../Data/Women/Clothing/shirts.json',
    'tops-clothing': '../../Data/Women/Clothing/tops.json',
    boots: '../../Data/Women/Shoes/Boots.json',
    'ballet-pumps': '../../Data/Women/Shoes/ballet-pumps.json',
    sandals: '../../Data/Women/Shoes/Sandals.json',
    heels: '../../Data/Women/Shoes/Heels.json',
    adidas: '../../Data/Women/Shoes/addidas.json',
    birkenstock: '../../Data/Women/Shoes/birkenstock.json',
    'asos-design': '../../Data/Women/Shoes/asos-design.json',
    balenciaga: '../../Data/Women/Shoes/balenciaga.json',
    puma: '../../Data/Women/Shoes/Puma.json',
    'facebody-hottest-drop': '../../Data/Women/Face+Body/makeup.json',
    'facebody-makeup': '../../Data/Women/Face+Body/makeup.json',
    'facebody-skin-care': '../../Data/Women/Face+Body/skin-care.json',
    'facebody-hair-care': '../../Data/Women/Face+Body/hair-care.json',
    'facebody-body-care': '../../Data/Women/Face+Body/body-care.json',
    'facebody-tools-accessories': '../../Data/Women/Face+Body/tools-accessories.json',
    'accessories-bags': '../../Data/Women/Accessories/Bags/cross-bag.json',
    'accessories-jewellery': '../../Data/Women/Accessories/Jewellery/earrings.json',
    'accessories-sunglasses': '../../Data/Women/Accessories/Product/sunglasses.json',
    'hair-accessories': '../../Data/Women/Accessories/Product/hair-accessories.json',
    belts: '../../Data/Women/Accessories/Product/belts.json',
    caps: '../../Data/Women/Accessories/Product/caps.json',
    gloves: '../../Data/Women/Accessories/Product/gloves.json',
    'activewear-sports-bras': '../../Data/Women/Activewear/sports-bras.json',
    'activewear-shorts': '../../Data/Women/Activewear/shorts.json',
    'activewear-trainers': '../../Data/Women/Activewear/trainers.json',
    'activewear-jackets': '../../Data/Women/Activewear/jackets.json',
    'activewear-hoodies-sweatshirts': '../../Data/Women/Activewear/hoodies-sweatshirts.json',
    'activewear-tops': '../../Data/Women/Activewear/tops-activewear.json',
    'activewear-adidas': '../../Data/Women/Activewear/addidas-activewear.json'
};
const CATEGORY_SUBCATEGORY_MAP = {
    newin: [
        { value: 'dresses', label: 'Dresses' },
        { value: 'tops', label: 'Tops' },
        { value: 'jumpers', label: 'Jumpers' },
        { value: 'jeans-trousers', label: 'Jeans & Trousers' },
        { value: 'hoodies', label: 'Hoodies' }
    ],
    clothing: [
        { value: 'shorts-clothing', label: 'Shorts' },
        { value: 'jumpers-cardigans', label: 'Jumpers & Cardigans' },
        { value: 'jeans', label: 'Jeans' },
        { value: 'blouses', label: 'Blouses' },
        { value: 'suits-tailoring', label: 'Suits & Tailoring' },
        { value: 'wedding-dresses', label: 'Wedding Dresses' },
        { value: 'nightwear', label: 'Nightwear' },
        { value: 'occasion-dresses', label: 'Occasion Dresses' },
        { value: 'coats-jackets', label: 'Coats & Jackets' },
        { value: 'swimwear-beachwear', label: 'Swimwear & Beachwear' },
        { value: 'trousers', label: 'Trousers' },
        { value: 'skirts', label: 'Skirts' },
        { value: 'shirts', label: 'Shirts' },
        { value: 'tops-clothing', label: 'Tops' }
    ],
    shoes: [
        { value: 'boots', label: 'Boots' },
        { value: 'ballet-pumps', label: 'Ballet Pumps' },
        { value: 'sandals', label: 'Sandals' },
        { value: 'heels', label: 'Heels' },
        { value: 'adidas', label: 'Adidas' },
        { value: 'birkenstock', label: 'Birkenstock' },
        { value: 'asos-design', label: 'Asos Design' },
        { value: 'balenciaga', label: 'Balenciaga' },
        { value: 'puma', label: 'Puma' }
    ],
    facebody: [
        { value: 'facebody-hottest-drop', label: 'Hottest Drop' },
        { value: 'facebody-makeup', label: 'Makeup' },
        { value: 'facebody-skin-care', label: 'Skin Care' },
        { value: 'facebody-hair-care', label: 'Hair Care' },
        { value: 'facebody-body-care', label: 'Body Care' },
        { value: 'facebody-tools-accessories', label: 'Tools & Accessories' }
    ],
    accessories: [
        { value: 'accessories-bags', label: 'Bags' },
        { value: 'accessories-jewellery', label: 'Jewellery' },
        { value: 'accessories-sunglasses', label: 'Sunglasses' },
        { value: 'hair-accessories', label: 'Hair Accessories' },
        { value: 'belts', label: 'Belts' },
        { value: 'caps', label: 'Caps' },
        { value: 'gloves', label: 'Gloves' }
    ],
    activewear: [
        { value: 'activewear-sports-bras', label: 'Sports Bras' },
        { value: 'activewear-shorts', label: 'Shorts' },
        { value: 'activewear-trainers', label: 'Trainers' },
        { value: 'activewear-jackets', label: 'Jackets' },
        { value: 'activewear-hoodies-sweatshirts', label: 'Hoodies & Sweatshirts' },
        { value: 'activewear-tops', label: 'Tops Activewear' },
        { value: 'activewear-adidas', label: 'Addidas Activewear' }
    ]
};

const SUBCATEGORY_STORAGE_KEY_MAP = {
    dresses: 'dresses',
    tops: 'tops',
    jumpers: 'jumpers',
    'jeans-trousers': 'jeans-trousers',
    hoodies: 'hoodies',
    'shorts-clothing': 'shorts-clothing',
    'jumpers-cardigans': 'jumpers-cardigans',
    jeans: 'jeans',
    blouses: 'blouses',
    'suits-tailoring': 'suits-tailoring',
    'wedding-dresses': 'wedding-dresses',
    nightwear: 'nightwear',
    'occasion-dresses': 'occasion-dresses',
    'coats-jackets': 'coats-jackets',
    'swimwear-beachwear': 'swimwear-beachwear',
    trousers: 'trousers',
    skirts: 'skirts',
    shirts: 'shirts',
    'tops-clothing': 'tops-clothing',
    boots: 'boots',
    'ballet-pumps': 'ballet-pumps',
    sandals: 'sandals',
    heels: 'heels',
    adidas: 'adidas',
    birkenstock: 'birkenstock',
    'asos-design': 'asos-design',
    balenciaga: 'balenciaga',
    puma: 'puma',
    'facebody-hottest-drop': 'facebody-hottest-drop',
    'facebody-makeup': 'facebody-makeup',
    'facebody-skin-care': 'facebody-skin-care',
    'facebody-hair-care': 'facebody-hair-care',
    'facebody-body-care': 'facebody-body-care',
    'facebody-tools-accessories': 'facebody-tools-accessories',
    'accessories-bags': 'accessories-bags',
    'accessories-jewellery': 'accessories-jewellery',
    'accessories-sunglasses': 'accessories-sunglasses',
    'hair-accessories': 'hair-accessories',
    belts: 'belts',
    caps: 'caps',
    gloves: 'gloves',
    'activewear-sports-bras': 'activewear-sports-bras',
    'activewear-shorts': 'activewear-shorts',
    'activewear-trainers': 'activewear-trainers',
    'activewear-jackets': 'activewear-jackets',
    'activewear-hoodies-sweatshirts': 'activewear-hoodies-sweatshirts',
    'activewear-tops': 'activewear-tops',
    'activewear-adidas': 'activewear-adidas'
};

const selectedSizes = new Set();
const uploadedImages = ['', '', '', ''];

function getStoredArray(key) {
    try {
        const items = JSON.parse(localStorage.getItem(key)) || [];
        return Array.isArray(items) ? items : [];
    } catch (error) {
        console.error(`Unable to read ${key}:`, error);
        return [];
    }
}

function saveStoredArray(key, items) {
    localStorage.setItem(key, JSON.stringify(items));
}

async function loadSeedProductsForSubcategory(subcategory) {
    const file = SUBCATEGORY_JSON_FILE_MAP[subcategory];
    if (!file) {
        return [];
    }

    try {
        const response = await fetch(file);
        if (!response.ok) {
            return [];
        }

        const text = await response.text();
        if (!text.trim()) {
            return [];
        }

        const parsed = JSON.parse(text);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error(`Unable to seed ${subcategory} from JSON:`, error);
        return [];
    }
}

function ensureToastElement() {
    let toast = document.getElementById('add-item-toast');
    if (toast) return toast;

    toast = document.createElement('div');
    toast.id = 'add-item-toast';
    toast.className = 'add-item-toast';
    toast.innerHTML = `
        <div class="add-item-toast-main">
            <span class="add-item-toast-icon"><i class="fas fa-check"></i></span>
            <span class="add-item-toast-text">Product Added</span>
        </div>
        <button type="button" class="add-item-toast-close" aria-label="Close popup">&times;</button>
    `;

    document.body.appendChild(toast);

    toast.querySelector('.add-item-toast-close').addEventListener('click', () => {
        toast.classList.remove('is-visible');
    });

    return toast;
}

let toastTimer = null;

function showSuccessToast() {
    const toast = ensureToastElement();
    toast.classList.add('is-visible');

    if (toastTimer) {
        window.clearTimeout(toastTimer);
    }

    toastTimer = window.setTimeout(() => {
        toast.classList.remove('is-visible');
    }, 2600);
}

function generateProductId() {
    return `product_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function previewUploadedImage(input, dataUrl) {
    const uploadBox = input.closest('[data-upload-box]');
    if (!uploadBox) return;

    const preview = uploadBox.querySelector('.image-upload-preview');
    if (!preview) return;

    preview.src = dataUrl;
    uploadBox.classList.add('has-image');
}

function initializeImageUploads() {
    const imageInputs = document.querySelectorAll('.image-upload-input');

    imageInputs.forEach((input) => {
        input.addEventListener('change', (event) => {
            const file = event.target.files && event.target.files[0];
            const index = Number(event.target.dataset.imageInput);

            if (!file || Number.isNaN(index)) {
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = typeof reader.result === 'string' ? reader.result : '';
                uploadedImages[index] = dataUrl;
                previewUploadedImage(event.target, dataUrl);
            };
            reader.readAsDataURL(file);
        });
    });
}

function updateAllSizesButtonState() {
    const allSizesButton = document.querySelector('[data-size="ALL"]');
    if (!allSizesButton) return;

    const allSelected = INDIVIDUAL_SIZES.every((size) => selectedSizes.has(size));
    allSizesButton.classList.toggle('is-selected', allSelected);
}

function setIndividualSizeSelection(size, shouldSelect) {
    const button = document.querySelector(`.size-chip[data-size="${size}"]`);
    if (!button) return;

    if (shouldSelect) {
        selectedSizes.add(size);
        button.classList.add('is-selected');
        return;
    }

    selectedSizes.delete(size);
    button.classList.remove('is-selected');
}

function initializeSizeSelector() {
    const sizeButtons = document.querySelectorAll('.size-chip');

    sizeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const size = button.dataset.size;
            if (!size) return;

            if (size === 'ALL') {
                INDIVIDUAL_SIZES.forEach((itemSize) => {
                    setIndividualSizeSelection(itemSize, true);
                });
                updateAllSizesButtonState();
                return;
            }

            setIndividualSizeSelection(size, !selectedSizes.has(size));
            updateAllSizesButtonState();
        });
    });
}

function populateSubcategoryOptions(categoryValue) {
    const subcategorySelect = document.getElementById('product-subcategory');
    if (!subcategorySelect) return;

    const options = CATEGORY_SUBCATEGORY_MAP[categoryValue] || [];
    subcategorySelect.innerHTML = options
        .map((option) => `<option value="${option.value}">${option.label}</option>`)
        .join('');
}

function initializeCategoryMapping() {
    const categorySelect = document.getElementById('product-category');
    if (!categorySelect) return;

    populateSubcategoryOptions(categorySelect.value);

    categorySelect.addEventListener('change', () => {
        populateSubcategoryOptions(categorySelect.value);
    });
}

function resetUploadBoxes() {
    document.querySelectorAll('[data-upload-box]').forEach((box) => {
        box.classList.remove('has-image');
        const preview = box.querySelector('.image-upload-preview');
        if (preview) {
            preview.removeAttribute('src');
        }
    });
}

function resetSizeSelector() {
    selectedSizes.clear();
    document.querySelectorAll('.size-chip').forEach((button) => {
        button.classList.remove('is-selected');
    });
}

function resetUploadedImages() {
    uploadedImages.fill('');
}

function createProductPayload(formData) {
    return {
        id: generateProductId(),
        name: String(formData.get('productName') || '').trim(),
        description: String(formData.get('productDescription') || '').trim(),
        category: String(formData.get('productCategory') || '').trim(),
        subcategory: String(formData.get('productSubcategory') || '').trim(),
        price: Number(formData.get('productPrice')) || 0,
        sizes: Array.from(selectedSizes),
        bestseller: formData.get('bestseller') === 'on',
        images: uploadedImages.filter(Boolean),
        createdAt: new Date().toISOString()
    };
}

function initializeAddItemsForm() {
    const form = document.getElementById('add-item-form');
    const feedback = document.getElementById('add-item-feedback');
    if (!form || !feedback) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const product = createProductPayload(formData);

        if (!product.images.length) {
            feedback.textContent = 'Please upload at least one image.';
            return;
        }

        try {
            const API_BASE_URL = 'http://localhost:5001/api';
            const requestBody = JSON.stringify(product);
            
            feedback.textContent = 'Adding product...';
            
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requestBody
            });

            if (!response.ok) {
                throw new Error('Failed to create product in Database.');
            }

            form.reset();
            populateSubcategoryOptions(document.getElementById('product-category').value);
            resetSizeSelector();
            resetUploadedImages();
            resetUploadBoxes();
            
            feedback.textContent = `Product successuflly added!`;
            showSuccessToast();
            
        } catch (error) {
            console.error('Error submitting product:', error);
            feedback.textContent = 'Error adding product: ' + error.message;
        }
    });
}

function initializeAdminLogout() {
    document.querySelectorAll('[data-admin-logout]').forEach((button) => {
        button.addEventListener('click', () => {
            localStorage.removeItem('isAdmin');
            window.location.href = 'admin-login.html';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeAdminLogout();
    initializeImageUploads();
    initializeCategoryMapping();
    initializeSizeSelector();
    initializeAddItemsForm();
});
