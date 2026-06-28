import { api } from './api';
import type { Product } from '../types/product.types';

export interface ProductListParams {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    categoryId?: string;
    brandId?: string;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
}

export interface ProductListResponse {
    items: Product[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export const productService = {
    getProducts: async (params: ProductListParams = {}): Promise<ProductListResponse> => {
        const response = await api.get<Product[]>('/products', { params });
        const pagination = (response as any).pagination || {};
        
        return {
            items: Array.isArray(response.data) ? response.data : [],
            totalCount: pagination.totalCount || 0,
            page: pagination.page || 1,
            pageSize: pagination.pageSize || 10,
            totalPages: pagination.totalPages || 1,
        };
    },

    getProductById: async (id: string): Promise<Product> => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    searchProducts: async (searchTerm: string, params?: Omit<ProductListParams, 'searchTerm'>): Promise<ProductListResponse> => {
        const response = await api.get<Product[]>('/products/search', {
            params: { searchTerm, ...params },
        });
        const pagination = (response as any).pagination || {};
        
        return {
            items: Array.isArray(response.data) ? response.data : [],
            totalCount: pagination.totalCount || 0,
            page: pagination.page || 1,
            pageSize: pagination.pageSize || 10,
            totalPages: pagination.totalPages || 1,
        };
    },

    getBannerProduct: async (): Promise<Product | null> => {
        try {
            const response = await api.get<Product>('/products/banner');
            return response.data;
        } catch (error: any) {
            // If banner not found (404), return null
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    getBannerProducts: async (): Promise<Product[]> => {
        const sortByDisplayOrder = (products: Product[]) =>
            [...products].sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

        try {
            const response = await api.get<Product[]>('/products/banners');
            const products = Array.isArray(response.data) ? response.data : [];
            if (products.length > 0) {
                return sortByDisplayOrder(products);
            }
        } catch (error: any) {
            if (error.response?.status !== 404) {
                throw error;
            }
        }

        const [banner, featured] = await Promise.all([
            productService.getBannerProduct(),
            productService.getFeaturedProducts(),
        ]);

        const slides: Product[] = [];
        if (banner) {
            slides.push(banner);
        }
        for (const product of featured) {
            if (!slides.some((slide) => slide.id === product.id)) {
                slides.push(product);
            }
        }

        return slides;
    },

    getFeaturedProducts: async (): Promise<Product[]> => {
        const response = await api.get<Product[]>('/products/featured');
        const products = Array.isArray(response.data) ? response.data : [];
        // Sort by displayOrder if available
        return products.sort((a, b) => {
            const orderA = (a as any).displayOrder ?? 999;
            const orderB = (b as any).displayOrder ?? 999;
            return orderA - orderB;
        });
    },

    getPopularProducts: async (): Promise<Product[]> => {
        const response = await api.get<Product[]>('/products/popular');
        const products = Array.isArray(response.data) ? response.data : [];
        return products.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
    },

    getDiscountedProducts: async (): Promise<Product[]> => {
        const sortByDiscount = (products: Product[]) =>
            [...products]
                .filter((product) => (product.finalDiscountPercent ?? 0) > 0)
                .sort((a, b) => (b.finalDiscountPercent ?? 0) - (a.finalDiscountPercent ?? 0));

        try {
            const response = await api.get<Product[]>('/products/discounted');
            const products = Array.isArray(response.data) ? response.data : [];
            if (products.length > 0) {
                return sortByDiscount(products);
            }
        } catch (error: any) {
            if (error.response?.status !== 404) {
                throw error;
            }
        }

        const { items } = await productService.getProducts({
            page: 1,
            pageSize: 50,
            isActive: true,
        });

        return sortByDiscount(items);
    },
};

