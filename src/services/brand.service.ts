import { api } from './api';

export interface Brand {
    id: string;
    name: string;
    discountPercent: number;
    isPromotional?: boolean;
    displayOrder?: number | null;
    createdAt: string;
}

export interface BrandListParams {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
}

export interface BrandListResponse {
    items: Brand[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface LookupItem {
    key: string;
    value: string;
}

export interface LookupResponse {
    items: LookupItem[];
    cachedAt?: string;
    cacheKey?: string;
}

export const brandService = {
    getBrands: async (params: BrandListParams = {}): Promise<BrandListResponse> => {
        const response = await api.get<Brand[]>('/brands', { params });
        const pagination = (response as any).pagination || {};
        
        return {
            items: Array.isArray(response.data) ? response.data : [],
            totalCount: pagination.totalCount || 0,
            page: pagination.page || 1,
            pageSize: pagination.pageSize || 10,
            totalPages: pagination.totalPages || 1,
        };
    },

    getBrandById: async (id: string): Promise<Brand> => {
        const response = await api.get<Brand>(`/brands/${id}`);
        return response.data;
    },

    /**
     * Get brands lookup (key-value format for select boxes)
     * Cached API - returns all active brands
     */
    getBrandsLookup: async (): Promise<LookupResponse> => {
        const response = await api.get<LookupResponse>('/brands/lookup');
        return response.data;
    },
};

import type { Product } from '../types/product.types';

export interface PromotionalBrand {
    brand: Brand;
    featuredProduct: Product;
}

export interface PromotionalBrandsResponse {
    items: PromotionalBrand[];
}

export const promotionalBrandService = {
    getPromotionalBrands: async (): Promise<PromotionalBrandsResponse> => {
        const response = await api.get<PromotionalBrand[]>('/brands/promotional');
        return {
            items: Array.isArray(response.data) ? response.data : [],
        };
    },
};

