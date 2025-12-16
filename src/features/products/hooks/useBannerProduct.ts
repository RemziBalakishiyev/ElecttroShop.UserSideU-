import { useQuery } from '@tanstack/react-query';
import { productService } from '../../../services/product.service';

export function useBannerProduct() {
    return useQuery({
        queryKey: ['banner-product'],
        queryFn: () => productService.getBannerProduct(),
        retry: false, // Don't retry if banner not found
    });
}


