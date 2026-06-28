import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../../../services/category.service';

/**
 * Hook for fetching categories lookup (key-value format for select boxes)
 * Uses cached API - returns all active categories (root + children)
 */
export function useCategoriesLookup() {
    return useQuery({
        queryKey: ['categories', 'lookup', 'all'],
        queryFn: () => categoryService.getCategoriesLookup({ includeAll: true }),
        staleTime: 1000 * 60 * 60, // 1 hour (matches backend cache)
    });
}

