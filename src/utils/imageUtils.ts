const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:44312/api';

/**
 * Normalize image URL - removes duplicate /api/ prefix
 * @param url - Image URL (can be /api/images/... or full URL)
 * @returns Normalized full image URL
 */
function normalizeImageUrl(url: string | null | undefined): string | null {
    if (!url) {
        return null;
    }
    // Əgər tam URL-dirsə (http/https ilə başlayırsa), olduğu kimi qaytar
    if (url.startsWith('http')) {
        return url;
    }
    // Əgər /api/images/ ilə başlayırsa, /api hissəsini sil və API_URL ilə birləşdir
    if (url.startsWith('/api/images/')) {
        // /api/images/... -> /images/...
        const imagePath = url.replace('/api', '');
        return `${API_URL}${imagePath}`;
    }
    // Əgər /images/ ilə başlayırsa, birbaşa API_URL ilə birləşdir
    if (url.startsWith('/images/')) {
        return `${API_URL}${url}`;
    }
    // Əgər sadəcə path-dirsə, API_URL ilə birləşdir
    return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * Get image URL from imageId
 * @param imageId - Image ID (Guid)
 * @param extension - Optional extension (jpg, png, etc.)
 * @returns Full image URL or placeholder
 */
export function getImageUrl(imageId: string | null | undefined, extension?: string): string {
    if (!imageId) {
        return '/placeholder-image.jpg';
    }
    // Extension varsa əlavə et, yoxdursa extension-sız istifadə et (backward compatibility)
    if (extension) {
        return `${API_URL}/images/${imageId}.${extension}`;
    }
    return `${API_URL}/images/${imageId}`;
}

/**
 * Get product image URL
 * Priority: primaryImageUrl > imageUrl > imageId
 * @param product - Product object with primaryImageUrl, imageUrl, or imageId
 * @returns Full image URL or placeholder
 */
export function getProductImageUrl(product: { 
    primaryImageUrl?: string | null; 
    imageUrl?: string | null; 
    imageId?: string | null;
}): string {
    // 1. primaryImageUrl (backend-dən avtomatik set edilir, extension ilə)
    const normalizedPrimaryUrl = normalizeImageUrl(product.primaryImageUrl);
    if (normalizedPrimaryUrl) {
        return normalizedPrimaryUrl;
    }
    
    // 2. imageUrl (legacy support)
    const normalizedImageUrl = normalizeImageUrl(product.imageUrl);
    if (normalizedImageUrl) {
        return normalizedImageUrl;
    }
    
    // 3. imageId (fallback)
    if (product.imageId) {
        return getImageUrl(product.imageId);
    }
    
    return '/placeholder-image.jpg';
}

/**
 * Get image URL from ProductImage object (for image gallery)
 * @param image - ProductImage object with imageUrl or imageId
 * @returns Full image URL or placeholder
 */
export function getProductImageUrlFromImage(image: {
    imageUrl?: string | null;
    imageId?: string | null;
}): string {
    const normalizedUrl = normalizeImageUrl(image.imageUrl);
    if (normalizedUrl) {
        return normalizedUrl;
    }
    
    if (image.imageId) {
        return getImageUrl(image.imageId);
    }
    
    return '/placeholder-image.jpg';
}


