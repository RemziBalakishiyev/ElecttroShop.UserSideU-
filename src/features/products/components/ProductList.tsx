import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../../../components/common/Button';

export default function ProductList() {
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const categoryId = searchParams.get('categoryId') || undefined;
    const brandId = searchParams.get('brandId') || undefined;
    const searchTerm = searchParams.get('search') || undefined;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;

    const productsParams = useMemo(() => ({
        page,
        pageSize: 20,
        categoryId,
        brandId,
        searchTerm,
        minPrice,
        maxPrice,
        isActive: true,
    }), [page, categoryId, brandId, searchTerm, minPrice, maxPrice]);

    const { data, isLoading, error } = useProducts(productsParams);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-80" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">Məhsullar yüklənərkən xəta baş verdi</p>
                <Button onClick={() => window.location.reload()}>Yenidən cəhd et</Button>
            </div>
        );
    }

    if (!data || data.items.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">Məhsul tapılmadı</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {data.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => {
                            const newParams = new URLSearchParams(searchParams);
                            newParams.set('page', (page - 1).toString());
                            window.location.search = newParams.toString();
                        }}
                    >
                        Əvvəlki
                    </Button>
                    {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === data.totalPages || Math.abs(p - page) <= 1)
                        .map((p, idx, arr) => (
                            <div key={p}>
                                {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-2">...</span>}
                                <Button
                                    variant={p === page ? 'primary' : 'outline'}
                                    onClick={() => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('page', p.toString());
                                        window.location.search = newParams.toString();
                                    }}
                                >
                                    {p}
                                </Button>
                            </div>
                        ))}
                    <Button
                        variant="outline"
                        disabled={page === data.totalPages}
                        onClick={() => {
                            const newParams = new URLSearchParams(searchParams);
                            newParams.set('page', (page + 1).toString());
                            window.location.search = newParams.toString();
                        }}
                    >
                        Sonrakı
                    </Button>
                </div>
            )}
        </>
    );
}
