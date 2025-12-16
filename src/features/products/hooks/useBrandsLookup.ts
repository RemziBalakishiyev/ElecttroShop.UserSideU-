import { useQuery } from '@tanstack/react-query';
import { brandService, type LookupResponse } from '../../../services/brand.service';

/**
 * Hook for fetching brands lookup (key-value format for select boxes)
 * Uses cached API - returns all active brands
 */
export function useBrandsLookup() {
    return useQuery({
        queryKey: ['brands', 'lookup'],
        queryFn: () => brandService.getBrandsLookup(),
        staleTime: 1000 * 60 * 60, // 1 hour (matches backend cache)
    });
}

