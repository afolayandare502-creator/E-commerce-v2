(function () {
    const REVIEW_NAMES = [
        'Elijah Andrew',
        'Maya Carter',
        'Sophie Bennett',
        'Amara Wilson',
        'Jade Morgan',
        'Nora Hayes',
        'Chloe Adams',
        'Ava Brooks'
    ];

    const REVIEW_COPY = [
        {
            rating: 5,
            title: 'Great quality and perfect fit',
            comment: 'The material feels good and the fit is exactly what I hoped for. It looks clean in person and feels comfortable for a full day out.'
        },
        {
            rating: 4,
            title: 'Looks even better in person',
            comment: 'Really happy with the finish and shape. It has a polished look without feeling too heavy, and it was easy to style.'
        },
        {
            rating: 5,
            title: 'Comfortable and stylish',
            comment: 'This became one of my favorite pieces quickly. The quality feels reliable, the sizing was right, and the color is very flattering.'
        },
        {
            rating: 4,
            title: 'Nice purchase overall',
            comment: 'The product matched the photos well and feels good for the price. I would buy it again, especially for everyday wear.'
        },
        {
            rating: 5,
            title: 'Exactly what I needed',
            comment: 'I liked the fit, the fabric, and the way it sits. It feels put together without needing much effort.'
        },
        {
            rating: 4,
            title: 'Good value for the price',
            comment: 'The quality surprised me in a good way. It is comfortable, easy to wear, and arrived looking just like the pictures.'
        }
    ];

    function hashValue(value) {
        const text = String(value || 'product');
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = ((hash << 5) - hash) + text.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    function daysAgo(days) {
        return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    }

    function getSeededProductReviews(productId, existingCount = 0) {
        const seed = hashValue(productId);
        const targetCount = 3 + (seed % 2);
        const needed = Math.max(targetCount - existingCount, 0);
        const dateOffsets = [13, 24, 41, 58];

        return Array.from({ length: needed }, (_, index) => {
            const copy = REVIEW_COPY[(seed + index) % REVIEW_COPY.length];
            return {
                _id: `seeded-${productId || 'product'}-${index + 1}`,
                productId,
                rating: copy.rating,
                title: copy.title,
                author: REVIEW_NAMES[(seed + index * 2) % REVIEW_NAMES.length],
                comment: copy.comment,
                createdAt: daysAgo(dateOffsets[(seed + index) % dateOffsets.length]),
                seeded: true
            };
        });
    }

    function withSeededProductReviews(productId, reviews) {
        const realReviews = Array.isArray(reviews) ? reviews : [];
        return [
            ...realReviews,
            ...getSeededProductReviews(productId, realReviews.length)
        ];
    }

    window.getSeededProductReviews = getSeededProductReviews;
    window.withSeededProductReviews = withSeededProductReviews;
})();
