import { useQuery } from '@tanstack/react-query';
import { promotionalBrandService } from '../../../services/brand.service';

export function usePromotionalBrands() {
    return useQuery({
        queryKey: ['promotional-brands'],
        queryFn: () => promotionalBrandService.getPromotionalBrands(),
        retry: false,
    });
}

