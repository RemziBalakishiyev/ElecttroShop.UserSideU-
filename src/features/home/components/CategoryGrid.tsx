import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Smartphone,
    Watch,
    Camera,
    Headphones,
    Laptop,
    Gamepad,
    LayoutGrid,
    Tv,
    Home,
    Cpu,
    ArrowUpRight,
    Grid3x3,
    type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../products/hooks/useCategories';
import type { Category } from '../../../services/category.service';

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
    phones: Smartphone,
    telefonlar: Smartphone,
    watches: Watch,
    'smart-saatlar': Watch,
    cameras: Camera,
    kamera: Camera,
    headphones: Headphones,
    qulaqlıqlar: Headphones,
    computers: Laptop,
    kompyuterler: Laptop,
    kompyuterlər: Laptop,
    gaming: Gamepad,
    oyun: Gamepad,
    elektronika: Cpu,
    'meiset-texnikasi': Home,
    'məişət-texnikası': Home,
};

// Smartal palette — clean blue ⇄ orange alternation (no random multi-hue).
const CATEGORY_THEMES = [
    {
        iconBg: 'from-primary-500 to-primary-700',
        iconShadow: 'shadow-primary-500/30',
        hoverBorder: 'group-hover:border-primary-200',
        glow: 'group-hover:shadow-primary-500/10',
        accent: 'bg-primary-500',
    },
    {
        iconBg: 'from-accent-500 to-accent-600',
        iconShadow: 'shadow-accent-500/30',
        hoverBorder: 'group-hover:border-accent-200',
        glow: 'group-hover:shadow-accent-500/10',
        accent: 'bg-accent-500',
    },
] as const;

function getCategoryIcon(category: Category): LucideIcon {
    const slugKey = category.slug.toLowerCase();
    if (CATEGORY_ICON_MAP[slugKey]) {
        return CATEGORY_ICON_MAP[slugKey];
    }

    const nameKey = category.name.toLowerCase();
    if (CATEGORY_ICON_MAP[nameKey]) {
        return CATEGORY_ICON_MAP[nameKey];
    }

    if (slugKey.includes('phone') || slugKey.includes('telefon') || nameKey.includes('elektron')) return Cpu;
    if (slugKey.includes('watch') || slugKey.includes('saat')) return Watch;
    if (slugKey.includes('camera') || slugKey.includes('kamera')) return Camera;
    if (slugKey.includes('headphone') || slugKey.includes('qulaq')) return Headphones;
    if (slugKey.includes('computer') || slugKey.includes('laptop') || slugKey.includes('kompyuter')) return Laptop;
    if (slugKey.includes('game') || slugKey.includes('oyun')) return Gamepad;
    if (slugKey.includes('tv') || nameKey.includes('televizor')) return Tv;
    if (slugKey.includes('meiset') || slugKey.includes('məişət') || nameKey.includes('məişət')) return Home;

    return LayoutGrid;
}

interface CategoryCardProps {
    category: Category;
    index: number;
}

function CategoryCard({ category, index }: CategoryCardProps) {
    const Icon = getCategoryIcon(category);
    const theme = CATEGORY_THEMES[index % CATEGORY_THEMES.length];
    const hasDiscount = category.discountPercent > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
        >
            <Link
                to={`/products?categoryId=${category.id}`}
                className={`group relative flex flex-col items-center justify-center p-6 md:p-8 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${theme.hoverBorder} ${theme.glow} overflow-hidden`}
            >
                <div className={`absolute top-0 left-0 right-0 h-1 ${theme.accent} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />

                {hasDiscount && (
                    <span className="absolute top-3 right-3 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        -{category.discountPercent}%
                    </span>
                )}

                <div className="relative mb-4">
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${theme.iconBg} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 scale-150`} />
                    <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.iconBg} shadow-lg ${theme.iconShadow} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon className="h-6 w-6 text-white" strokeWidth={1.75} />
                    </div>
                </div>

                <span className="text-sm font-semibold text-gray-900 text-center leading-snug group-hover:text-black transition-colors">
                    {category.name}
                </span>

                <span className="mt-2 flex items-center gap-0.5 text-xs font-medium text-gray-400 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Bax
                    <ArrowUpRight className="h-3 w-3" />
                </span>
            </Link>
        </motion.div>
    );
}

function CategorySkeleton() {
    return (
        <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-8 h-40">
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gray-200" />
            <div className="mx-auto h-4 w-20 rounded bg-gray-200" />
        </div>
    );
}

export default function CategoryGrid() {
    const categoriesParams = useMemo(() => ({
        page: 1,
        pageSize: 100,
    }), []);

    const { data, isLoading, isError } = useCategories(categoriesParams);

    const categories = useMemo(
        () => (data?.items || []).filter((category) => !category.parentId),
        [data?.items],
    );

    return (
        <section className="relative py-16 md:py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
            <div
                className="absolute inset-0 opacity-[0.35]"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(209 213 219) 1px, transparent 0)',
                    backgroundSize: '28px 28px',
                }}
            />

            <div className="container relative mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
                >
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-gray-600 mb-3">
                            <Grid3x3 className="h-3.5 w-3.5" />
                            Kateqoriyalar
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Kateqoriyalara görə bax
                        </h2>
                        <p className="mt-2 text-gray-500 text-sm md:text-base">
                            İstədiyiniz məhsul qrupunu seçin və alış-verişə başlayın
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-black transition-colors group"
                    >
                        Hamısına bax
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </motion.div>

                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-5">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <CategorySkeleton key={index} />
                        ))}
                    </div>
                ) : isError || categories.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl border border-dashed border-gray-200 bg-white/60">
                        <LayoutGrid className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                        <p className="text-gray-500">Kateqoriya tapılmadı</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-5">
                        {categories.map((category, index) => (
                            <CategoryCard key={category.id} category={category} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
