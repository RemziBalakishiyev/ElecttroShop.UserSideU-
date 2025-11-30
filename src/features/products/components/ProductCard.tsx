import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useToast } from '../../../context/ToastContext';
import { getProductImageUrl } from '../../../utils/imageUtils';
import type { Product } from '../../../types/product.types';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { showToast } = useToast();
    const isWishlisted = isInWishlist(product.id);

    const handleAddToCart = () => {
        addToCart(product);
        showToast(`${product.name} səbətə əlavə edildi`, 'success');
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        toggleWishlist(product);
        showToast(
            isWishlisted ? 'İstək siyahısından silindi' : 'İstək siyahısına əlavə edildi',
            isWishlisted ? 'info' : 'success'
        );
    };

    return (
        <div className="group relative bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
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
                    onClick={handleWishlistToggle}
                    className={`absolute top-2 right-2 p-2 rounded-full bg-white transition-colors ${
                        isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
            </div>

            <div className="space-y-2">
                <Link to={`/products/${product.id}`} className="block">
                    <h3 className="font-medium text-gray-900 line-clamp-2 h-10 hover:text-gray-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">
                        {product.currency}{product.finalPrice ?? product.price}
                    </p>
                    <Button
                        size="sm"
                        onClick={handleAddToCart}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Al
                    </Button>
                </div>
            </div>
        </div>
    );
}
