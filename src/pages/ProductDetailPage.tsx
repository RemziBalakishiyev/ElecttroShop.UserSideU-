import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Heart, ShoppingCart, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import ProductCard from '../features/products/components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { getProductImageUrl, getProductImageUrlFromImage } from '../utils/imageUtils';
import { useProductDetail } from '../features/products/hooks/useProductDetail';
import { useProducts } from '../features/products/hooks/useProducts';
import type { CategoryAttribute } from '../types/product.types';

function formatPrice(amount: number | null | undefined, currency?: string | null) {
    if (amount == null || Number.isNaN(Number(amount))) {
        return null;
    }
    return `${Number(amount).toLocaleString('az-AZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency || 'AZN'}`;
}

function getAttributeValues(attr: CategoryAttribute) {
    return [...attr.values]
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((value) => value.displayValue)
        .join(', ');
}

function isSelectableAttribute(attr: CategoryAttribute) {
    const type = attr.attributeType.toLowerCase();
    const name = attr.name.toLowerCase();
    return (
        type === 'color' ||
        type === 'storage' ||
        type === 'ram' ||
        name.includes('color') ||
        name.includes('rəng') ||
        name.includes('storage') ||
        name.includes('yaddaş') ||
        name.includes('ram')
    );
}

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { showToast } = useToast();
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [showDetails, setShowDetails] = useState(true);

    const { data: product, isLoading, error } = useProductDetail(id || '');

    const relatedProductsParams = useMemo(() => ({
        page: 1,
        pageSize: 5,
        categoryId: product?.categoryId,
        isActive: true,
    }), [product?.categoryId]);

    const { data: relatedData } = useProducts(relatedProductsParams);

    const attributes = useMemo(
        () => [...(product?.categoryAttributes || [])].sort((a, b) => a.displayOrder - b.displayOrder),
        [product?.categoryAttributes],
    );

    const selectableAttributes = attributes.filter(isSelectableAttribute);
    const specAttributes = attributes.filter((attr) => !isSelectableAttribute(attr));

    const images = useMemo(() => {
        if (!product) return [];

        if (product.images && product.images.length > 0) {
            return [...product.images]
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((img) => ({
                    id: img.id,
                    imageId: img.imageId,
                    imageUrl: img.imageUrl,
                    alt: product.name,
                }));
        }

        if (product.primaryImageUrl || product.imageUrl || product.imageId) {
            return [{
                id: 'primary',
                imageId: product.imageId || '',
                imageUrl: product.primaryImageUrl || product.imageUrl || '',
                alt: product.name,
            }];
        }

        return [];
    }, [product]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-4 w-1/3 rounded bg-gray-200" />
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        <div className="aspect-square rounded-2xl bg-gray-200" />
                        <div className="space-y-4">
                            <div className="h-10 rounded bg-gray-200" />
                            <div className="h-6 w-2/3 rounded bg-gray-200" />
                            <div className="h-12 rounded bg-gray-200" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="mb-4 text-2xl font-bold">Məhsul tapılmadı</h2>
                <Link to="/products">
                    <Button>Məhsullara qayıt</Button>
                </Link>
            </div>
        );
    }

    const isWishlisted = isInWishlist(product.id);
    const relatedProducts = relatedData?.items.filter((p) => p.id !== product.id).slice(0, 4) || [];
    const finalPrice = product.finalPrice ?? product.price;
    const hasDiscount = (product.finalDiscountPercent ?? 0) > 0 || (product.finalPrice != null && product.finalPrice < product.price);
    const inStock = product.stock > 0;
    const priceLabel = formatPrice(finalPrice, product.currency);
    const originalPriceLabel = formatPrice(product.price, product.currency);

    const handleAddToCart = () => {
        addToCart(product);
        showToast(`${product.name} səbətə əlavə edildi`, 'success');
    };

    const handleWishlistToggle = () => {
        toggleWishlist(product);
        showToast(
            isWishlisted ? 'İstək siyahısından silindi' : 'İstək siyahısına əlavə edildi',
            isWishlisted ? 'info' : 'success',
        );
    };

    const handleAttributeSelect = (attributeId: string, valueId: string) => {
        setSelectedAttributes((prev) => ({ ...prev, [attributeId]: valueId }));
    };

    return (
        <div className="min-h-screen bg-[#f7f7f8]">
            <div className="border-b border-gray-200 bg-white">
                <div className="container mx-auto px-4 py-6">
                    <nav className="text-sm text-gray-500">
                        <Link to="/" className="hover:text-gray-900">Ana Səhifə</Link>
                        <span className="mx-2">/</span>
                        <Link to="/products" className="hover:text-gray-900">Kataloq</Link>
                        {product.categoryId && product.categoryName && (
                            <>
                                <span className="mx-2">/</span>
                                <Link to={`/products?categoryId=${product.categoryId}`} className="hover:text-gray-900">
                                    {product.categoryName}
                                </Link>
                            </>
                        )}
                        {product.brandId && product.brandName && (
                            <>
                                <span className="mx-2">/</span>
                                <Link to={`/products?brandId=${product.brandId}`} className="hover:text-gray-900">
                                    {product.brandName}
                                </Link>
                            </>
                        )}
                        <span className="mx-2">/</span>
                        <span className="font-medium text-gray-900">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
                    <div className="flex gap-4">
                        {images.length > 1 && (
                            <div className="flex flex-col gap-3">
                                {images.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`h-20 w-20 overflow-hidden rounded-xl border-2 bg-white transition-all ${
                                            selectedImage === idx ? 'border-gray-900' : 'border-gray-200'
                                        }`}
                                    >
                                        <img
                                            src={getProductImageUrlFromImage({ imageUrl: img.imageUrl, imageId: img.imageId })}
                                            alt={img.alt}
                                            className="h-full w-full object-contain p-1"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex-1 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                            <div className="aspect-square">
                                <img
                                    src={
                                        images[selectedImage]
                                            ? getProductImageUrlFromImage({
                                                  imageUrl: images[selectedImage].imageUrl,
                                                  imageId: images[selectedImage].imageId,
                                              })
                                            : getProductImageUrl(product)
                                    }
                                    alt={product.name}
                                    className="h-full w-full object-contain p-6"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:p-8">
                        {product.brandName && (
                            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-400">
                                {product.brandName}
                            </p>
                        )}

                        <h1 className="mb-4 text-3xl font-bold text-gray-900">{product.name}</h1>

                        <div className="mb-6">
                            {priceLabel ? (
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-4xl font-bold text-gray-900">{priceLabel}</span>
                                    {hasDiscount && originalPriceLabel && (
                                        <span className="text-xl text-gray-400 line-through">{originalPriceLabel}</span>
                                    )}
                                    {product.finalDiscountPercent && product.finalDiscountPercent > 0 && (
                                        <Badge variant="destructive">-{product.finalDiscountPercent}%</Badge>
                                    )}
                                </div>
                            ) : (
                                <p className="text-lg text-gray-500">Qiymət sorğu ilə</p>
                            )}
                        </div>

                        {selectableAttributes.map((attr) => {
                            const isColor = attr.attributeType === 'Color' || attr.name.toLowerCase().includes('rəng') || attr.name.toLowerCase().includes('color');

                            return (
                                <div key={attr.id} className="mb-6">
                                    <label className="mb-3 block text-sm font-medium text-gray-900">
                                        {attr.displayName}
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {[...attr.values]
                                            .sort((a, b) => a.displayOrder - b.displayOrder)
                                            .map((value) => {
                                                const isSelected = selectedAttributes[attr.id] === value.id;

                                                if (isColor) {
                                                    return (
                                                        <button
                                                            key={value.id}
                                                            onClick={() => handleAttributeSelect(attr.id, value.id)}
                                                            className={`h-10 w-10 rounded-full border-2 transition-all ${
                                                                isSelected ? 'border-gray-900 scale-110' : 'border-gray-300'
                                                            }`}
                                                            style={{ backgroundColor: value.colorCode || undefined }}
                                                            title={value.displayValue}
                                                        />
                                                    );
                                                }

                                                return (
                                                    <button
                                                        key={value.id}
                                                        onClick={() => handleAttributeSelect(attr.id, value.id)}
                                                        className={`rounded-lg border-2 px-4 py-2 text-sm transition-all ${
                                                            isSelected
                                                                ? 'border-gray-900 bg-gray-900 text-white'
                                                                : 'border-gray-200 hover:border-gray-400'
                                                        }`}
                                                    >
                                                        {value.displayValue}
                                                    </button>
                                                );
                                            })}
                                    </div>
                                </div>
                            );
                        })}

                        {specAttributes.length > 0 && (
                            <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-3">
                                {specAttributes.slice(0, 6).map((attr) => (
                                    <div key={attr.id} className="text-center">
                                        <div className="mb-1 text-xs text-gray-500">{attr.displayName}</div>
                                        <div className="text-sm font-semibold text-gray-900">{getAttributeValues(attr) || '—'}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {product.description && (
                            <div className="mb-6">
                                <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
                            </div>
                        )}

                        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                            <Button variant="outline" className="flex-1" onClick={handleWishlistToggle}>
                                <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                                İstək siyahısına əlavə et
                            </Button>
                            <Button className="flex-1" onClick={handleAddToCart} disabled={!inStock}>
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {inStock ? 'Səbətə əlavə et' : 'Stokda yoxdur'}
                            </Button>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                            {inStock ? (
                                <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                            ) : (
                                <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                            )}
                            <div>
                                <div className="text-sm font-medium text-gray-900">
                                    {inStock ? 'Stokda var' : 'Stokda yoxdur'}
                                </div>
                                {inStock && (
                                    <div className="text-xs text-gray-500">{product.stock} ədəd mövcuddur</div>
                                )}
                            </div>
                            {product.sku && (
                                <div className="ml-auto text-right">
                                    <div className="text-xs text-gray-500">SKU</div>
                                    <div className="text-sm font-medium text-gray-900">{product.sku}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {attributes.length > 0 && (
                    <div className="mb-12 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:p-8">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Detallar</h2>
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
                            >
                                {showDetails ? 'Daha az göstər' : 'Daha çox göstər'}
                                {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                        </div>

                        {showDetails && (
                            <div className="space-y-8">
                                {attributes.map((attr) => (
                                    <div key={attr.id}>
                                        <h3 className="mb-4 font-semibold text-gray-900">{attr.displayName}</h3>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                            {[...attr.values]
                                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                                .map((value) => (
                                                    <div
                                                        key={value.id}
                                                        className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                                                    >
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {value.displayValue}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {relatedProducts.length > 0 && (
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:p-8">
                        <h2 className="mb-8 text-2xl font-bold text-gray-900">Oxşar məhsullar</h2>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
