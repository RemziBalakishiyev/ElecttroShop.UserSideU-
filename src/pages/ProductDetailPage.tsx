import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Heart, ShoppingCart, Star, ChevronDown, ChevronUp, Truck, CheckCircle, Shield } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { getProductImageUrl, getProductImageUrlFromImage } from '../utils/imageUtils';
import { useProductDetail } from '../features/products/hooks/useProductDetail';
import { useProducts } from '../features/products/hooks/useProducts';
import type { Product } from '../types/product.types';

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { showToast } = useToast();
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColorValueId, setSelectedColorValueId] = useState<string>('');
    const [selectedStorageValueId, setSelectedStorageValueId] = useState<string>('');
    const [showDetails, setShowDetails] = useState(false);
    const [showMoreReviews, setShowMoreReviews] = useState(false);

    const { data: product, isLoading, error } = useProductDetail(id || '');
    
    // Memoize related products params to prevent infinite loop
    const relatedProductsParams = useMemo(() => ({
        page: 1,
        pageSize: 4,
        categoryId: product?.categoryId,
        isActive: true,
    }), [product?.categoryId]);
    
    const { data: relatedData } = useProducts(relatedProductsParams);

    // Get attributes from categoryAttributes
    const colorAttribute = product?.categoryAttributes?.find(
        (attr) => attr.attributeType === 'Color' || attr.name.toLowerCase().includes('color') || attr.name.toLowerCase().includes('rəng')
    );
    const storageAttribute = product?.categoryAttributes?.find(
        (attr) => 
            attr.attributeType === 'Storage' || 
            attr.attributeType === 'RAM' ||
            attr.name.toLowerCase().includes('storage') ||
            attr.name.toLowerCase().includes('yaddaş') ||
            attr.name.toLowerCase().includes('ram')
    );
    
    const colorValues = colorAttribute?.values.sort((a, b) => a.displayOrder - b.displayOrder) || [];
    const storageValues = storageAttribute?.values.sort((a, b) => a.displayOrder - b.displayOrder) || [];

    // Use images from API if available, otherwise fallback to primaryImageUrl
    const images = product?.images && product.images.length > 0
        ? product.images.sort((a, b) => a.displayOrder - b.displayOrder).map((img) => ({
              id: img.id,
              imageId: img.imageId,
              imageUrl: img.imageUrl,
              alt: product.name,
          }))
        : product?.primaryImageUrl
        ? [{ id: 'primary', imageId: product.imageId || '', imageUrl: product.primaryImageUrl, alt: product.name }]
        : [];


    // Mock reviews (can come from API)
    const reviews = [
        { id: '1', name: 'Grace Carey', rating: 5, date: '24 Yanvar 2023', text: 'Əla vəziyyət və performans. Amazon-dan ikinci əl alınmışdır.' },
        { id: '2', name: 'Ronald Richards', rating: 5, date: '24 Yanvar 2023', text: 'Gözəl 1TB yaddaş, davamlı və yeni USB-C portunu sevirəm.' },
        { id: '3', name: 'Darcy King', rating: 4, date: '24 Yanvar 2023', text: 'Kamera bəzən problemli amma proqram təminatı yeniləməsi gözləyirəm.' },
    ];

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
    const relatedProducts = relatedData?.items.filter((p) => p.id !== product.id).slice(0, 4) || [];
    const finalPrice = product.finalPrice ?? product.price;
    const hasDiscount = product.finalPrice && product.finalPrice < product.price;

    const handleAddToCart = () => {
        addToCart(product);
        showToast(`${product.name} səbətə əlavə edildi`, 'success');
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
                <Link to="/products" className="hover:text-gray-900">Kataloq</Link>
                <span className="mx-2">/</span>
                <Link to={`/products?categoryId=${product.categoryId}`} className="hover:text-gray-900">
                    {product.categoryName}
                </Link>
                <span className="mx-2">/</span>
                <Link to={`/products?brandId=${product.brandId}`} className="hover:text-gray-900">
                    {product.brandName}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Image Gallery - Left side thumbnails */}
                <div className="flex gap-4">
                    {/* Thumbnail Images - Vertical */}
                    {images.length > 1 && (
                        <div className="flex flex-col gap-4">
                            {images.map((img, idx) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                                        selectedImage === idx ? 'border-black' : 'border-transparent'
                                    }`}
                                >
                                    <img
                                        src={getProductImageUrlFromImage({ imageUrl: img.imageUrl, imageId: img.imageId })}
                                        alt={img.alt || product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/placeholder-image.jpg';
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main Image */}
                    <div className="flex-1 aspect-square bg-gray-100 rounded-xl overflow-hidden">
                        <img
                            src={
                                images[selectedImage]
                                    ? getProductImageUrlFromImage({
                                          imageUrl: images[selectedImage].imageUrl,
                                          imageId: images[selectedImage].imageId,
                                      })
                                    : getProductImageUrl({
                                          imageId: product.imageId,
                                          primaryImageUrl: product.primaryImageUrl,
                                          imageUrl: product.imageUrl,
                                      })
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-image.jpg';
                            }}
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

                    {/* Price */}
                    <div className="mb-6">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-bold">
                                {product.currency}{finalPrice}
                            </span>
                            {hasDiscount && (
                                <>
                                    <span className="text-2xl text-gray-400 line-through">
                                        {product.currency}{product.price}
                                    </span>
                                    {product.finalDiscountPercent && (
                                        <Badge variant="destructive">-{product.finalDiscountPercent}%</Badge>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Color Selection */}
                    {colorAttribute && colorValues.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-3">
                                {colorAttribute.displayName || 'Rəng seçin'}
                            </label>
                            <div className="flex gap-3 flex-wrap">
                                {colorValues.map((value) => (
                                    <button
                                        key={value.id}
                                        onClick={() => setSelectedColorValueId(value.id)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                                            selectedColorValueId === value.id ? 'border-black scale-110' : 'border-gray-300'
                                        }`}
                                        style={{
                                            backgroundColor: value.colorCode || value.value.toLowerCase(),
                                        }}
                                        title={value.displayValue}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Storage/RAM Options */}
                    {storageAttribute && storageValues.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-3">
                                {storageAttribute.displayName || 'Yaddaş'}
                            </label>
                            <div className="flex gap-3 flex-wrap">
                                {storageValues.map((value) => (
                                    <button
                                        key={value.id}
                                        onClick={() => setSelectedStorageValueId(value.id)}
                                        className={`px-4 py-2 rounded-md border-2 transition-all ${
                                            selectedStorageValueId === value.id
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        {value.displayValue}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Key Specifications Grid - from categoryAttributes */}
                    {product.categoryAttributes && product.categoryAttributes.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                            {product.categoryAttributes
                                .filter((attr) => attr.attributeType !== 'Color' && attr.attributeType !== 'Storage' && attr.attributeType !== 'RAM')
                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                .slice(0, 6)
                                .map((attr) => {
                                    // Get first value or all values joined
                                    const displayValue = attr.values.length > 0 
                                        ? attr.values
                                            .sort((a, b) => a.displayOrder - b.displayOrder)
                                            .map(v => v.displayValue)
                                            .join(', ')
                                        : '-';
                                    
                                    // Icon mapping based on attributeType
                                    const iconMap: Record<string, string> = {
                                        'Screen': '📱',
                                        'CPU': '⚙️',
                                        'RAM': '💾',
                                        'Storage': '💾',
                                        'Camera': '📷',
                                        'Battery': '🔋',
                                        'Display': '📱',
                                        'Processor': '⚙️',
                                    };
                                    
                                    const icon = iconMap[attr.attributeType] || '📋';
                                    
                                    return (
                                        <div key={attr.id} className="text-center">
                                            <div className="text-2xl mb-2">{icon}</div>
                                            <div className="text-xs text-gray-600 mb-1">{attr.displayName}</div>
                                            <div className="text-sm font-medium">{displayValue}</div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}

                    {/* Description */}
                    <div className="mb-6">
                        <p className="text-gray-700 leading-relaxed text-sm">
                            {product.description || 'Retina ekran, güclü performans və çoxtapşırıqlı imkanlar. Dynamic Island xüsusiyyəti ilə təkmilləşdirilmiş istifadəçi təcrübəsi.'}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mb-6">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleWishlistToggle}
                        >
                            <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                            İstək siyahısına əlavə et
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Səbətə əlavə et
                        </Button>
                    </div>

                    {/* Delivery & Guarantee Info */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Truck className="h-5 w-5 text-gray-600" />
                            <div>
                                <div className="text-xs font-medium">Pulsuz çatdırılma</div>
                                <div className="text-xs text-gray-600">1-2 gün</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                                <div className="text-xs font-medium">Stokda var</div>
                                <div className="text-xs text-gray-600">Bu gün</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-gray-600" />
                            <div>
                                <div className="text-xs font-medium">Zəmanət</div>
                                <div className="text-xs text-gray-600">1 il</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="border-t pt-12 mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Detallar</h2>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        {showDetails ? 'Daha az göstər' : 'Daha çox göstər'}
                        {showDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                </div>

                {showDetails && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-3">Ekran</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Ekran diaqonalı:</span>
                                    <span className="ml-2 font-medium">6.7"</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Təsvir keyfiyyəti:</span>
                                    <span className="ml-2 font-medium">2796x1290</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Yenilənmə tezliyi:</span>
                                    <span className="ml-2 font-medium">120 Hz</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Piksel sıxlığı:</span>
                                    <span className="ml-2 font-medium">460 ppi</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-3">Prosessor</h3>
                            <div className="text-sm">
                                <span className="text-gray-600">CPU:</span>
                                <span className="ml-2 font-medium">A16 Bionic</span>
                            </div>
                            <div className="text-sm mt-2">
                                <span className="text-gray-600">Nüvə sayı:</span>
                                <span className="ml-2 font-medium">6</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Reviews Section */}
            <div className="border-t pt-12 mb-12">
                <h2 className="text-2xl font-bold mb-6">Rəylər</h2>

                {/* Overall Rating */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="text-5xl font-bold">4.8</div>
                    <div>
                        <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <div className="text-sm text-gray-600">125 rəydən</div>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="mb-8 space-y-2">
                    {['Əla', 'Yaxşı', 'Orta', 'Aşağı', 'Pis'].map((label, idx) => {
                        const counts = [100, 11, 3, 8, 1];
                        const maxCount = Math.max(...counts);
                        return (
                            <div key={idx} className="flex items-center gap-4">
                                <span className="w-20 text-sm text-gray-600">{label}</span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400"
                                        style={{ width: `${(counts[idx] / maxCount) * 100}%` }}
                                    />
                                </div>
                                <span className="w-12 text-sm text-gray-600">{counts[idx]} rəy</span>
                            </div>
                        );
                    })}
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                    {reviews.slice(0, showMoreReviews ? reviews.length : 3).map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="font-medium">{review.name}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${
                                                    i < review.rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">{review.date}</div>
                            </div>
                            <p className="text-gray-700 mt-2">{review.text}</p>
                        </div>
                    ))}
                </div>

                {reviews.length > 3 && (
                    <button
                        onClick={() => setShowMoreReviews(!showMoreReviews)}
                        className="mt-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        {showMoreReviews ? 'Daha az göstər' : 'Daha çox göstər'}
                        {showMoreReviews ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                )}
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="border-t pt-12">
                    <h2 className="text-2xl font-bold mb-8">Oxşar məhsullar</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct) => {
                            const isRelatedWishlisted = isInWishlist(relatedProduct.id);
                            return (
                                <div
                                    key={relatedProduct.id}
                                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative"
                                >
                                    <button
                                        onClick={() => toggleWishlist(relatedProduct)}
                                        className={`absolute top-4 right-4 p-2 rounded-full bg-white transition-colors ${
                                            isRelatedWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                                        }`}
                                    >
                                        <Heart className={`h-4 w-4 ${isRelatedWishlisted ? 'fill-current' : ''}`} />
                                    </button>
                                    <Link to={`/products/${relatedProduct.id}`}>
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
                                        <h3 className="font-medium mb-2 line-clamp-2">{relatedProduct.name}</h3>
                                        <p className="text-lg font-bold mb-4">
                                            {relatedProduct.currency}{relatedProduct.finalPrice ?? relatedProduct.price}
                                        </p>
                                    </Link>
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            addToCart(relatedProduct);
                                            showToast(`${relatedProduct.name} səbətə əlavə edildi`, 'success');
                                        }}
                                    >
                                        İndi al
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
