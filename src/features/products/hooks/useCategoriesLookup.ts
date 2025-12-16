import { useQuery } from '@tanstack/react-query';
import { categoryService, type LookupResponse } from '../../../services/category.service';

/**
 * Hook for fetching categories lookup (key-value format for select boxes)
 * Uses cached API - returns all active categories
 */
export function useCategoriesLookup() {
    return useQuery({
        queryKey: ['categories', 'lookup'],
        queryFn: () => categoryService.getCategoriesLookup(),
        staleTime: 1000 * 60 * 60, // 1 hour (matches backend cache)
    });
}

