import { api } from './api';

export interface Category {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    parentName: string | null;
    discountPercent: number;
    createdAt: string;
}

export interface CategoryListParams {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    parentId?: string;
    includeChildren?: boolean;
}

export interface CategoryListResponse {
    items: Category[];
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

export const categoryService = {
    getCategories: async (params: CategoryListParams = {}): Promise<CategoryListResponse> => {
        const response = await api.get<Category[]>('/categories', { params });
        const pagination = (response as any).pagination || {};
        
        return {
            items: Array.isArray(response.data) ? response.data : [],
            totalCount: pagination.totalCount || 0,
            page: pagination.page || 1,
            pageSize: pagination.pageSize || 10,
            totalPages: pagination.totalPages || 1,
        };
    },

    getCategoryById: async (id: string): Promise<Category> => {
        const response = await api.get<Category>(`/categories/${id}`);
        return response.data;
    },

    getCategoryBySlug: async (slug: string): Promise<Category> => {
        const response = await api.get<Category>(`/categories/slug/${slug}`);
        return response.data;
    },

    /**
     * Get categories lookup (key-value format for select boxes)
     * Cached API - returns all active categories
     */
    getCategoriesLookup: async (): Promise<LookupResponse> => {
        const response = await api.get<LookupResponse>('/categories/lookup');
        return response.data;
    },
};


