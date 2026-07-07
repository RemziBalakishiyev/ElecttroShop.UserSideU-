import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useToast } from '../../../context/ToastContext';
import { getImageUrl } from '../../../utils/imageUrl';
import { resolveProductImage } from '../../../utils/productImage';
import type { Product } from '../../../types/product.types';
import { WHATSAPP_NUMBER } from '../../../config/contact';

interface ProductCardProps {
    product: Product;
}

function formatPrice(product: Product): string | null {
    const amount = product.finalPrice ?? product.price;
    if (amount == null || Number.isNaN(Number(amount))) {
        return null;
    }
    return `${Number(amount).toLocaleString('az-AZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${product.currency || 'AZN'}`;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { showToast } = useToast();
    const isWishlisted = isInWishlist(product.id);
    const hasDiscount = (product.finalDiscountPercent ?? 0) > 0;
    const priceLabel = formatPrice(product);
    const inStock = product.stock > 0;

    const handleAddToCart = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        addToCart(product);
        showToast(`${product.name} səbətə əlavə edildi`, 'success');
    };

    const handleWhatsAppOrder = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        const productUrl = `${window.location.origin}/products/${product.id}`;
        const text = `Salam! "${product.name}" məhsulunu almaq istəyirəm.\n${productUrl}`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
        showToast(
            isWishlisted ? 'İstək siyahısından silindi' : 'İstək siyahısına əlavə edildi',
            isWishlisted ? 'info' : 'success',
        );
    };

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:ring-gray-200">
            <div className="relative p-4 pb-0">
                <Link to={`/products/${product.id}`} className="relative block">
                    <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 via-gray-50 to-gray-100">
                        <img
                            src={getImageUrl(resolveProductImage(product))}
                            alt={product.name}
                            className="h-[85%] w-[85%] object-contain transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.png';
                            }}
                        />

                        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#25D366] p-2.5 transition-transform duration-300 group-hover:translate-y-0">
                            <button
                                onClick={handleWhatsAppOrder}
                                disabled={!inStock}
                                className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                {inStock ? 'WhatsApp ilə sifariş' : 'Stokda yoxdur'}
                            </button>
                        </div>
                    </div>
                </Link>

                <div className="absolute left-6 top-6 flex flex-col gap-1.5">
                    {hasDiscount && (
                        <span className="rounded-md bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                            -{product.finalDiscountPercent}%
                        </span>
                    )}
                    {!inStock && (
                        <span className="rounded-md bg-gray-800 px-2 py-0.5 text-[11px] font-medium text-white">
                            Bitib
                        </span>
                    )}
                </div>

                <button
                    onClick={handleWishlistToggle}
                    aria-label="İstək siyahısı"
                    className={`absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                        isWishlisted
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                            : 'bg-white text-gray-400 shadow-md hover:text-red-500'
                    }`}
                >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
            </div>

            <div className="flex flex-1 flex-col p-4 pt-3">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                    {product.brandName && (
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                            {product.brandName}
                        </span>
                    )}
                    {product.categoryName && (
                        <span className="text-[11px] text-gray-400">{product.categoryName}</span>
                    )}
                </div>

                <Link to={`/products/${product.id}`} className="group/title">
                    <h3 className="mb-3 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover/title:text-gray-600">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto flex items-end justify-between gap-3 border-t border-gray-100 pt-3">
                    <div>
                        {priceLabel ? (
                            <>
                                <p className="text-lg font-bold text-gray-900">{priceLabel}</p>
                                {hasDiscount && product.price != null && (
                                    <p className="text-xs text-gray-400 line-through">
                                        {Number(product.price).toLocaleString('az-AZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                                        {product.currency || 'AZN'}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-gray-400">Qiymət sorğu ilə</p>
                        )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            onClick={handleAddToCart}
                            disabled={!inStock}
                            aria-label="Səbətə əlavə et"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                        >
                            <ShoppingBag className="h-4 w-4" />
                        </button>
                        <Link
                            to={`/products/${product.id}`}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                        >
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
