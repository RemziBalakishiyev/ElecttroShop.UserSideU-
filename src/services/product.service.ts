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
};

