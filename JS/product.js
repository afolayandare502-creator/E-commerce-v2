// Fetch and display single product on the product detail page
document.addEventListener('DOMContentLoaded', () => {
    fetchProduct();
});

async function fetchProduct() {
    try {
        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (!productId) {
            console.error('Product ID not found in URL');
            return;
        }
        
        // Fetch product data
        const response = await fetch('../Data/women-products.json');
        const products = await response.json();
        
        // Find product that matches the ID
        const product = products.find(p => p.id === parseInt(productId));
        
        if (!product) {
            console.error('Product not found');
            return;
        }
        
        renderProduct(product);
    } catch (error) {
        console.error('Error fetching product:', error);
    }
}

function renderProduct(product) {
    const productContainer = document.getElementById('product-container');
    
    if (!productContainer) {
        console.error('Product container not found');
        return;
    }
    
    productContainer.innerHTML = `
        <div class="product-detail">
            <div class="product-image-section">
                <img src="${product.image}" alt="${product.name}" class="product-detail-image">
            </div>
            <div class="product-info-section">
                <h1 class="product-detail-name">${product.name}</h1>
                <p class="product-detail-price">$${product.price}</p>
                <button class="add-to-cart-btn">Add to Cart</button>
            </div>
        </div>
    `;
}