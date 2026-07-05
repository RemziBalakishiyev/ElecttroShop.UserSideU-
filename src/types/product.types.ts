export interface ProductImage {
    id?: string;
    imageId?: string;
    imageUrl?: string;
    url?: string;
    imagePath?: string;
    displayOrder?: number;
    isPrimary?: boolean;
}

export interface CategoryAttributeValue {
    id: string;
    value: string;
    displayValue: string;
    displayOrder: number;
    colorCode: string | null;
}

export interface CategoryAttribute {
    id: string;
    name: string;
    displayName: string;
    attributeType: string;
    isRequired: boolean;
    displayOrder: number;
    values: CategoryAttributeValue[];
}

export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    finalDiscountPercent?: number | null;
    finalPrice?: number | null;
    currency: string;
    sku: string;
    categoryId?: string;
    categoryName: string;
    brandId?: string;
    brandName: string;
    stock: number;
    imageUrl?: string | null;
    mainImageUrl?: string | null;
    thumbnailUrl?: string | null;
    imagePath?: string | null;
    imageId?: string | null;
    primaryImageUrl?: string | null; // Backend-dən avtomatik set edilir (Cloudinary URL və ya köhnə path)
    images?: ProductImage[]; // GetProductById-dən qayıdanda mövcuddur
    categoryAttributes?: CategoryAttribute[]; // GetProductById-dən qayıdanda mövcuddur
    isActive?: boolean;
    vatRate?: number;
    createdAt?: string;
    updatedAt?: string;
    isBanner?: boolean;
    isFeatured?: boolean;
    isPopular?: boolean;
    displayOrder?: number | null;
}
