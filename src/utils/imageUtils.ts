const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:44312/api';

/**
 * Get image URL from imageId
 * @param imageId - Image ID (Guid)
 * @returns Full image URL or placeholder
 */
export function getImageUrl(imageId: string | null | undefined): string {
    if (!imageId) {
        return '/placeholder-image.jpg';
    }
    return `${API_URL}/images/${imageId}`;
}

/**
 * Get product image URL
 * @param product - Product object with imageId or imageUrl
 * @returns Full image URL or placeholder
 */
export function getProductImageUrl(product: { imageId?: string | null; imageUrl?: string | null }): string {
    if (product.imageId) {
        return getImageUrl(product.imageId);
    }
    if (product.imageUrl && product.imageUrl.startsWith('http')) {
        return product.imageUrl;
    }
    if (product.imageUrl && product.imageUrl.startsWith('/api/images/')) {
        // Extract imageId from /api/images/{imageId}
        const imageId = product.imageUrl.replace('/api/images/', '');
        return getImageUrl(imageId);
    }
    return '/placeholder-image.jpg';
}

