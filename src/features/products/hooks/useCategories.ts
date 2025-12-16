import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { categoryService, type CategoryListParams } from '../../../services/category.service';

export function useCategories(params: CategoryListParams = {}) {
    // Serialize params for stable query key
    const serializedParams = useMemo(() => {
        const cleanParams: Record<string, any> = {};
        if (params.page !== undefined) cleanParams.page = params.page;
        if (params.pageSize !== undefined) cleanParams.pageSize = params.pageSize;
        if (params.searchTerm) cleanParams.searchTerm = params.searchTerm;
        if (params.parentId) cleanParams.parentId = params.parentId;
        if (params.includeChildren !== undefined) cleanParams.includeChildren = params.includeChildren;
        return cleanParams;
    }, [params.page, params.pageSize, params.searchTerm, params.parentId, params.includeChildren]);

    return useQuery({
        queryKey: ['categories', serializedParams],
        queryFn: () => categoryService.getCategories(params),
    });
}


