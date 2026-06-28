import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { useBannerProducts } from '../../products/hooks/useBannerProducts';
import { getProductImageUrl } from '../../../utils/imageUtils';
import type { Product } from '../../../types/product.types';

const SLIDE_INTERVAL = 6000;

const SLIDE_ACCENTS = [
    {
        orb1: 'bg-violet-600/30',
        orb2: 'bg-indigo-500/20',
        gradient: 'from-violet-600/50 via-indigo-900/30 to-transparent',
        glow: 'shadow-violet-500/25',
        dot: 'bg-violet-400',
        badge: 'from-violet-500 to-indigo-600',
    },
    {
        orb1: 'bg-cyan-500/30',
        orb2: 'bg-blue-500/20',
        gradient: 'from-cyan-500/50 via-blue-900/30 to-transparent',
        glow: 'shadow-cyan-500/25',
        dot: 'bg-cyan-400',
        badge: 'from-cyan-500 to-blue-600',
    },
    {
        orb1: 'bg-rose-500/30',
        orb2: 'bg-pink-500/20',
        gradient: 'from-rose-500/50 via-pink-900/30 to-transparent',
        glow: 'shadow-rose-500/25',
        dot: 'bg-rose-400',
        badge: 'from-rose-500 to-pink-600',
    },
    {
        orb1: 'bg-amber-500/30',
        orb2: 'bg-orange-500/20',
        gradient: 'from-amber-500/50 via-orange-900/30 to-transparent',
        glow: 'shadow-amber-500/25',
        dot: 'bg-amber-400',
        badge: 'from-amber-500 to-orange-600',
    },
] as const;

const DEFAULT_SLIDES: Product[] = [
    {
        id: 'default-hero',
        name: 'iPhone 15 Pro Max',
        description: 'Titan dizayn, A17 Pro çipi və pro kamera sistemi ilə yeni nəsil.',
        price: 0,
        currency: 'AZN',
        sku: 'default',
        categoryName: 'Telefonlar',
        brandName: 'Apple',
        stock: 0,
    },
];

function splitProductTitle(name: string) {
    const words = name.trim().split(/\s+/);
    if (words.length <= 1) {
        return { lead: '', highlight: name };
    }
    return {
        lead: words.slice(0, -1).join(' '),
        highlight: words[words.length - 1],
    };
}

function formatPrice(product: Product) {
    const amount = product.finalPrice ?? product.price;
    return `${amount.toLocaleString('az-AZ')} ${product.currency}`;
}

interface HeroSlideContentProps {
    product: Product;
    accentIndex: number;
}

function HeroSlideContent({ product, accentIndex }: HeroSlideContentProps) {
    const accent = SLIDE_ACCENTS[accentIndex % SLIDE_ACCENTS.length];
    const { lead, highlight } = splitProductTitle(product.name);
    const imageUrl = getProductImageUrl(product);
    const hasDiscount = (product.finalDiscountPercent ?? 0) > 0;
    const isDefault = product.id === 'default-hero';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[520px] md:min-h-[600px]">
            <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm"
                >
                    <Sparkles className="h-3.5 w-3.5 text-white/70" />
                    <span className="text-sm font-medium tracking-wide text-white/80">
                        {product.brandName}
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05]"
                >
                    {lead && <span className="block text-white/90">{lead}</span>}
                    <span className="block font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                        {highlight}
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="text-base md:text-lg text-white/50 max-w-lg leading-relaxed"
                >
                    {product.description || 'Yeni nəsil texnologiya ilə tanış olun.'}
                </motion.p>

                {!isDefault && product.price > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45, duration: 0.5 }}
                        className="flex items-center gap-4"
                    >
                        <span className="text-2xl md:text-3xl font-semibold text-white">
                            {formatPrice(product)}
                        </span>
                        {hasDiscount && (
                            <span className={`rounded-full bg-gradient-to-r ${accent.badge} px-3 py-1 text-sm font-semibold text-white shadow-lg`}>
                                -{product.finalDiscountPercent}%
                            </span>
                        )}
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                >
                    <Link to={isDefault ? '/products' : `/products/${product.id}`}>
                        <Button
                            variant="outline"
                            size="lg"
                            className="group border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                        >
                            Alış-veriş et
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative order-1 lg:order-2 flex items-center justify-center"
            >
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${accent.gradient} blur-3xl scale-75`} />

                <div className={`relative w-full max-w-md lg:max-w-lg aspect-square rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-2xl ${accent.glow}`}>
                    {imageUrl ? (
                        <motion.img
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain p-6 md:p-8"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/0">
                            <span className="text-white/30 text-sm">Məhsul şəkli</span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hidden md:block" />
                <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hidden md:block" />
            </motion.div>
        </div>
    );
}

function HeroSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[520px] md:min-h-[600px] animate-pulse">
            <div className="space-y-6 order-2 lg:order-1">
                <div className="h-8 w-32 rounded-full bg-white/10" />
                <div className="h-20 w-3/4 rounded-xl bg-white/10" />
                <div className="h-6 w-full max-w-md rounded-lg bg-white/10" />
                <div className="h-12 w-40 rounded-lg bg-white/10" />
            </div>
            <div className="order-1 lg:order-2">
                <div className="aspect-square max-w-lg mx-auto rounded-3xl bg-white/10" />
            </div>
        </div>
    );
}

export default function HeroSection() {
    const { data: bannerProducts, isLoading } = useBannerProducts();
    const slides = bannerProducts && bannerProducts.length > 0 ? bannerProducts : DEFAULT_SLIDES;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressRef = useRef(0);
    const lastTickRef = useRef(Date.now());

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
        setProgress(0);
        progressRef.current = 0;
        lastTickRef.current = Date.now();
    }, []);

    const goNext = useCallback(() => {
        goToSlide((currentIndex + 1) % slides.length);
    }, [currentIndex, slides.length, goToSlide]);

    const goPrev = useCallback(() => {
        goToSlide((currentIndex - 1 + slides.length) % slides.length);
    }, [currentIndex, slides.length, goToSlide]);

    useEffect(() => {
        setCurrentIndex(0);
        setProgress(0);
        progressRef.current = 0;
        lastTickRef.current = Date.now();
    }, [slides.length]);

    useEffect(() => {
        if (slides.length <= 1 || isPaused) return;

        const tick = () => {
            const now = Date.now();
            const delta = now - lastTickRef.current;
            lastTickRef.current = now;

            progressRef.current += (delta / SLIDE_INTERVAL) * 100;

            if (progressRef.current >= 100) {
                goNext();
                return;
            }

            setProgress(progressRef.current);
        };

        const interval = setInterval(tick, 50);
        return () => clearInterval(interval);
    }, [slides.length, isPaused, goNext, currentIndex]);

    const currentAccent = SLIDE_ACCENTS[currentIndex % SLIDE_ACCENTS.length];

    return (
        <section
            className="relative overflow-hidden bg-[#050508] text-white"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
                setIsPaused(false);
                lastTickRef.current = Date.now();
            }}
        >
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    key={`orb1-${currentIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className={`absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] ${currentAccent.orb1}`}
                />
                <motion.div
                    key={`orb2-${currentIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full blur-[140px] ${currentAccent.orb2}`}
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050508_70%)]" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            <div className="container relative mx-auto px-4 pt-10 pb-6 md:pt-14 md:pb-10">
                {isLoading ? (
                    <HeroSkeleton />
                ) : (
                    <>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={slides[currentIndex].id}
                                initial={{ opacity: 0, x: 60 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -60 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <HeroSlideContent
                                    product={slides[currentIndex]}
                                    accentIndex={currentIndex}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {slides.length > 1 && (
                            <div className="mt-8 md:mt-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    {slides.map((slide, index) => (
                                        <button
                                            key={slide.id}
                                            onClick={() => goToSlide(index)}
                                            aria-label={`Slayd ${index + 1}`}
                                            className="group relative"
                                        >
                                            <div
                                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                                    index === currentIndex
                                                        ? `w-10 ${currentAccent.dot}`
                                                        : 'w-6 bg-white/20 group-hover:bg-white/40'
                                                }`}
                                            />
                                            {index === currentIndex && (
                                                <motion.div
                                                    className={`absolute inset-0 h-1.5 rounded-full ${currentAccent.dot} opacity-50`}
                                                    style={{ width: `${progress}%`, maxWidth: '2.5rem' }}
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-white/40 tabular-nums hidden sm:block">
                                        {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                                    </span>
                                    <button
                                        onClick={goPrev}
                                        aria-label="Əvvəlki slayd"
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={goNext}
                                        aria-label="Növbəti slayd"
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
