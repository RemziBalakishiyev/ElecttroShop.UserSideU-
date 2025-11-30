import { useSearchParams } from 'react-router-dom';
import ProductFilters from '../features/products/components/ProductFilters';
import ProductList from '../features/products/components/ProductList';
import { useProducts } from '../features/products/hooks/useProducts';

export default function ProductListPage() {
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const categoryId = searchParams.get('categoryId') || undefined;
    const brandId = searchParams.get('brandId') || undefined;
    const searchTerm = searchParams.get('search') || undefined;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;

    const { data, isLoading } = useProducts({
        page,
        pageSize: 20,
        categoryId,
        brandId,
        searchTerm,
        minPrice,
        maxPrice,
        isActive: true,
    });

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <nav className="mb-8 text-sm text-gray-500">
                <a href="/" className="hover:text-gray-900">Ana Səhifə</a>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Məhsullar</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        {searchTerm ? `"${searchTerm}" üçün axtarış nəticələri` : 'Bütün məhsullar'}
                    </h1>
                    {searchTerm && (
                        <p className="text-gray-600 mt-1">
                            {data?.totalCount || 0} məhsul tapıldı
                        </p>
                    )}
                </div>
                {data && !isLoading && (
                    <div className="flex items-center gap-4">
                        <span className="text-gray-500">
                            {(page - 1) * (data.pageSize || 20) + 1}-{Math.min(page * (data.pageSize || 20), data.totalCount || 0)} / {data.totalCount || 0} məhsul
                        </span>
                    </div>
                )}
            </div>

            <div className="flex gap-8">
                <ProductFilters />
                <div className="flex-1">
                    <ProductList />
                </div>
            </div>
        </div>
    );
}
