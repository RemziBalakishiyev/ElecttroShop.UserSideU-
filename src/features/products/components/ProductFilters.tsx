import { useState, useEffect, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useBrands } from '../hooks/useBrands';
import { Button } from '../../../components/common/Button';

interface FilterSectionProps {
    title: string;
    children: ReactNode;
}

function FilterSection({ title, children }: FilterSectionProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-gray-200 py-6">
            <button
                className="flex w-full items-center justify-between text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium text-gray-900">{title}</span>
                {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
            </button>
            {isOpen && <div className="mt-4 space-y-2">{children}</div>}
        </div>
    );
}

export default function ProductFilters() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        searchParams.get('categoryId') ? [searchParams.get('categoryId')!] : []
    );
    const [selectedBrands, setSelectedBrands] = useState<string[]>(
        searchParams.get('brandId') ? [searchParams.get('brandId')!] : []
    );

    const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
        page: 1,
        pageSize: 100,
    });

    const { data: brandsData, isLoading: brandsLoading } = useBrands({
        page: 1,
        pageSize: 100,
    });

    const categories = categoriesData?.items || [];
    const brands = brandsData?.items || [];

    useEffect(() => {
        const categoryId = searchParams.get('categoryId');
        const brandId = searchParams.get('brandId');
        const min = searchParams.get('minPrice');
        const max = searchParams.get('maxPrice');

        if (categoryId) {
            setSelectedCategories([categoryId]);
        }
        if (brandId) {
            setSelectedBrands([brandId]);
        }
        if (min) {
            setMinPrice(min);
        }
        if (max) {
            setMaxPrice(max);
        }
    }, [searchParams]);

    const updateFilters = () => {
        const newParams = new URLSearchParams(searchParams);
        
        // Reset page when filters change
        newParams.delete('page');
        newParams.set('page', '1');

        // Update category filter
        if (selectedCategories.length > 0) {
            newParams.set('categoryId', selectedCategories[0]);
        } else {
            newParams.delete('categoryId');
        }

        // Update brand filter
        if (selectedBrands.length > 0) {
            newParams.set('brandId', selectedBrands[0]);
        } else {
            newParams.delete('brandId');
        }

        // Update price filters
        if (minPrice) {
            newParams.set('minPrice', minPrice);
        } else {
            newParams.delete('minPrice');
        }

        if (maxPrice) {
            newParams.set('maxPrice', maxPrice);
        } else {
            newParams.delete('maxPrice');
        }

        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setMinPrice('');
        setMaxPrice('');
        setSearchParams({});
    };

    const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || minPrice || maxPrice;

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories((prev) => {
            if (prev.includes(categoryId)) {
                return prev.filter((id) => id !== categoryId);
            } else {
                return [categoryId]; // Only allow one category at a time
            }
        });
    };

    const handleBrandToggle = (brandId: string) => {
        setSelectedBrands((prev) => {
            if (prev.includes(brandId)) {
                return prev.filter((id) => id !== brandId);
            } else {
                return [brandId]; // Only allow one brand at a time
            }
        });
    };

    return (
        <div className="w-64 flex-shrink-0 pr-8 hidden lg:block">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">Filtrlər</h2>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
                        >
                            <X className="h-4 w-4" />
                            Təmizlə
                        </button>
                    )}
                </div>

                <FilterSection title="Qiymət">
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full p-2 border rounded text-sm"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full p-2 border rounded text-sm"
                        />
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2"
                        onClick={updateFilters}
                    >
                        Qiymət tətbiq et
                    </Button>
                </FilterSection>

                <FilterSection title="Brend">
                    {brandsLoading ? (
                        <div className="text-sm text-gray-500">Yüklənir...</div>
                    ) : brands.length === 0 ? (
                        <div className="text-sm text-gray-500">Brend tapılmadı</div>
                    ) : (
                        <div className="max-h-60 overflow-y-auto">
                            {brands.map((brand) => (
                                <label
                                    key={brand.id}
                                    className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded px-1"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedBrands.includes(brand.id)}
                                        onChange={() => handleBrandToggle(brand.id)}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="text-sm text-gray-600 flex-1">{brand.name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                    {selectedBrands.length > 0 && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-2"
                            onClick={updateFilters}
                        >
                            Brend tətbiq et
                        </Button>
                    )}
                </FilterSection>

                <FilterSection title="Kateqoriya">
                    {categoriesLoading ? (
                        <div className="text-sm text-gray-500">Yüklənir...</div>
                    ) : categories.length === 0 ? (
                        <div className="text-sm text-gray-500">Kateqoriya tapılmadı</div>
                    ) : (
                        <div className="max-h-60 overflow-y-auto">
                            {categories.map((category) => (
                                <label
                                    key={category.id}
                                    className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded px-1"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => handleCategoryToggle(category.id)}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="text-sm text-gray-600 flex-1">{category.name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                    {selectedCategories.length > 0 && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-2"
                            onClick={updateFilters}
                        >
                            Kateqoriya tətbiq et
                        </Button>
                    )}
                </FilterSection>
            </div>
        </div>
    );
}
