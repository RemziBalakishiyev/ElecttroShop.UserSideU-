import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
    Heart, ShoppingCart, ChevronDown, ChevronUp, Check, Info,
    Cpu, HardDrive, Monitor, Camera, Battery, Wifi, Bluetooth,
    Layers, Zap, Package, Palette,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ProductCard from '../features/products/components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { getImageUrl } from '../utils/imageUrl';
import { resolveProductImage, resolveImageEntry } from '../utils/productImage';
import { useProductDetail } from '../features/products/hooks/useProductDetail';
import { useProducts } from '../features/products/hooks/useProducts';
import type { CategoryAttribute } from '../types/product.types';
import { WHATSAPP_NUMBER } from '../config/contact';

function formatPrice(amount: number | null | undefined, currency?: string | null) {
    if (amount == null || Number.isNaN(Number(amount))) return null;
    return `${Number(amount).toLocaleString('az-AZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency || 'AZN'}`;
}

function getAttributeValues(attr: CategoryAttribute) {
    return [...attr.values]
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((v) => v.displayValue)
        .join(', ');
}

function isSelectableAttribute(attr: CategoryAttribute) {
    const type = attr.attributeType.toLowerCase();
    const name = attr.name.toLowerCase();
    return (
        type === 'color' || type === 'storage' || type === 'ram' ||
        name.includes('color') || name.includes('rəng') ||
        name.includes('storage') || name.includes('yaddaş') || name.includes('ram')
    );
}

function getAttributeIcon(name: string, type: string): LucideIcon {
    const n = (name + ' ' + type).toLowerCase();
    if (n.includes('ram') || n.includes('memory')) return Cpu;
    if (n.includes('yaddaş') || n.includes('storage') || n.includes('disk')) return HardDrive;
    if (n.includes('ekran') || n.includes('screen') || n.includes('display')) return Monitor;
    if (n.includes('kamera') || n.includes('camera')) return Camera;
    if (n.includes('batareya') || n.includes('battery')) return Battery;
    if (n.includes('wifi') || n.includes('wi-fi')) return Wifi;
    if (n.includes('bluetooth')) return Bluetooth;
    if (n.includes('prosessor') || n.includes('processor') || n.includes('chip') || n.includes('çip')) return Zap;
    if (n.includes('sistem') || n.includes('system') || n.includes('android') || n.includes('ios')) return Layers;
    if (n.includes('rəng') || n.includes('color')) return Palette;
    return Package;
}

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { showToast } = useToast();
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [showDetails, setShowDetails] = useState(false);

    const { data: product, isLoading, error } = useProductDetail(id || '');

    const relatedProductsParams = useMemo(() => ({
        page: 1, pageSize: 5, categoryId: product?.categoryId, isActive: true,
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
                .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                .map((img) => ({ id: img.id, imageId: img.imageId, imageUrl: img.imageUrl, alt: product.name }));
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
            <div className="min-h-screen bg-[#f7f7f8]">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-4 w-1/3 rounded-full bg-gray-200" />
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                            <div className="space-y-4">
                                <div className="aspect-square rounded-3xl bg-gray-200" />
                                <div className="flex gap-3">
                                    {[1, 2, 3].map((i) => <div key={i} className="h-20 w-20 rounded-2xl bg-gray-200" />)}
                                </div>
                            </div>
                            <div className="h-[520px] rounded-3xl bg-gray-200" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                    <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Məhsul tapılmadı</h2>
                <p className="mb-8 text-gray-500">Axtardığınız məhsul mövcud deyil</p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
                >
                    Məhsullara qayıt
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

            {/* Breadcrumb */}
            <div className="border-b border-gray-200 bg-white">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
                        <Link to="/" className="transition-colors hover:text-gray-900">Ana Səhifə</Link>
                        <span className="text-gray-300">/</span>
                        <Link to="/products" className="transition-colors hover:text-gray-900">Kataloq</Link>
                        {product.categoryId && product.categoryName && (
                            <>
                                <span className="text-gray-300">/</span>
                                <Link to={`/products?categoryId=${product.categoryId}`} className="transition-colors hover:text-gray-900">
                                    {product.categoryName}
                                </Link>
                            </>
                        )}
                        {product.brandId && product.brandName && (
                            <>
                                <span className="text-gray-300">/</span>
                                <Link to={`/products?brandId=${product.brandId}`} className="transition-colors hover:text-gray-900">
                                    {product.brandName}
                                </Link>
                            </>
                        )}
                        <span className="text-gray-300">/</span>
                        <span className="font-medium text-gray-900">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">

                {/* Main grid */}
                <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">

                    {/* ── Gallery column ── */}
                    <div className="flex flex-col gap-4">

                        {/* Main image */}
                        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
                            <div className="aspect-square">
                                <img
                                    src={getImageUrl(
                                        images[selectedImage]
                                            ? resolveImageEntry({
                                                  imageUrl: images[selectedImage].imageUrl,
                                                  id: images[selectedImage].imageId,
                                              })
                                            : resolveProductImage(product),
                                    )}
                                    alt={product.name}
                                    className="h-full w-full object-contain p-10 transition-opacity duration-300"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/placeholder.png';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Horizontal thumbnail strip */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-1">
                                {images.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white transition-all duration-200 ${
                                            selectedImage === idx
                                                ? 'border-gray-900 shadow-md'
                                                : 'border-transparent shadow-sm ring-1 ring-gray-100 hover:border-gray-300'
                                        }`}
                                    >
                                        <img
                                            src={getImageUrl(resolveImageEntry({ imageUrl: img.imageUrl, id: img.imageId }))}
                                            alt={img.alt}
                                            className="h-full w-full object-contain p-2"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder.png';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Info panel (sticky) ── */}
                    <div className="lg:sticky lg:top-20 lg:self-start">
                        <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">

                            {/* Brand */}
                            {product.brandName && (
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                                    {product.brandName}
                                </p>
                            )}

                            {/* Product name */}
                            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div>
                                {priceLabel ? (
                                    <div className="flex flex-wrap items-end gap-3">
                                        <span className="text-5xl font-black tracking-tight text-gray-900">
                                            {priceLabel}
                                        </span>
                                        {hasDiscount && originalPriceLabel && (
                                            <span className="pb-1 text-xl text-gray-400 line-through">
                                                {originalPriceLabel}
                                            </span>
                                        )}
                                        {product.finalDiscountPercent && product.finalDiscountPercent > 0 && (
                                            <span className="pb-1 rounded-xl bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600">
                                                -{product.finalDiscountPercent}%
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-lg text-gray-500">Qiymət sorğu ilə</p>
                                )}
                            </div>

                            <div className="h-px bg-gray-100" />

                            {/* Selectable attributes (RAM, Storage, Color) */}
                            {selectableAttributes.map((attr) => {
                                const isColor =
                                    attr.attributeType === 'Color' ||
                                    attr.name.toLowerCase().includes('rəng') ||
                                    attr.name.toLowerCase().includes('color');

                                return (
                                    <div key={attr.id}>
                                        <label className="mb-3 block text-sm font-semibold text-gray-900">
                                            {attr.displayName}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {[...attr.values]
                                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                                .map((value) => {
                                                    const isSelected = selectedAttributes[attr.id] === value.id;

                                                    if (isColor) {
                                                        return (
                                                            <button
                                                                key={value.id}
                                                                onClick={() => handleAttributeSelect(attr.id, value.id)}
                                                                title={value.displayValue}
                                                                className={`relative h-10 w-10 rounded-full border-4 transition-all duration-200 ${
                                                                    isSelected
                                                                        ? 'scale-110 border-gray-900 shadow-md'
                                                                        : 'border-white shadow ring-1 ring-gray-300 hover:scale-105'
                                                                }`}
                                                                style={{ backgroundColor: value.colorCode || undefined }}
                                                            >
                                                                {isSelected && (
                                                                    <span className="absolute inset-0 flex items-center justify-center">
                                                                        <Check className="h-4 w-4 text-white drop-shadow" />
                                                                    </span>
                                                                )}
                                                            </button>
                                                        );
                                                    }

                                                    return (
                                                        <button
                                                            key={value.id}
                                                            onClick={() => handleAttributeSelect(attr.id, value.id)}
                                                            className={`relative rounded-xl border-2 px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                                                                isSelected
                                                                    ? 'border-gray-900 bg-gray-900 text-white shadow-md'
                                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:shadow-sm'
                                                            }`}
                                                        >
                                                            {isSelected && (
                                                                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white">
                                                                    <Check className="h-2.5 w-2.5" />
                                                                </span>
                                                            )}
                                                            {value.displayValue}
                                                        </button>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Quick spec cards (icon + label + value) */}
                            {specAttributes.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                    {specAttributes.slice(0, 4).map((attr) => {
                                        const Icon = getAttributeIcon(attr.name, attr.attributeType);
                                        return (
                                            <div
                                                key={attr.id}
                                                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-3.5 py-3"
                                            >
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                                                    <Icon className="h-4 w-4 text-gray-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="truncate text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                                        {attr.displayName}
                                                    </div>
                                                    <div className="truncate text-sm font-semibold text-gray-900">
                                                        {getAttributeValues(attr) || '—'}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Description */}
                            {product.description && (
                                <p className="text-sm leading-relaxed text-gray-500">{product.description}</p>
                            )}

                            <div className="h-px bg-gray-100" />

                            {/* CTA buttons */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!inStock}
                                    className={`flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl text-base font-semibold transition-all duration-200 ${
                                        inStock
                                            ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 hover:bg-gray-700 active:scale-[0.98]'
                                            : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                    }`}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {inStock ? 'Səbətə əlavə et' : 'Stokda yoxdur'}
                                </button>

                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Salam! "${product.name}" məhsulunu almaq istəyirəm.\n${window.location.origin}/products/${product.id}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] text-base font-semibold text-white shadow-lg shadow-[#25D366]/30 transition-all duration-200 hover:bg-[#1ebe5d] active:scale-[0.98]"
                                >
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                    WhatsApp ilə sifariş et
                                </a>

                                <button
                                    onClick={handleWishlistToggle}
                                    className={`flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl border-2 text-sm font-medium transition-all duration-200 ${
                                        isWishlisted
                                            ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                                            : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                    {isWishlisted ? 'İstək siyahısında' : 'İstək siyahısına əlavə et'}
                                </button>
                            </div>

                            {/* Stock + SKU bar */}
                            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`h-2.5 w-2.5 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`}
                                        style={{
                                            boxShadow: inStock
                                                ? '0 0 0 3px rgba(34,197,94,0.2)'
                                                : '0 0 0 3px rgba(239,68,68,0.2)',
                                        }}
                                    />
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            {inStock ? 'Stokda var' : 'Stokda yoxdur'}
                                        </div>
                                        {inStock && (
                                            <div className="text-xs text-gray-500">{product.stock} ədəd mövcuddur</div>
                                        )}
                                    </div>
                                </div>
                                {product.sku && (
                                    <div className="text-right">
                                        <div className="text-[10px] font-medium uppercase tracking-wide text-gray-400">SKU</div>
                                        <div className="font-mono text-sm font-medium text-gray-700">{product.sku}</div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* ── Specifications section ── */}
                {attributes.length > 0 && (() => {
                    const COLLAPSED_COUNT = 14;
                    const canCollapse = attributes.length > COLLAPSED_COUNT;
                    const visibleAttributes = showDetails || !canCollapse
                        ? attributes
                        : attributes.slice(0, COLLAPSED_COUNT);

                    return (
                        <div className="mb-12 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
                            <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                                <h2 className="text-2xl font-bold text-gray-900">Xüsusiyyətlər</h2>
                                <p className="text-sm text-gray-400">
                                    Uyğunsuzluq aşkar etmisən?{' '}
                                    <Link to="/contact" className="font-medium text-gray-900 underline underline-offset-2 hover:text-gray-600">
                                        Bizə yaz
                                    </Link>
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-x-12 lg:grid-cols-2">
                                {visibleAttributes.map((attr) => (
                                    <div
                                        key={attr.id}
                                        className="flex items-center justify-between gap-4 border-b border-gray-100 py-3.5"
                                    >
                                        <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                            {attr.displayName}
                                            <Info className="h-3.5 w-3.5 shrink-0 text-gray-300" aria-hidden="true" />
                                        </span>
                                        <span className="text-right text-sm font-medium text-gray-900">
                                            {getAttributeValues(attr) || '—'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {canCollapse && (
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-50 py-3.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                                >
                                    {showDetails ? (
                                        <>Daha az göstər <ChevronUp className="h-4 w-4" /></>
                                    ) : (
                                        <>Hamısını göstər <ChevronDown className="h-4 w-4" /></>
                                    )}
                                </button>
                            )}
                        </div>
                    );
                })()}

                {/* ── Related products ── */}
                {relatedProducts.length > 0 && (
                    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
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
