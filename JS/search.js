(function () {
    const SEARCH_MANIFEST_URL = '../Data/search-manifest.json';
    const MAX_RESULTS = 10;
    const DROPDOWN_CLASS = 'search-dropdown';
    const CATEGORY_SUGGESTIONS = [
        { label: 'New in', href: 'products.html?gender=women&category=newin', routeCategory: 'newin', matchTerms: ['new in', 'newin'] },
        { label: 'Clothing', href: 'products.html?gender=women&category=clothing', routeCategory: 'clothing', matchTerms: ['clothing'] },
        { label: 'Shoes', href: 'products.html?gender=women&category=shoes', routeCategory: 'shoes', matchTerms: ['shoes', 'shoe', 'heels', 'boots', 'sandals', 'trainers'] },
        { label: 'Face + Body', href: 'products.html?gender=women&category=facebody', routeCategory: 'facebody', matchTerms: ['face body', 'face + body', 'makeup', 'skin care', 'hair care', 'body care'] },
        { label: 'Accessories', href: 'products.html?gender=women&category=accessories', routeCategory: 'accessories', matchTerms: ['accessories', 'bags', 'jewellery', 'sunglasses', 'belts', 'caps'] },
        { label: 'Activewear', href: 'products.html?gender=women&category=activewear', routeCategory: 'activewear', matchTerms: ['activewear', 'sports bras', 'shorts', 'trainers', 'jackets'] },
        { label: 'Dresses', href: 'products.html?gender=women&category=dresses', routeCategory: 'dresses', matchTerms: ['dresses', 'dress'] },
        { label: 'Tops', href: 'products.html?gender=women&category=tops-clothing', routeCategory: 'tops-clothing', matchTerms: ['tops', 'top'] },
        { label: 'Jumpers', href: 'products.html?gender=women&category=jumpers-cardigans', routeCategory: 'jumpers-cardigans', matchTerms: ['jumpers', 'jumper', 'cardigans', 'cardigan'] },
        { label: 'Jeans & Trousers', href: 'products.html?gender=women&category=jeans', routeCategory: 'jeans', matchTerms: ['jeans', 'trousers', 'denim'] },
        { label: 'Hoodies', href: 'products.html?gender=women&category=hoodies', routeCategory: 'hoodies', matchTerms: ['hoodies', 'hoodie', 'sweatshirts'] },
        { label: 'Blouses', href: 'products.html?gender=women&category=blouses', routeCategory: 'blouses', matchTerms: ['blouses', 'blouse'] },
        { label: 'Skirts', href: 'products.html?gender=women&category=skirts', routeCategory: 'skirts', matchTerms: ['skirts', 'skirt'] },
        { label: 'Shirts', href: 'products.html?gender=women&category=shirts', routeCategory: 'shirts', matchTerms: ['shirts', 'shirt'] },
        { label: 'Makeup', href: 'products.html?gender=women&category=facebody-makeup', routeCategory: 'facebody-makeup', matchTerms: ['makeup'] },
        { label: 'Skin care', href: 'products.html?gender=women&category=facebody-skin-care', routeCategory: 'facebody-skin-care', matchTerms: ['skin care', 'skincare'] },
        { label: 'Hair care', href: 'products.html?gender=women&category=facebody-hair-care', routeCategory: 'facebody-hair-care', matchTerms: ['hair care', 'haircare'] },
        { label: 'Body care', href: 'products.html?gender=women&category=facebody-body-care', routeCategory: 'facebody-body-care', matchTerms: ['body care'] },
        { label: 'Bags', href: 'products.html?gender=women&category=accessories-bags', routeCategory: 'accessories-bags', matchTerms: ['bags', 'bag'] },
        { label: 'Jewellery', href: 'products.html?gender=women&category=accessories-jewellery', routeCategory: 'accessories-jewellery', matchTerms: ['jewellery', 'jewelry', 'rings', 'necklaces', 'bracelets', 'earrings'] },
        { label: 'Sunglasses', href: 'products.html?gender=women&category=accessories-sunglasses', routeCategory: 'accessories-sunglasses', matchTerms: ['sunglasses'] },
        { label: 'Sports bras', href: 'products.html?gender=women&category=activewear-sports-bras', routeCategory: 'activewear-sports-bras', matchTerms: ['sports bras', 'sports bra'] },
        { label: 'Trainers', href: 'products.html?gender=women&category=activewear-trainers', routeCategory: 'activewear-trainers', matchTerms: ['trainers', 'trainer'] }
    ];

    let indexPromise = null;

    function normalize(value) {
        return String(value || '')
            .toLowerCase()
            .replace(/[^a-z0-9+&\s-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function highlightMatch(label, query) {
        const safeLabel = escapeHtml(label);
        if (!query) return safeLabel;

        const normalizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return safeLabel.replace(new RegExp(`(${normalizedQuery})`, 'ig'), '<span class="search-match">$1</span>');
    }

    function dedupeByLabel(items) {
        const seen = new Set();
        return items.filter((item) => {
            const key = normalize(item.label);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    function getTopCategory(path) {
        if (path.includes('/New-in/')) return 'newin';
        if (path.includes('/Clothing/')) return 'clothing';
        if (path.includes('/Shoes/')) return 'shoes';
        if (path.includes('/Face+Body/')) return 'facebody';
        if (path.includes('/Activewear/')) return 'activewear';
        if (path.includes('/Accessories/')) return 'accessories';
        return 'clothing';
    }

    function getRouteCategory(path) {
        const slug = path.split('/').pop().replace('.json', '');

        if (path.includes('/New-in/')) {
            if (slug === 'jeans-trousers') return 'jeans';
            return slug;
        }

        if (path.includes('/Clothing/')) {
            if (slug === 'tops') return 'tops-clothing';
            if (slug === 'shorts') return 'shorts-clothing';
            if (slug === 'coats-Jackets') return 'coats-jackets';
            if (slug === 'suits-Tailoring') return 'suits-tailoring';
            return slug;
        }

        if (path.includes('/Face+Body/')) {
            return `facebody-${slug}`;
        }

        if (path.includes('/Activewear/')) {
            return `activewear-${slug}`;
        }

        if (path.includes('/Accessories/Bags/')) return 'accessories-bags';
        if (path.includes('/Accessories/Jewellery/')) return 'accessories-jewellery';
        if (path.includes('/Accessories/Product/')) return `accessories-${slug}`;

        return slug.toLowerCase();
    }

    function buildSearchHref(query, routeCategory) {
        const params = new URLSearchParams();
        params.set('gender', 'women');
        params.set('category', routeCategory || 'clothing');
        if (query) params.set('q', query);
        return `products.html?${params.toString()}`;
    }

    async function loadIndex() {
        const manifestResponse = await fetch(SEARCH_MANIFEST_URL);
        const manifest = await manifestResponse.json();
        const files = Array.isArray(manifest) ? manifest : [];
        const responses = await Promise.all(files.map((path) => fetch(path).then((response) => response.json())));
        const products = [];

        responses.forEach((items, index) => {
            const path = files[index];
            if (!Array.isArray(items)) return;

            items.forEach((item) => {
                const name = String(item.name || '').trim();
                if (!name) return;

                const routeCategory = getRouteCategory(path);
                const topCategory = getTopCategory(path);
                products.push({
                    id: item.id || `${routeCategory}-${name}`,
                    label: name,
                    name,
                    nameLower: normalize(name),
                    routeCategory,
                    topCategory,
                    href: buildSearchHref(name, routeCategory)
                });
            });
        });

        const countsByRouteCategory = products.reduce((acc, item) => {
            acc[item.routeCategory] = (acc[item.routeCategory] || 0) + 1;
            return acc;
        }, {});

        const countsByTopCategory = products.reduce((acc, item) => {
            acc[item.topCategory] = (acc[item.topCategory] || 0) + 1;
            return acc;
        }, {});

        return { products, countsByRouteCategory, countsByTopCategory };
    }

    function ensureIndex() {
        if (!indexPromise) {
            indexPromise = loadIndex().catch((error) => {
                console.error('Search index failed to load:', error);
                return { products: [], countsByRouteCategory: {}, countsByTopCategory: {} };
            });
        }

        return indexPromise;
    }

    function scoreValue(value, query) {
        if (value === query) return 400;
        if (value.startsWith(query)) return 300;
        if (value.includes(` ${query}`)) return 220;
        if (value.includes(query)) return 160;
        return 0;
    }

    function getCategoryCount(item, indexData) {
        return indexData.countsByRouteCategory[item.routeCategory]
            || indexData.countsByTopCategory[item.routeCategory]
            || 0;
    }

    function searchIndex(query, indexData) {
        const normalizedQuery = normalize(query);
        if (!normalizedQuery) return [];

        const categoryResults = CATEGORY_SUGGESTIONS
            .map((item) => {
                const haystack = normalize(`${item.label} ${item.matchTerms.join(' ')}`);
                const score = scoreValue(haystack, normalizedQuery);
                return score > 0
                    ? {
                        type: 'category',
                        label: item.label,
                        href: `${item.href}${item.href.includes('?') ? '&' : '?'}q=${encodeURIComponent(query.trim())}`,
                        count: getCategoryCount(item, indexData),
                        score
                    }
                    : null;
            })
            .filter(Boolean)
            .sort((a, b) => b.score - a.score || b.count - a.count);

        const groupedProducts = new Map();
        indexData.products.forEach((product) => {
            const score = scoreValue(product.nameLower, normalizedQuery);
            if (!score) return;

            const key = normalize(product.name);
            const existing = groupedProducts.get(key);
            if (existing) {
                existing.count += 1;
                existing.score = Math.max(existing.score, score);
                return;
            }

            groupedProducts.set(key, {
                type: 'product',
                label: product.name,
                href: product.href,
                count: 1,
                score
            });
        });

        const productResults = Array.from(groupedProducts.values())
            .sort((a, b) => b.score - a.score || b.count - a.count || a.label.localeCompare(b.label));

        return dedupeByLabel([...categoryResults, ...productResults]).slice(0, MAX_RESULTS);
    }

    function renderState(dropdownList, message) {
        dropdownList.innerHTML = `<div class="search-dropdown-state">${escapeHtml(message)}</div>`;
    }

    function renderResults(dropdown, dropdownList, query, results, activeIndex) {
        if (!query.trim()) {
            dropdown.hidden = true;
            dropdownList.innerHTML = '';
            return;
        }

        if (!results.length) {
            dropdown.hidden = false;
            renderState(dropdownList, 'No results found');
            return;
        }

        dropdown.hidden = false;
        dropdownList.innerHTML = results.map((item, index) => `
            <a href="${item.href}" class="search-suggestion${index === activeIndex ? ' is-active' : ''}" data-index="${index}">
                <span class="search-suggestion-label">${highlightMatch(item.label, query.trim())}</span>
                <span class="search-suggestion-count">${item.count.toLocaleString()}</span>
            </a>
        `).join('');
    }

    function setupSearch(searchBox) {
        const input = searchBox.querySelector('#search-input, input[type="text"]');
        const button = searchBox.querySelector('.search-button');
        const header = document.getElementById('header');
        const mobileTrigger = document.querySelector('.mobile-search-trigger');
        if (!input || !button) return;

        searchBox.classList.add('search-box--dynamic');

        const clearButton = document.createElement('button');
        clearButton.type = 'button';
        clearButton.className = 'search-clear';
        clearButton.setAttribute('aria-label', 'Clear search');
        clearButton.innerHTML = '<i class="fas fa-times"></i>';
        button.insertAdjacentElement('beforebegin', clearButton);

        const dropdown = document.createElement('div');
        dropdown.className = DROPDOWN_CLASS;
        dropdown.hidden = true;

        const dropdownList = document.createElement('div');
        dropdownList.className = 'search-dropdown-list';
        dropdown.appendChild(dropdownList);
        searchBox.appendChild(dropdown);

        let results = [];
        let activeIndex = 0;
        let requestId = 0;

        function openDropdown() {
            if (input.value.trim()) {
                dropdown.hidden = false;
            }
        }

        function closeDropdown() {
            dropdown.hidden = true;
        }

        function syncValueState() {
            searchBox.classList.toggle('has-value', Boolean(input.value.trim()));
        }

        function getActiveResult() {
            return results[activeIndex] || results[0] || null;
        }

        function navigateToResult(target) {
            const query = input.value.trim();
            if (target?.href) {
                window.location.href = target.href;
                return;
            }

            window.location.href = buildSearchHref(query, 'clothing');
        }

        async function updateResults() {
            const currentQuery = input.value.trim();
            syncValueState();

            if (!currentQuery) {
                results = [];
                activeIndex = 0;
                closeDropdown();
                return;
            }

            const currentRequest = ++requestId;
            openDropdown();
            renderState(dropdownList, 'Searching...');

            const indexData = await ensureIndex();
            if (currentRequest !== requestId) return;

            results = searchIndex(currentQuery, indexData);
            activeIndex = 0;
            renderResults(dropdown, dropdownList, currentQuery, results, activeIndex);
        }

        input.addEventListener('focus', () => {
            ensureIndex();
            syncValueState();
            if (input.value.trim()) openDropdown();
        });

        input.addEventListener('input', updateResults);

        input.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown') {
                if (!results.length) return;
                event.preventDefault();
                activeIndex = (activeIndex + 1) % results.length;
                renderResults(dropdown, dropdownList, input.value, results, activeIndex);
                return;
            }

            if (event.key === 'ArrowUp') {
                if (!results.length) return;
                event.preventDefault();
                activeIndex = (activeIndex - 1 + results.length) % results.length;
                renderResults(dropdown, dropdownList, input.value, results, activeIndex);
                return;
            }

            if (event.key === 'Enter') {
                event.preventDefault();
                navigateToResult(getActiveResult());
                return;
            }

            if (event.key === 'Escape') {
                closeDropdown();
            }
        });

        button.addEventListener('click', (event) => {
            event.preventDefault();
            navigateToResult(getActiveResult());
        });

        clearButton.addEventListener('click', () => {
            input.value = '';
            syncValueState();
            results = [];
            closeDropdown();
            input.focus();
        });

        dropdown.addEventListener('mousedown', (event) => {
            const target = event.target.closest('.search-suggestion');
            if (!target) return;
            event.preventDefault();
            window.location.href = target.href;
        });

        document.addEventListener('click', (event) => {
            if (!searchBox.contains(event.target)) {
                closeDropdown();
            }

            if (header && mobileTrigger && window.innerWidth <= 799) {
                const clickedTrigger = mobileTrigger.contains(event.target);
                const clickedHeader = header.contains(event.target);
                if (!clickedTrigger && !clickedHeader) {
                    header.classList.remove('mobile-search-open');
                }
            }
        });

        if (mobileTrigger && header) {
            mobileTrigger.addEventListener('click', () => {
                if (window.innerWidth > 799) {
                    input.focus();
                    return;
                }

                const isOpen = header.classList.toggle('mobile-search-open');
                if (isOpen) {
                    setTimeout(() => input.focus(), 0);
                }
            });
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth > 799 && header) {
                header.classList.remove('mobile-search-open');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.search-box').forEach(setupSearch);
    });
})();
