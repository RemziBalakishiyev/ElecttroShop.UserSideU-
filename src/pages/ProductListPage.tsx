import { Link, useSearchParams } from 'react-router-dom';
import { Package, X } from 'lucide-react';
import ProductFilters from '../features/products/components/ProductFilters';
import ProductList from '../features/products/components/ProductList';
import { useProducts } from '../features/products/hooks/useProducts';
import { useBrands } from '../features/products/hooks/useBrands';
import { useCategories } from '../features/products/hooks/useCategories';

export default function ProductListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const categoryId = searchParams.get('categoryId') || undefined;
    const brandId = searchParams.get('brandId') || undefined;
    const searchTerm = searchParams.get('search') || undefined;
    const minPrice = searchParams.get('minPrice') || undefined;
    const maxPrice = searchParams.get('maxPrice') || undefined;

    const { data, isLoading } = useProducts({
        page,
        pageSize: 20,
        categoryId,
        brandId,
        searchTerm,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        isActive: true,
    });

    const { data: brandsData } = useBrands({ page: 1, pageSize: 100 });
    const { data: categoriesData } = useCategories({ page: 1, pageSize: 100 });

    const activeBrand = brandsData?.items.find((b) => b.id === brandId);
    const activeCategory = categoriesData?.items.find((c) => c.id === categoryId);

    const title = searchTerm ? `"${searchTerm}" üçün nəticələr` : 'Bütün məhsullar';
    const totalCount = data?.totalCount ?? 0;
    const pageSize = data?.pageSize || 20;
    const rangeStart = totalCount > 0 ? (page - 1) * pageSize + 1 : 0;
    const rangeEnd = Math.min(page * pageSize, totalCount);

    const removeFilter = (key: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(key);
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const hasActiveChips = activeBrand || activeCategory || minPrice || maxPrice;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="relative overflow-hidden border-b border-gray-200 bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-slate-50" />
                <div className="container relative mx-auto px-4 py-8">
                    <nav className="mb-5 flex items-center gap-2 text-sm text-gray-500">
                        <Link to="/" className="transition-colors hover:text-gray-900">Ana Səhifə</Link>
                        <span>/</span>
                        <span className="font-medium text-gray-900">Məhsullar</span>
                    </nav>

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-primary-500 text-white sm:flex">
                                <Package className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">{title}</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm
                                        ? `${totalCount} məhsul tapıldı`
                                        : 'Premium elektronika və texnika — ən yaxşı qiymətlərlə'}
                                </p>
                            </div>
                        </div>

                        {data && !isLoading && totalCount > 0 && (
                            <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm shadow-sm ring-1 ring-gray-200">
                                <span className="font-semibold text-gray-900">{rangeStart}–{rangeEnd}</span>
                                <span className="text-gray-400">/</span>
                                <span className="text-gray-600">{totalCount} məhsul</span>
                            </div>
                        )}
                    </div>

                    {hasActiveChips && (
                        <div className="mt-5 flex flex-wrap items-center gap-2">
                            {activeCategory && (
                                <button
                                    onClick={() => removeFilter('categoryId')}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-primary-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-600"
                                >
                                    {activeCategory.name}
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                            {activeBrand && (
                                <button
                                    onClick={() => removeFilter('brandId')}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-primary-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-600"
                                >
                                    {activeBrand.name}
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                            {(minPrice || maxPrice) && (
                                <button
                                    onClick={() => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.delete('minPrice');
                                        newParams.delete('maxPrice');
                                        newParams.set('page', '1');
                                        setSearchParams(newParams);
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-primary-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-600"
                                >
                                    {minPrice || '0'} – {maxPrice || '∞'} AZN
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row lg:gap-8">
                    <ProductFilters />
                    <div className="min-w-0 flex-1">
                        <ProductList />
                    </div>
                </div>
            </div>
        </div>
    );
}
