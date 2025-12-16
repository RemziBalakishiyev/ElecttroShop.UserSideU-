import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { brandService, type BrandListParams } from '../../../services/brand.service';

export function useBrands(params: BrandListParams = {}) {
    // Serialize params for stable query key
    const serializedParams = useMemo(() => {
        const cleanParams: Record<string, any> = {};
        if (params.page !== undefined) cleanParams.page = params.page;
        if (params.pageSize !== undefined) cleanParams.pageSize = params.pageSize;
        if (params.searchTerm) cleanParams.searchTerm = params.searchTerm;
        return cleanParams;
    }, [params.page, params.pageSize, params.searchTerm]);

    return useQuery({
        queryKey: ['brands', serializedParams],
        queryFn: () => brandService.getBrands(params),
    });
}


