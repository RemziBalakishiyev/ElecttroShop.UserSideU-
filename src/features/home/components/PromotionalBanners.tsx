import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { useFeaturedProducts } from '../../products/hooks/useFeaturedProducts';
import { getProductImageUrl } from '../../../utils/imageUtils';
import type { Product } from '../../../types/product.types';

const CARD_THEMES = [
    {
        bg: 'from-slate-900 via-slate-800 to-slate-900',
        accent: 'from-violet-500/20 to-indigo-600/10',
        glow: 'shadow-violet-500/10',
        badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        ring: 'ring-violet-500/20',
        dark: true,
    },
    {
        bg: 'from-zinc-900 via-neutral-800 to-zinc-900',
        accent: 'from-cyan-500/20 to-blue-600/10',
        glow: 'shadow-cyan-500/10',
        badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        ring: 'ring-cyan-500/20',
        dark: true,
    },
    {
        bg: 'from-white to-gray-50',
        accent: 'from-rose-500/10 to-pink-500/5',
        glow: 'shadow-rose-500/10',
        badge: 'bg-rose-50 text-rose-600 border-rose-200',
        ring: 'ring-rose-500/10',
        dark: false,
    },
    {
        bg: 'from-gray-900 to-black',
        accent: 'from-amber-500/15 to-orange-500/5',
        glow: 'shadow-amber-500/10',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        ring: 'ring-amber-500/20',
        dark: true,
    },
] as const;

function formatPrice(product: Product) {
    const amount = product.finalPrice ?? product.price;
    return `${amount.toLocaleString('az-AZ')} ${product.currency}`;
}

interface FeaturedBannerCardProps {
    product: Product;
    index: number;
    variant: 'hero' | 'compact';
}

function FeaturedBannerCard({ product, index, variant }: FeaturedBannerCardProps) {
    const theme = CARD_THEMES[index % CARD_THEMES.length];
    const isDark = theme.dark;
    const imageUrl = getProductImageUrl(product);
    const hasDiscount = (product.finalDiscountPercent ?? 0) > 0;
    const imageOnRight = index % 2 === 1;

    if (variant === 'compact') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${theme.bg} p-6 ring-1 ${theme.ring} shadow-xl ${theme.glow} transition-shadow hover:shadow-2xl`}
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.accent} opacity-60`} />

                <div className="relative flex flex-col items-center text-center">
                    <div className="mb-4 relative">
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${theme.accent} blur-2xl scale-110`} />
                        <div className="relative h-36 w-36 rounded-2xl overflow-hidden bg-white/5 ring-1 ring-white/10">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={product.name}
                                    className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-white/30 text-xs">
                                    Şəkil yoxdur
                                </div>
                            )}
                        </div>
                    </div>

                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium mb-3 ${theme.badge}`}>
                        <Star className="h-3 w-3 fill-current" />
                        Seçilmiş
                    </span>

                    <h3 className={`text-lg font-bold mb-1 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {product.name}
                    </h3>
                    <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                        {product.description || product.brandName}
                    </p>
                    <span className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formatPrice(product)}
                    </span>

                    <Link to={`/products/${product.id}`} className="w-full">
                        <Button
                            variant={isDark ? 'outline' : 'primary'}
                            size="sm"
                            className={`w-full group/btn ${
                                isDark
                                    ? 'border-white/20 bg-white/5 text-white hover:bg-white hover:text-black'
                                    : ''
                            }`}
                        >
                            Bax
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                        </Button>
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            whileHover={{ y: -6 }}
            className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.bg} ring-1 ${theme.ring} shadow-2xl ${theme.glow} transition-all duration-500 hover:shadow-3xl`}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.accent}`} />
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className={`relative flex flex-col ${imageOnRight ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-6 md:gap-10 p-8 md:p-10 min-h-[280px]`}>
                <div className={`flex-1 space-y-4 ${imageOnRight ? 'md:text-right' : ''}`}>
                    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${theme.badge} ${imageOnRight ? 'md:ml-auto' : ''}`}>
                        <Sparkles className="h-3 w-3" />
                        {product.brandName}
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                        {product.name}
                    </h3>

                    <p className="text-white/50 text-sm md:text-base leading-relaxed line-clamp-2 max-w-sm md:max-w-none">
                        {product.description || `${product.brandName} brendinin seçilmiş məhsulu`}
                    </p>

                    <div className={`flex items-center gap-3 flex-wrap ${imageOnRight ? 'md:justify-end' : ''}`}>
                        <span className="text-2xl font-bold text-white">
                            {formatPrice(product)}
                        </span>
                        {hasDiscount && (
                            <span className="rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                                -{product.finalDiscountPercent}%
                            </span>
                        )}
                    </div>

                    <div className={imageOnRight ? 'md:flex md:justify-end' : ''}>
                        <Link to={`/products/${product.id}`}>
                            <Button
                                variant="outline"
                                size="md"
                                className="group/btn border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                            >
                                Alış-veriş et
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="relative flex-shrink-0 w-full md:w-48 lg:w-56">
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${theme.accent} blur-2xl scale-90 opacity-80`} />
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 ring-1 ring-white/10">
                        {imageUrl ? (
                            <motion.img
                                src={imageUrl}
                                alt={product.name}
                                className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                                whileHover={{ rotate: imageOnRight ? -2 : 2 }}
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-white/30 text-sm">
                                Şəkil yoxdur
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function BannerSkeleton({ variant }: { variant: 'hero' | 'compact' }) {
    if (variant === 'compact') {
        return <div className="animate-pulse rounded-2xl bg-gray-200 h-80" />;
    }
    return <div className="animate-pulse rounded-3xl bg-gray-200 h-72 md:h-80" />;
}

export default function PromotionalBanners() {
    const { data: featuredProducts, isLoading, isError } = useFeaturedProducts();

    const products = featuredProducts ?? [];
    const heroProducts = products.slice(0, 2);
    const compactProducts = products.slice(2, 4);

    if (isLoading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BannerSkeleton variant="hero" />
                        <BannerSkeleton variant="hero" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BannerSkeleton variant="compact" />
                        <BannerSkeleton variant="compact" />
                    </div>
                </div>
            </section>
        );
    }

    if (isError || products.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-gray-600 mb-3">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        Seçilmiş məhsullar
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Bu həftənin seçimləri
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {heroProducts.map((product, index) => (
                        <FeaturedBannerCard
                            key={product.id}
                            product={product}
                            index={index}
                            variant="hero"
                        />
                    ))}
                </div>

                {compactProducts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {compactProducts.map((product, index) => (
                            <FeaturedBannerCard
                                key={product.id}
                                product={product}
                                index={index + 2}
                                variant="compact"
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
