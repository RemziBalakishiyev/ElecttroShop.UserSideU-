import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useToast } from '../../../context/ToastContext';
import { getProductImageUrl } from '../../../utils/imageUtils';
import type { Product } from '../../../types/product.types';

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
                            src={getProductImageUrl(product)}
                            alt={product.name}
                            className="h-[85%] w-[85%] object-contain transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-image.jpg';
                            }}
                        />

                        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gray-900/90 p-2.5 transition-transform duration-300 group-hover:translate-y-0">
                            <button
                                onClick={handleAddToCart}
                                disabled={!inStock}
                                className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                {inStock ? 'Səbətə əlavə et' : 'Stokda yoxdur'}
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

                    <Link
                        to={`/products/${product.id}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                    >
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
