import HeroSection from '../features/home/components/HeroSection';
import PromotionalBanners from '../features/home/components/PromotionalBanners';
import CategoryGrid from '../features/home/components/CategoryGrid';
import FeaturedProducts from '../features/home/components/FeaturedProducts';
import PopularProducts from '../features/home/components/PopularProducts';
import DiscountsSection from '../features/home/components/DiscountsSection';
import BigSummerSale from '../features/home/components/BigSummerSale';

export default function HomePage() {
    return (
        <div className="flex flex-col">
            <HeroSection />
            <PromotionalBanners />
            <CategoryGrid />
            <FeaturedProducts />
            <PopularProducts />
            <DiscountsSection />
            <BigSummerSale />
        </div>
    );
}
