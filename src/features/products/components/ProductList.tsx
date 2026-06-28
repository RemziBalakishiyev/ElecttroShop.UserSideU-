import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import ProductCard from './ProductCard';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../../../components/common/Button';

function ProductSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100">
            <div className="p-4 pb-0">
                <div className="aspect-square rounded-xl bg-gray-200" />
            </div>
            <div className="space-y-3 p-4">
                <div className="h-3 w-16 rounded bg-gray-200" />
                <div className="h-5 w-full rounded bg-gray-200" />
                <div className="h-6 w-24 rounded bg-gray-200" />
            </div>
        </div>
    );
}

export default function ProductList() {
    const [searchParams, setSearchParams] = useSearchParams();
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

    const goToPage = (nextPage: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', nextPage.toString());
        setSearchParams(newParams);
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl bg-white py-16 text-center shadow-sm ring-1 ring-gray-100">
                <p className="mb-4 text-red-600">Məhsullar yüklənərkən xəta baş verdi</p>
                <Button onClick={() => window.location.reload()}>Yenidən cəhd et</Button>
            </div>
        );
    }

    if (!data || data.items.length === 0) {
        return (
            <div className="rounded-2xl bg-white py-16 text-center shadow-sm ring-1 ring-gray-100">
                <PackageOpen className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <p className="text-lg font-medium text-gray-900">Məhsul tapılmadı</p>
                <p className="mt-1 text-sm text-gray-500">Filtrləri dəyişdirərək yenidən cəhd edin</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {data.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {data.totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                    <div className="inline-flex flex-wrap items-center gap-1.5 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-100">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => goToPage(page - 1)}
                            className="border-0"
                        >
                            Əvvəlki
                        </Button>

                        {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                            .filter((p) => p === 1 || p === data.totalPages || Math.abs(p - page) <= 1)
                            .map((p, idx, arr) => (
                                <div key={p} className="flex items-center">
                                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                                        <span className="px-1 text-gray-400">…</span>
                                    )}
                                    <Button
                                        variant={p === page ? 'primary' : 'ghost'}
                                        size="sm"
                                        className={`min-w-[2.25rem] ${p !== page ? 'hover:bg-gray-100' : ''}`}
                                        onClick={() => goToPage(p)}
                                    >
                                        {p}
                                    </Button>
                                </div>
                            ))}

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === data.totalPages}
                            onClick={() => goToPage(page + 1)}
                            className="border-0"
                        >
                            Sonrakı
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
