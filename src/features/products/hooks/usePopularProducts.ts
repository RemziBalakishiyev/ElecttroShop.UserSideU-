import { useQuery } from '@tanstack/react-query';
import { productService } from '../../../services/product.service';

export function usePopularProducts() {
    return useQuery({
        queryKey: ['popular-products'],
        queryFn: () => productService.getPopularProducts(),
        retry: false,
    });
}
