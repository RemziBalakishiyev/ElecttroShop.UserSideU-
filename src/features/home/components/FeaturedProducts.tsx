import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../context/ToastContext';
import { getProductImageUrl } from '../../../utils/imageUtils';
import { useProducts } from '../../products/hooks/useProducts';
import { useFeaturedProducts } from '../../products/hooks/useFeaturedProducts';
import type { Product } from '../../../types/product.types';

export default function FeaturedProducts() {
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'new' | 'bestseller' | 'featured'>('featured');

    const { data: newArrivalData, isLoading: newArrivalLoading } = useProducts({
        page: 1,
        pageSize: 8,
        isActive: true,
    });

    const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts();

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        showToast(`${product.name} səbətə əlavə edildi`, 'success');
    };

    const getProducts = () => {
        if (activeTab === 'featured') {
            return featuredProducts || [];
        }
        // For new arrival and bestseller, use regular products
        return newArrivalData?.items || [];
    };

    const isLoading = activeTab === 'featured' ? featuredLoading : newArrivalLoading;
    const products = getProducts();

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="flex gap-8 mb-8 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('new')}
                        className={`text-lg font-medium border-b-2 pb-1 whitespace-nowrap transition-colors ${
                            activeTab === 'new' ? 'border-black' : 'border-transparent text-gray-500 hover:text-black'
                        }`}
                    >
                        Yeni Gəlmələr
                    </button>
                    <button
                        onClick={() => setActiveTab('bestseller')}
                        className={`text-lg font-medium border-b-2 pb-1 whitespace-nowrap transition-colors ${
                            activeTab === 'bestseller' ? 'border-black' : 'border-transparent text-gray-500 hover:text-black'
                        }`}
                    >
                        Ən çox satılanlar
                    </button>
                    <button
                        onClick={() => setActiveTab('featured')}
                        className={`text-lg font-medium border-b-2 pb-1 whitespace-nowrap transition-colors ${
                            activeTab === 'featured' ? 'border-black' : 'border-transparent text-gray-500 hover:text-black'
                        }`}
                    >
                        Seçilmiş məhsullar
                    </button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-80" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Məhsul tapılmadı</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.slice(0, 4).map((product) => (
                            <div key={product.id} className="bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center group hover:bg-white hover:shadow-lg transition-all duration-300">
                                <div className="mb-4 relative h-40 w-full flex items-center justify-center">
                                    <img
                                        src={getProductImageUrl(product)}
                                        alt={product.name}
                                        className="h-32 w-32 object-cover rounded-lg"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/placeholder-image.jpg';
                                        }}
                                    />
                                </div>
                                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 h-12">{product.name}</h3>
                                <p className="text-lg font-bold mb-4">
                                    {product.currency}{product.finalPrice ?? product.price}
                                </p>
                                <Button
                                    className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    İndi al
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
