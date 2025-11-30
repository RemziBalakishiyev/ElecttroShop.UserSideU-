import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getProductImageUrl } from '../utils/imageUtils';
import { Badge } from '../components/common/Badge';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const handleAddToCart = (product: any) => {
        addToCart(product);
        showToast(`${product.name} səbətə əlavə edildi`, 'success');
    };

    const handleRemove = (productId: string, productName: string) => {
        removeFromWishlist(productId);
        showToast(`${productName} istək siyahısından silindi`, 'info');
    };

    if (wishlist.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold mb-4">İstək siyahınız boşdur</h2>
                    <p className="text-gray-600 mb-8">Bəyəndiyiniz məhsulları istək siyahınıza əlavə etməyə başlayın.</p>
                    <Link to="/products">
                        <Button>Məhsullara bax</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">İstək siyahım ({wishlist.length})</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((product) => {
                    const price = product.finalPrice ?? product.price;
                    return (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="relative aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={getProductImageUrl(product)}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/placeholder-image.jpg';
                                    }}
                                />
                                <button
                                    onClick={() => handleRemove(product.id, product.name)}
                                    className="absolute top-2 right-2 p-2 rounded-full bg-white text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <Heart className="h-4 w-4 fill-current" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <Link to={`/products/${product.id}`} className="block">
                                    <h3 className="font-medium text-gray-900 line-clamp-2 h-10 hover:text-gray-600 transition-colors">
                                        {product.name}
                                    </h3>
                                </Link>

                                {product.description && (
                                    <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                                )}

                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold">{product.currency}{price}</span>
                                    {product.finalPrice && product.finalPrice < product.price && (
                                        <>
                                            <span className="text-sm text-gray-400 line-through">
                                                {product.currency}{product.price}
                                            </span>
                                            {product.finalDiscountPercent && (
                                                <Badge variant="destructive" className="text-xs">
                                                    -{product.finalDiscountPercent}%
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </div>

                                <Button
                                    className="w-full"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Səbətə əlavə et
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

