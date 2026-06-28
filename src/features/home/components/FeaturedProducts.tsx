import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../context/ToastContext';
import { getProductImageUrl } from '../../../utils/imageUtils';
import { useProducts } from '../../products/hooks/useProducts';
import { useFeaturedProducts } from '../../products/hooks/useFeaturedProducts';
import type { Product } from '../../../types/product.types';

type TabKey = 'new' | 'bestseller' | 'featured';

const TABS: { key: TabKey; label: string }[] = [
    { key: 'new', label: 'Yeni Gəlmələr' },
    { key: 'bestseller', label: 'Ən çox satılanlar' },
    { key: 'featured', label: 'Seçilmiş məhsullar' },
];

function formatPrice(product: Product) {
    const amount = product.finalPrice ?? product.price;
    return `${amount.toLocaleString('az-AZ')} ${product.currency}`;
}

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const imageUrl = getProductImageUrl(product);
    const hasDiscount = (product.finalDiscountPercent ?? 0) > 0;

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:ring-gray-200">
            <Link to={`/products/${product.id}`} className="relative block">
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-gray-50">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <span className="text-sm text-gray-400">Şəkil yoxdur</span>
                    )}
                </div>
                {hasDiscount && (
                    <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                        -{product.finalDiscountPercent}%
                    </span>
                )}
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <p className="mb-1 text-xs text-gray-400">{product.brandName}</p>

                <Link to={`/products/${product.id}`}>
                    <h3 className="mb-3 line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-gray-600">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto space-y-3">
                    <div className="flex items-baseline gap-2">
                        <p className="text-lg font-bold text-gray-900">{formatPrice(product)}</p>
                        {hasDiscount && (
                            <p className="text-sm text-gray-400 line-through">
                                {product.price.toLocaleString('az-AZ')} {product.currency}
                            </p>
                        )}
                    </div>

                    <Button
                        className="w-full sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
                        size="sm"
                        onClick={() => onAddToCart(product)}
                    >
                        Səbətə əlavə et
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function FeaturedProducts() {
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<TabKey>('new');

    const newArrivalParams = useMemo(() => ({
        page: 1,
        pageSize: 8,
        isActive: true,
    }), []);

    const { data: newArrivalData, isLoading: newArrivalLoading } = useProducts(newArrivalParams);
    const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts();

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        showToast(`${product.name} səbətə əlavə edildi`, 'success');
    };

    const getProducts = () => {
        if (activeTab === 'featured') {
            return featuredProducts || [];
        }
        return newArrivalData?.items || [];
    };

    const isLoading = activeTab === 'featured' ? featuredLoading : newArrivalLoading;
    const products = getProducts().slice(0, 4);

    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Məhsullar</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Yeni, populyar və seçilmiş məhsullar
                        </p>
                    </div>

                    <div className="inline-flex rounded-lg bg-white p-1 shadow-sm ring-1 ring-gray-200">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === tab.key
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-200" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="rounded-2xl bg-white py-12 text-center text-gray-500 shadow-sm ring-1 ring-gray-100">
                        Məhsul tapılmadı
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-10 text-center">
                    <Link to="/products">
                        <Button variant="outline" size="md">
                            Bütün məhsullara bax
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
