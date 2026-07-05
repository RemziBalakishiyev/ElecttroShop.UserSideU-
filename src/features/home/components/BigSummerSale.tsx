import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Percent, Sparkles } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { useDiscountedProducts } from '../../products/hooks/useDiscountedProducts';
import { getImageUrl } from '../../../utils/imageUrl';
import { resolveProductImage } from '../../../utils/productImage';
import type { Product } from '../../../types/product.types';

function formatPrice(product: Product): string | null {
    const amount = product.finalPrice ?? product.price;
    if (amount == null || Number.isNaN(Number(amount))) {
        return null;
    }
    return `${Number(amount).toLocaleString('az-AZ')} ${product.currency || 'AZN'}`;
}

function ProductImageFrame({
    product,
    className = '',
    imageClassName = '',
}: {
    product: Product;
    className?: string;
    imageClassName?: string;
}) {
    const imageUrl = getImageUrl(resolveProductImage(product));

    return (
        <div className={`relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 ${className}`}>
            <img
                src={imageUrl}
                alt={product.name}
                className={`h-full w-full object-contain p-4 ${imageClassName}`}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.png';
                }}
            />
            {(product.finalDiscountPercent ?? 0) > 0 && (
                <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                    -{product.finalDiscountPercent}%
                </span>
            )}
        </div>
    );
}

function SaleSkeleton() {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="animate-pulse rounded-3xl bg-gray-800 p-8 md:p-12">
                    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
                        <div className="h-56 rounded-2xl bg-gray-700" />
                        <div className="space-y-4">
                            <div className="mx-auto h-10 w-3/4 rounded bg-gray-700" />
                            <div className="mx-auto h-4 w-full rounded bg-gray-700" />
                            <div className="mx-auto h-10 w-32 rounded bg-gray-700" />
                        </div>
                        <div className="ml-auto h-40 w-40 rounded-2xl bg-gray-700" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function BigSummerSale() {
    const { data: discountedProducts, isLoading, isError } = useDiscountedProducts();

    const [mainProduct, sideProduct] = useMemo(() => {
        if (!discountedProducts?.length) {
            return [null, null] as const;
        }
        return [discountedProducts[0], discountedProducts[1] ?? null] as const;
    }, [discountedProducts]);

    if (isLoading) {
        return <SaleSkeleton />;
    }

    if (isError || !mainProduct) {
        return null;
    }

    const mainPrice = formatPrice(mainProduct);
    const maxDiscount = mainProduct.finalDiscountPercent ?? 0;

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 text-white shadow-2xl">
                    <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                        }}
                    />

                    <div className="relative grid grid-cols-1 items-center gap-8 p-8 md:grid-cols-[1fr_auto_1fr] md:gap-6 md:p-12 lg:gap-10">
                        <div className="order-2 md:order-1">
                            <ProductImageFrame
                                product={mainProduct}
                                className="mx-auto aspect-[4/3] max-w-md shadow-2xl shadow-black/30 transition-transform duration-500 hover:scale-[1.02] md:max-w-none"
                                imageClassName="p-6 md:p-8"
                            />
                            <p className="mt-3 hidden text-center text-xs text-white/40 md:block">
                                {mainProduct.name}
                            </p>
                        </div>

                        <div className="order-1 space-y-6 text-center md:order-2 md:max-w-sm md:px-4">
                            <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-300">
                                <Sparkles className="h-3.5 w-3.5" />
                                Xüsusi endirim
                            </span>

                            <div>
                                <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                                    Böyük Yay
                                    <span className="block bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                                        Endirimi
                                    </span>
                                </h2>
                                <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-white/55 md:text-base">
                                    {mainProduct.description?.trim() ||
                                        'Ən yaxşı məhsullar ən yaxşı qiymətlərlə. Yay endirimi başlayıb!'}
                                </p>
                            </div>

                            {maxDiscount > 0 && (
                                <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-5 py-3 ring-1 ring-white/10">
                                    <Percent className="h-5 w-5 text-orange-400" />
                                    <div className="text-left">
                                        <p className="text-xs text-white/50">Ən böyük endirim</p>
                                        <p className="text-2xl font-bold text-orange-400">-{maxDiscount}%</p>
                                    </div>
                                </div>
                            )}

                            {mainPrice && (
                                <p className="text-lg font-semibold text-white/80">
                                    {mainPrice}
                                    <span className="ml-2 text-sm font-normal text-white/40 line-through">
                                        {mainProduct.price != null &&
                                            `${Number(mainProduct.price).toLocaleString('az-AZ')} ${mainProduct.currency || 'AZN'}`}
                                    </span>
                                </p>
                            )}

                            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                                <Link to={`/products/${mainProduct.id}`}>
                                    <Button
                                        size="lg"
                                        className="bg-orange-500 text-white hover:bg-orange-400 border-0 shadow-lg shadow-orange-500/25"
                                    >
                                        Alış-veriş et
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link
                                    to="/products"
                                    className="text-sm font-medium text-white/50 transition-colors hover:text-white"
                                >
                                    Bütün endirimlər
                                </Link>
                            </div>
                        </div>

                        <div className="order-3 flex justify-center md:justify-end">
                            {sideProduct ? (
                                <div className="w-full max-w-[200px]">
                                    <ProductImageFrame
                                        product={sideProduct}
                                        className="aspect-square shadow-xl shadow-black/20 transition-transform duration-500 hover:scale-105"
                                    />
                                    <p className="mt-2 text-center text-xs text-white/40 line-clamp-2">
                                        {sideProduct.name}
                                    </p>
                                </div>
                            ) : (
                                <div className="hidden aspect-square w-48 rounded-2xl bg-white/5 ring-1 ring-white/10 md:block" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
