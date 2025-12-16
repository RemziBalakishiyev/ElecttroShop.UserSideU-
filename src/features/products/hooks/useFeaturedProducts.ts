import { useQuery } from '@tanstack/react-query';
import { productService } from '../../../services/product.service';

export function useFeaturedProducts() {
    return useQuery({
        queryKey: ['featured-products'],
        queryFn: () => productService.getFeaturedProducts(),
    });
}


