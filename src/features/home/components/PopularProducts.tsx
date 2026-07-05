import { Link } from 'react-router-dom';
import { ArrowUpRight, Flame } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { usePopularProducts } from '../../products/hooks/usePopularProducts';
import { getImageUrl } from '../../../utils/imageUrl';
import { resolveProductImage } from '../../../utils/productImage';
import type { Product } from '../../../types/product.types';

function formatPrice(product: Product): string | null {
    const amount = product.finalPrice ?? product.price;
    if (amount == null || Number.isNaN(Number(amount))) {
        return null;
    }

    const currency = product.currency || 'AZN';
    return `${Number(amount).toLocaleString('az-AZ')} ${currency}`;
}

function getProductSubtitle(product: Product): string | null {
    if (product.description?.trim()) {
        return product.description;
    }

    const meta = [product.brandName, product.categoryName].filter(Boolean);
    if (meta.length > 0) {
        return meta.join(' · ');
    }

    return null;
}

interface PopularCardProps {
    product: Product;
    index: number;
}

function PopularCard({ product, index }: PopularCardProps) {
    const imageUrl = getImageUrl(resolveProductImage(product));
    const hasDiscount = (product.finalDiscountPercent ?? 0) > 0;
    const subtitle = getProductSubtitle(product);
    const priceLabel = formatPrice(product);
    const accentBg = index % 2 === 0 ? 'from-slate-50 to-gray-100' : 'from-gray-50 to-slate-100';

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-gray-200">
            <Link to={`/products/${product.id}`} className="relative block p-4 pb-0">
                <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${accentBg}`}>
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-[85%] w-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.png';
                        }}
                    />

                    {hasDiscount && (
                        <span className="absolute left-2.5 top-2.5 rounded-md bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                            -{product.finalDiscountPercent}%
                        </span>
                    )}

                    <span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 opacity-0 shadow-sm transition-all group-hover:opacity-100 group-hover:text-gray-900">
                        <ArrowUpRight className="h-4 w-4" />
                    </span>
                </div>
            </Link>

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

                <Link to={`/products/${product.id}`}>
                    <h3 className="mb-2 line-clamp-2 min-h-[2.75rem] text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-gray-600">
                        {product.name}
                    </h3>
                </Link>

                {subtitle && (
                    <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-500">{subtitle}</p>
                )}

                <div className="mt-auto space-y-3">
                    {priceLabel ? (
                        <div className="flex items-baseline gap-2">
                            <p className="text-lg font-bold text-gray-900">{priceLabel}</p>
                            {hasDiscount && product.price != null && (
                                <p className="text-xs text-gray-400 line-through">
                                    {Number(product.price).toLocaleString('az-AZ')} {product.currency || 'AZN'}
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">Qiymət sorğu ilə</p>
                    )}

                    <Link to={`/products/${product.id}`}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-gray-200 transition-colors group-hover:border-gray-900 group-hover:bg-gray-900 group-hover:text-white"
                        >
                            Alış-veriş et
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function CardSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100">
            <div className="p-4 pb-0">
                <div className="aspect-square rounded-xl bg-gray-200" />
            </div>
            <div className="space-y-3 p-4">
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="h-5 w-full rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-6 w-24 rounded bg-gray-200" />
                <div className="h-9 rounded bg-gray-200" />
            </div>
        </div>
    );
}

export default function PopularProducts() {
    const { data: products, isLoading, isError } = usePopularProducts();

    if (isLoading) {
        return (
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="mb-10 h-8 w-48 animate-pulse rounded bg-gray-200" />
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <CardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError || !products || products.length === 0) {
        return null;
    }

    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="mb-10 text-center sm:text-left">
                    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                        <Flame className="h-3.5 w-3.5" />
                        Populyar
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900">Məşhur Məhsullar</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Ən çox baxılan və seçilən məhsullar
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product, index) => (
                        <PopularCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
