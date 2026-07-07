import { useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useBrands } from '../hooks/useBrands';
import { Button } from '../../../components/common/Button';

interface FilterSectionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-100 py-4 last:border-0">
            <button
                className="flex w-full items-center justify-between text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-sm font-semibold text-gray-900">{title}</span>
                {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
            </button>
            {isOpen && <div className="mt-3 space-y-2">{children}</div>}
        </div>
    );
}

interface FilterPanelProps {
    onClose?: () => void;
    isMobile?: boolean;
}

function FilterPanel({ onClose, isMobile }: FilterPanelProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        searchParams.get('categoryId') ? [searchParams.get('categoryId')!] : [],
    );
    const [selectedBrands, setSelectedBrands] = useState<string[]>(
        searchParams.get('brandId') ? [searchParams.get('brandId')!] : [],
    );

    const categoriesParams = useMemo(() => ({ page: 1, pageSize: 100 }), []);
    const brandsParams = useMemo(() => ({ page: 1, pageSize: 100 }), []);

    const { data: categoriesData, isLoading: categoriesLoading } = useCategories(categoriesParams);
    const { data: brandsData, isLoading: brandsLoading } = useBrands(brandsParams);

    const categories = categoriesData?.items || [];
    const brands = brandsData?.items || [];

    useEffect(() => {
        const categoryId = searchParams.get('categoryId');
        const brandId = searchParams.get('brandId');
        const min = searchParams.get('minPrice');
        const max = searchParams.get('maxPrice');

        setSelectedCategories(categoryId ? [categoryId] : []);
        setSelectedBrands(brandId ? [brandId] : []);
        setMinPrice(min || '');
        setMaxPrice(max || '');
    }, [searchParams]);

    const applyFilters = useCallback((overrides?: {
        categories?: string[];
        brands?: string[];
        min?: string;
        max?: string;
    }) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', '1');

        const cats = overrides?.categories ?? selectedCategories;
        const brnds = overrides?.brands ?? selectedBrands;
        const min = overrides?.min ?? minPrice;
        const max = overrides?.max ?? maxPrice;

        if (cats.length > 0) newParams.set('categoryId', cats[0]);
        else newParams.delete('categoryId');

        if (brnds.length > 0) newParams.set('brandId', brnds[0]);
        else newParams.delete('brandId');

        if (min) newParams.set('minPrice', min);
        else newParams.delete('minPrice');

        if (max) newParams.set('maxPrice', max);
        else newParams.delete('maxPrice');

        setSearchParams(newParams);
        onClose?.();
    }, [searchParams, selectedCategories, selectedBrands, minPrice, maxPrice, setSearchParams, onClose]);

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setMinPrice('');
        setMaxPrice('');
        setSearchParams({});
        onClose?.();
    };

    const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || minPrice || maxPrice;

    const handleCategoryToggle = (categoryId: string) => {
        const next = selectedCategories.includes(categoryId) ? [] : [categoryId];
        setSelectedCategories(next);
        applyFilters({ categories: next });
    };

    const handleBrandToggle = (brandId: string) => {
        const next = selectedBrands.includes(brandId) ? [] : [brandId];
        setSelectedBrands(next);
        applyFilters({ brands: next });
    };

    return (
        <>
            <div className={`flex items-center justify-between ${isMobile ? 'mb-4' : 'border-b border-gray-100 px-5 py-4'}`}>
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                    <h2 className="text-sm font-bold text-gray-900">Filtrlər</h2>
                    {hasActiveFilters && (
                        <span className="rounded-full bg-primary-500 px-2 py-0.5 text-[10px] font-bold text-white">
                            Aktiv
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900"
                        >
                            <X className="h-3.5 w-3.5" />
                            Təmizlə
                        </button>
                    )}
                    {isMobile && onClose && (
                        <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    )}
                </div>
            </div>

            <div className={isMobile ? '' : 'px-5 pb-3'}>
                <FilterSection title="Qiymət">
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                        />
                        <span className="text-gray-300">—</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                        />
                    </div>
                    <Button size="sm" className="mt-2 w-full" onClick={() => applyFilters()}>
                        Qiymət tətbiq et
                    </Button>
                </FilterSection>

                <FilterSection title="Brend">
                    {brandsLoading ? (
                        <div className="text-sm text-gray-500">Yüklənir...</div>
                    ) : brands.length === 0 ? (
                        <div className="text-sm text-gray-500">Brend tapılmadı</div>
                    ) : (
                        <div className="max-h-48 space-y-0.5 overflow-y-auto pr-1">
                            {brands.map((brand) => {
                                const isSelected = selectedBrands.includes(brand.id);
                                return (
                                    <button
                                        key={brand.id}
                                        onClick={() => handleBrandToggle(brand.id)}
                                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                                            isSelected
                                                ? 'bg-primary-500 text-white'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className={`h-2 w-2 rounded-full ${isSelected ? 'bg-white' : 'bg-gray-300'}`} />
                                        {brand.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </FilterSection>

                <FilterSection title="Kateqoriya">
                    {categoriesLoading ? (
                        <div className="text-sm text-gray-500">Yüklənir...</div>
                    ) : categories.length === 0 ? (
                        <div className="text-sm text-gray-500">Kateqoriya tapılmadı</div>
                    ) : (
                        <div className="max-h-48 space-y-0.5 overflow-y-auto pr-1">
                            {categories.map((category) => {
                                const isSelected = selectedCategories.includes(category.id);
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryToggle(category.id)}
                                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                                            isSelected
                                                ? 'bg-primary-500 text-white'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className={`h-2 w-2 rounded-full ${isSelected ? 'bg-white' : 'bg-gray-300'}`} />
                                        {category.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </FilterSection>
            </div>
        </>
    );
}

export default function ProductFilters() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchParams] = useSearchParams();

    const activeCount = [
        searchParams.get('categoryId'),
        searchParams.get('brandId'),
        searchParams.get('minPrice'),
        searchParams.get('maxPrice'),
    ].filter(Boolean).length;

    return (
        <>
            {/* Desktop */}
            <div className="hidden w-72 flex-shrink-0 lg:block">
                <div className="sticky top-24 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                    <FilterPanel />
                </div>
            </div>

            {/* Mobile trigger */}
            <div className="mb-4 lg:hidden">
                <Button
                    variant="outline"
                    className="w-full justify-center gap-2"
                    onClick={() => setMobileOpen(true)}
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtrlər
                    {activeCount > 0 && (
                        <span className="rounded-full bg-primary-500 px-2 py-0.5 text-xs text-white">
                            {activeCount}
                        </span>
                    )}
                </Button>
            </div>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl">
                        <FilterPanel isMobile onClose={() => setMobileOpen(false)} />
                    </div>
                </div>
            )}
        </>
    );
}
