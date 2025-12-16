import { useMemo } from 'react';
import { Button } from '../../../components/common/Button';
import { Heart } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useToast } from '../../../context/ToastContext';
import { getProductImageUrl } from '../../../utils/imageUtils';
import { useProducts } from '../../products/hooks/useProducts';
import type { Product } from '../../../types/product.types';

export default function DiscountsSection() {
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { showToast } = useToast();

    const discountParams = useMemo(() => ({
        page: 1,
        pageSize: 4,
        isActive: true,
    }), []);

    // Get products with discounts
    const { data, isLoading } = useProducts(discountParams);

    const discountProducts = data?.items.filter((p) => (p.finalDiscountPercent ?? 0) > 0) || [];

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        showToast(`${product.name} səbətə əlavə edildi`, 'success');
    };

    const handleWishlistToggle = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        toggleWishlist(product);
        showToast(
            isInWishlist(product.id) ? 'İstək siyahısından silindi' : 'İstək siyahısına əlavə edildi',
            isInWishlist(product.id) ? 'info' : 'success'
        );
    };

    if (isLoading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8">Endirimlər -50%-ə qədər</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-80" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (discountProducts.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">Discounts up to -50%</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {discountProducts.slice(0, 4).map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl p-6 flex flex-col items-center text-center group hover:shadow-lg transition-all duration-300"
                        >
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
                                <button
                                    onClick={(e) => handleWishlistToggle(product, e)}
                                    className={`absolute top-2 right-2 p-2 rounded-full bg-white transition-colors ${
                                        isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                                    }`}
                                >
                                    <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 h-12">{product.name}</h3>
                            {product.description && (
                                <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                            )}
                            <div className="flex items-center gap-2 mb-4">
                                {product.finalPrice && product.finalPrice < product.price && (
                                    <>
                                        <span className="text-lg font-bold">{product.currency}{product.finalPrice}</span>
                                        <span className="text-sm text-gray-400 line-through">
                                            {product.currency}{product.price}
                                        </span>
                                        {product.finalDiscountPercent && (
                                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                                                -{product.finalDiscountPercent}%
                                            </span>
                                        )}
                                    </>
                                )}
                                {!product.finalPrice && (
                                    <span className="text-lg font-bold">{product.currency}{product.price}</span>
                                )}
                            </div>
                            <Button
                                className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleAddToCart(product)}
                            >
                                İndi al
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

