import { useQuery } from '@tanstack/react-query';
import { productService, type ProductListParams } from '../../../services/product.service';

export function useProducts(params: ProductListParams = {}) {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => productService.getProducts(params),
    });
}

