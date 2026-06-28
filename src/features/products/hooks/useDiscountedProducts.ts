import { useQuery } from '@tanstack/react-query';
import { productService } from '../../../services/product.service';

export function useDiscountedProducts() {
    return useQuery({
        queryKey: ['discounted-products'],
        queryFn: () => productService.getDiscountedProducts(),
        retry: false,
    });
}
