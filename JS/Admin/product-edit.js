const PRODUCT_EDIT_API_BASE_URL = 'https://e-commerce-backend-4rnw.onrender.com/api';

let editingProduct = null;

function getProductEditImagePath(imagePath) {
    if (!imagePath) return '../../images/1.png';
    if (imagePath.startsWith('../images/')) return '../' + imagePath;
    return imagePath;
}

function formatEditPrice(value) {
    const amount = Number(value || 0);
    return '$' + amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function getEditableProductId() {
    return new URLSearchParams(window.location.search).get('id');
}

function setEditStatus(message, type = 'info') {
    const status = document.getElementById('product-edit-status');
    if (!status) return;
    status.textContent = message;
    status.dataset.type = type;
    status.style.display = message ? 'block' : 'none';
}

function syncPricePreview() {
    const price = Number(document.getElementById('edit-product-price').value || 0);
    const oldPriceValue = document.getElementById('edit-product-old-price').value;
    const oldPrice = oldPriceValue === '' ? null : Number(oldPriceValue);
    const previewPrice = document.getElementById('product-edit-preview-price');
    const discount = document.getElementById('product-edit-discount');

    if (oldPrice && oldPrice > price && price >= 0) {
        const pct = Math.round(((oldPrice - price) / oldPrice) * 100);
        previewPrice.innerHTML = `
            <span class="preview-old-price">${formatEditPrice(oldPrice)}</span>
            <strong>${formatEditPrice(price)}</strong>
            <span class="preview-discount">${pct}% OFF</span>
        `;
        discount.textContent = `${pct}% discount will show on the storefront.`;
    } else {
        previewPrice.innerHTML = `<strong>${formatEditPrice(price)}</strong>`;
        discount.textContent = oldPrice ? 'Old price must be higher than current price to show a discount.' : '';
    }
}

function hydrateEditForm(product) {
    editingProduct = product;
    document.getElementById('edit-product-name').value = product.name || '';
    document.getElementById('edit-product-description').value = product.description || '';
    document.getElementById('edit-product-price').value = product.price ?? 0;
    document.getElementById('edit-product-old-price').value = product.oldPrice ?? '';
    document.getElementById('edit-product-stock').value = product.stock ?? 0;
    document.getElementById('edit-product-sold-out').checked = Boolean(product.soldOut);

    document.getElementById('product-edit-preview-name').textContent = product.name || 'Product';
    document.getElementById('product-edit-image').src = getProductEditImagePath(
        Array.isArray(product.images) && product.images.length ? product.images[0] : product.image
    );

    syncPricePreview();
    document.getElementById('product-edit-form').style.display = 'grid';
    setEditStatus('');
}

async function loadEditableProduct() {
    const productId = getEditableProductId();
    if (!productId) {
        setEditStatus('No product selected.', 'error');
        return;
    }

    try {
        const res = await fetch(`${PRODUCT_EDIT_API_BASE_URL}/products/${encodeURIComponent(productId)}`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Product not found.');
        }

        hydrateEditForm(data);
    } catch (error) {
        console.error('Product edit load error:', error);
        setEditStatus(error.message || 'Unable to load product.', 'error');
    }
}

async function submitProductUpdate(event) {
    event.preventDefault();

    if (!editingProduct) return;

    const token = localStorage.getItem('token');
    const productId = editingProduct._id || editingProduct.customId;
    const oldPriceValue = document.getElementById('edit-product-old-price').value;
    const payload = {
        name: document.getElementById('edit-product-name').value.trim(),
        description: document.getElementById('edit-product-description').value.trim(),
        price: Number(document.getElementById('edit-product-price').value || 0),
        oldPrice: oldPriceValue === '' ? null : Number(oldPriceValue),
        stock: Number(document.getElementById('edit-product-stock').value || 0),
        soldOut: document.getElementById('edit-product-sold-out').checked
    };

    const submitBtn = document.querySelector('.product-edit-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    setEditStatus('Saving product...', 'info');

    try {
        const res = await fetch(`${PRODUCT_EDIT_API_BASE_URL}/products/${encodeURIComponent(productId)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Unable to update product.');
        }

        hydrateEditForm(data);
        setEditStatus('Product updated successfully.', 'success');
    } catch (error) {
        console.error('Product edit save error:', error);
        setEditStatus(error.message || 'Unable to update product.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-admin-logout]').forEach((button) => {
        button.addEventListener('click', () => {
            localStorage.removeItem('isAdmin');
            window.location.href = 'admin-login.html';
        });
    });

    ['edit-product-price', 'edit-product-old-price'].forEach((id) => {
        document.getElementById(id).addEventListener('input', syncPricePreview);
    });

    document.getElementById('edit-product-name').addEventListener('input', (event) => {
        document.getElementById('product-edit-preview-name').textContent = event.target.value || 'Product';
    });

    document.getElementById('product-edit-form').addEventListener('submit', submitProductUpdate);
    loadEditableProduct();
});
