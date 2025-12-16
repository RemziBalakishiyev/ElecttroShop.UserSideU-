import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { productService, type ProductListParams } from '../../../services/product.service';

export function useProducts(params: ProductListParams = {}) {
    // Serialize params for stable query key
    const serializedParams = useMemo(() => {
        const cleanParams: Record<string, any> = {};
        if (params.page !== undefined) cleanParams.page = params.page;
        if (params.pageSize !== undefined) cleanParams.pageSize = params.pageSize;
        if (params.searchTerm) cleanParams.searchTerm = params.searchTerm;
        if (params.categoryId) cleanParams.categoryId = params.categoryId;
        if (params.brandId) cleanParams.brandId = params.brandId;
        if (params.minPrice !== undefined) cleanParams.minPrice = params.minPrice;
        if (params.maxPrice !== undefined) cleanParams.maxPrice = params.maxPrice;
        if (params.isActive !== undefined) cleanParams.isActive = params.isActive;
        return cleanParams;
    }, [params.page, params.pageSize, params.searchTerm, params.categoryId, params.brandId, params.minPrice, params.maxPrice, params.isActive]);

    return useQuery({
        queryKey: ['products', serializedParams],
        queryFn: () => productService.getProducts(params),
    });
}


