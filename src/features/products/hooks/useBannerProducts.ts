import { useQuery } from '@tanstack/react-query';
import { productService } from '../../../services/product.service';

export function useBannerProducts() {
    return useQuery({
        queryKey: ['banner-products'],
        queryFn: () => productService.getBannerProducts(),
        retry: false,
    });
}
