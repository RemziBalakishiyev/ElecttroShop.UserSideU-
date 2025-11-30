import { useQuery } from '@tanstack/react-query';
import { categoryService, type CategoryListParams } from '../../../services/category.service';

export function useCategories(params: CategoryListParams = {}) {
    return useQuery({
        queryKey: ['categories', params],
        queryFn: () => categoryService.getCategories(params),
    });
}

