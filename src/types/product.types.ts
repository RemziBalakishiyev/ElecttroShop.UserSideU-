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
    imageId?: string | null;
    isActive?: boolean;
    vatRate?: number;
    createdAt?: string;
    updatedAt?: string;
    isBanner?: boolean;
    isFeatured?: boolean;
    displayOrder?: number | null;
}
