import type { Product, ProductImage } from '../types/product.types';

type ProductImageSource = Pick<
    Product,
    'imageUrl' | 'mainImageUrl' | 'thumbnailUrl' | 'primaryImageUrl' | 'imagePath' | 'imageId' | 'images'
>;

export function resolveProductImage(product?: ProductImageSource | null): string | null {
    if (!product) return null;

    if (product.imageUrl) return product.imageUrl;
    if (product.mainImageUrl) return product.mainImageUrl;
    if (product.primaryImageUrl) return product.primaryImageUrl;
    if (product.thumbnailUrl) return product.thumbnailUrl;
    if (product.imagePath) return product.imagePath;
    if (product.imageId) return product.imageId;

    const firstImage = product.images?.[0];
    if (firstImage) {
        return resolveImageEntry(firstImage);
    }

    return null;
}

export function resolveImageEntry(image?: ProductImage | null): string | null {
    if (!image) return null;

    if (image.imageUrl) return image.imageUrl;
    if (image.url) return image.url;
    if (image.imagePath) return image.imagePath;
    if (image.id) return image.id;

    return null;
}
