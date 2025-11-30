import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Heart, ShoppingCart, Minus, Plus, Star } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { getProductImageUrl } from '../utils/imageUtils';
import { useProductDetail } from '../features/products/hooks/useProductDetail';
import { useProducts } from '../features/products/hooks/useProducts';
import type { Product } from '../types/product.types';

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { showToast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const { data: product, isLoading, error } = useProductDetail(id || '');
    const { data: relatedData } = useProducts({
        page: 1,
        pageSize: 3,
        categoryId: product?.categoryId,
        isActive: true,
    });

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="h-96 bg-gray-200 rounded-xl"></div>
                        <div className="space-y-4">
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                            <div className="h-12 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Məhsul tapılmadı</h2>
                    <Link to="/products">
                        <Button>Məhsullara qayıt</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const isWishlisted = isInWishlist(product.id);
    const relatedProducts = relatedData?.items.filter((p) => p.id !== product.id).slice(0, 3) || [];

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        showToast(`${quantity} x ${product.name} səbətə əlavə edildi`, 'success');
    };

    const handleWishlistToggle = () => {
        toggleWishlist(product);
        showToast(
            isWishlisted ? 'İstək siyahısından silindi' : 'İstək siyahısına əlavə edildi',
            isWishlisted ? 'info' : 'success'
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <nav className="mb-8 text-sm text-gray-500">
                <Link to="/" className="hover:text-gray-900">Ana Səhifə</Link>
                <span className="mx-2">/</span>
                <Link to="/products" className="hover:text-gray-900">Məhsullar</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Image Gallery */}
                <div>
                    <div className="aspect-square bg-gray-100 rounded-xl mb-4 overflow-hidden">
                        <img
                            src={getProductImageUrl(product)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-image.jpg';
                            }}
                        />
                    </div>
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden ${
                                        selectedImage === idx ? 'ring-2 ring-black' : ''
                                    }`}
                                >
                                    <img
                                        src={img.imageId ? getProductImageUrl({ imageId: img.imageId }) : '/placeholder-image.jpg'}
                                        alt={img.alt}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                            <p className="text-gray-600">{product.brandName}</p>
                        </div>
                        <button
                            onClick={handleWishlistToggle}
                            className={`p-2 rounded-full transition-colors ${
                                isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                            }`}
                        >
                            <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">(4.8) 124 rəy</span>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-bold">
                                {product.currency}{product.finalPrice ?? product.price}
                            </span>
                            {product.finalPrice && product.finalPrice < product.price && (
                                <>
                                    <span className="text-xl text-gray-400 line-through">
                                        {product.currency}{product.price}
                                    </span>
                                    {product.finalDiscountPercent && (
                                        <Badge variant="destructive">-{product.finalDiscountPercent}%</Badge>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Specs */}
                    <div className="mb-6 space-y-2">
                        <div className="flex">
                            <span className="font-medium w-32">SKU:</span>
                            <span className="text-gray-600">{product.sku}</span>
                        </div>
                        <div className="flex">
                            <span className="font-medium w-32">Kateqoriya:</span>
                            <span className="text-gray-600">{product.categoryName}</span>
                        </div>
                        <div className="flex">
                            <span className="font-medium w-32">Brend:</span>
                            <span className="text-gray-600">{product.brandName}</span>
                        </div>
                        <div className="flex">
                            <span className="font-medium w-32">Stok:</span>
                            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                {product.stock > 0 ? `Stokda var (${product.stock})` : 'Stokda yoxdur'}
                            </span>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Miqdar</label>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-md">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2 hover:bg-gray-100"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="p-2 hover:bg-gray-100"
                                    disabled={quantity >= product.stock}
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Button
                            className="flex-1"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Səbətə əlavə et
                        </Button>
                        <Button variant="outline" className="flex-1" disabled={product.stock === 0}>
                            İndi al
                        </Button>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="border-t pt-12">
                    <h2 className="text-2xl font-bold mb-8">Oxşar məhsullar</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <Link
                                key={relatedProduct.id}
                                to={`/products/${relatedProduct.id}`}
                                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                                    <img
                                        src={getProductImageUrl(relatedProduct)}
                                        alt={relatedProduct.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/placeholder-image.jpg';
                                        }}
                                    />
                                </div>
                                <h3 className="font-medium mb-2">{relatedProduct.name}</h3>
                                <p className="text-lg font-bold">
                                    {relatedProduct.currency}{relatedProduct.finalPrice ?? relatedProduct.price}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
