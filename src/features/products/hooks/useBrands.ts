import { useQuery } from '@tanstack/react-query';
import { brandService, type BrandListParams } from '../../../services/brand.service';

export function useBrands(params: BrandListParams = {}) {
    return useQuery({
        queryKey: ['brands', params],
        queryFn: () => brandService.getBrands(params),
    });
}

