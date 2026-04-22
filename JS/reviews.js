document.addEventListener('DOMContentLoaded', async () => {
    // 1. Parse URL Parameters
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const category = params.get('category');
    const gender = params.get('gender');

    if (!productId) {
        document.getElementById('reviews-grid').innerHTML = '<div style="padding:20px; color:red;">No product specified!</div>';
        return;
    }

    // 2. Fetch logic setup
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_BASE_URL = isLocal ? 'http://localhost:5001' : 'https://e-commerce-backend-4rnw.onrender.com';

    // 3. Optional: display product brief overview
    if (typeof findProductById === 'function') {
        const product = await findProductById(productId, category);
        if (product) {
            const imgUrl = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : (product.image || '');
            document.getElementById('product-overview-container').innerHTML = `
                <div style="display:flex; gap:16px; margin-bottom:30px; padding:16px; border:1px solid #eee; border-radius:12px; background:#fff;">
                    <img src="${imgUrl}" alt="${product.name}" style="width:80px; height:100px; object-fit:cover; border-radius:8px;">
                    <div style="display:flex; flex-direction:column; justify-content:center;">
                        <h2 style="margin:0 0 8px 0; font-size:18px;">${product.name}</h2>
                        <div style="font-weight:700; font-size:16px;">$${Number(product.price).toFixed(2)}</div>
                    </div>
                </div>
            `;
        }
    }

    // 4. Fetch Reviews
    let reviews = [];
    try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/${productId}`);
        if (res.ok) {
            reviews = await res.json();
        } else {
            console.warn('Backend endpoint not found yet (maybe not deployed). Using mock data.');
            reviews = generateMockFallbackReviews(productId);
        }
    } catch (e) {
        console.warn('Backend fetch failed. Using mock data.', e);
        reviews = generateMockFallbackReviews(productId);
    }

    renderReviewsHeader(reviews);
    renderReviews(reviews);

    // 5. Modal Logic
    setupWriteReviewModal(productId, API_BASE_URL);
});

function getStarsHtml(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            html += '<i class="fas fa-star" style="color:#f39c12"></i>';
        } else if (i - rating < 1 && i - rating > 0) {
            html += '<i class="fas fa-star-half-alt" style="color:#f39c12"></i>';
        } else {
            html += '<i class="far fa-star" style="color:#f39c12"></i>';
        }
    }
    return html;
}

function processTimeAgo(dateString) {
    const time = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - time) / (1000 * 3600 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1d ago';
    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
}

function renderReviewsHeader(reviews) {
    const count = reviews.length;
    document.getElementById('total-ratings-count').textContent = `${count} Ratings`;

    if (count === 0) {
        document.getElementById('average-rating').textContent = '0.0';
        document.getElementById('rating-bars').innerHTML = '';
        return;
    }

    let sum = 0;
    const counts = [0, 0, 0, 0, 0, 0]; // 0 index ignored
    reviews.forEach(r => {
        sum += r.rating;
        counts[Math.floor(r.rating)] = (counts[Math.floor(r.rating)] || 0) + 1;
    });

    const avg = (sum / count).toFixed(1);
    document.getElementById('average-rating').textContent = avg;

    let barsHtml = '';
    for (let i = 5; i >= 1; i--) {
        const pct = (counts[i] / count) * 100;
        let starStr = '';
        for(let s=0; s<i; s++) starStr += '★';
        for(let s=5; s>i; s--) starStr += '☆';
        
        barsHtml += `
            <div class="bar-row">
                <span style="font-family: monospace; letter-spacing: 2px;">${starStr}</span>
                <div class="bar-bg">
                    <div class="bar-fill" style="width: ${pct}%"></div>
                </div>
            </div>
        `;
    }
    document.getElementById('rating-bars').innerHTML = barsHtml;
}

function renderReviews(reviews) {
    const grid = document.getElementById('reviews-grid');
    if (reviews.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 40px; color:#666;">No reviews yet. Be the first to review!</div>';
        return;
    }

    grid.innerHTML = '';
    reviews.forEach(review => {
        const dateStr = review.createdAt ? processTimeAgo(review.createdAt) : 'Recently';
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="review-card-header">
                <div>
                    <div class="review-title">${review.title || 'Review'}</div>
                    <div class="review-stars">${getStarsHtml(review.rating)}</div>
                </div>
                <div class="review-meta">
                    <div class="review-date">${dateStr}</div>
                    <div class="review-author" style="color: #666; font-size: 11px;">${review.author}</div>
                </div>
            </div>
            <div class="review-body">
                ${review.comment}
            </div>
        `;
        grid.appendChild(card);
    });
}

function generateMockFallbackReviews(productId) {
    return [
        {
            productId,
            rating: 5,
            title: 'Fantastic',
            author: 'jacklynt',
            comment: 'This product is exactly what I needed to give this 5 stars. The quality is simply incredible. I would definitely purchase this again and recommend it to anyone.',
            createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            productId,
            rating: 4,
            title: 'Very Good, then all of sudden buggy',
            author: 'SaisonXiang',
            comment: 'I’ve used this item for about 1 year. During that time I familiarized myself with its functions. It is generally really good but occasionally it acts up entirely out of nowhere.',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            productId,
            rating: 3,
            title: 'Less usable with each iteration',
            author: 'old-man-yelling-at-cloud',
            comment: 'It serves important functions but the newer designs make it less material and usable. I wish they kept the old classic aesthetic without overcomplicating the fabric choices.',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
}

function setupWriteReviewModal(productId, API_BASE_URL) {
    const modal = document.getElementById('review-modal');
    const openBtn = document.getElementById('open-review-modal');
    const closeBtn = document.getElementById('close-review-modal');
    
    // Quick Rating interactive stars
    document.querySelectorAll('.interactive-stars i').forEach(star => {
        star.addEventListener('click', (e) => {
            const rating = e.target.getAttribute('data-val');
            document.getElementById('review-rating-input').value = rating;
            highlightModalStars(rating);
            modal.classList.add('active');
        });
    });

    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
        if(e.target === modal) modal.classList.remove('active');
    });

    // Modal interior stars
    document.querySelectorAll('#modal-interactive-stars i').forEach(star => {
        star.addEventListener('click', (e) => {
            const rating = e.target.getAttribute('data-val');
            document.getElementById('review-rating-input').value = rating;
            highlightModalStars(rating);
        });
    });

    function highlightModalStars(rating) {
        document.querySelectorAll('#modal-interactive-stars i').forEach(s => {
            if (s.getAttribute('data-val') <= rating) {
                s.className = 'fas fa-star';
            } else {
                s.className = 'far fa-star';
            }
        });
    }

    document.getElementById('write-review-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const rating = document.getElementById('review-rating-input').value;
        const author = document.getElementById('review-author').value;
        const title = document.getElementById('review-title').value;
        const comment = document.getElementById('review-comment').value;

        if (!rating) {
            alert('Please select a star rating.');
            return;
        }

        const payload = { productId, rating, title, author, comment };
        const btn = document.getElementById('submit-review-btn');
        btn.textContent = 'Submitting...';

        try {
            await fetch(\`\${API_BASE_URL}/api/reviews\`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });
            // Reload page to fetch updated reviews
            window.location.reload();
        } catch (err) {
            console.error('Error submitting review', err);
            alert('Could not submit review. If backend is asleep, try again in 30s.');
            btn.textContent = 'Submit Review';
        }
    });
}
