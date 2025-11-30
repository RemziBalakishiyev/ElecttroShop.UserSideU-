import { Button } from '../../../components/common/Button';
import { Link } from 'react-router-dom';
import { useBannerProduct } from '../../products/hooks/useBannerProduct';
import { getProductImageUrl } from '../../../utils/imageUtils';

export default function HeroSection() {
    const { data: bannerProduct, isLoading } = useBannerProduct();

    // If no banner product, show default content
    if (!isLoading && !bannerProduct) {
        return (
            <section className="bg-black text-white">
                <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <p className="text-gray-400 font-medium">Pro. Beyond.</p>
                            <h1 className="text-5xl md:text-7xl font-thin tracking-tighter">
                                IPhone 14 <span className="font-bold">Pro</span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-md">
                                Hər şeyi daha yaxşı etmək üçün yaradılıb. Hamı üçün.
                            </p>
                            <Link to="/products">
                                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                                    Alış-veriş et
                                </Button>
                            </Link>
                        </div>
                        <div className="relative h-64 md:h-96 lg:h-[500px]">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl flex items-center justify-center">
                                <span className="text-gray-600">Seçilmiş məhsul</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (isLoading) {
        return (
            <section className="bg-black text-white">
                <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6 animate-pulse">
                            <div className="h-4 bg-gray-700 rounded w-32"></div>
                            <div className="h-16 bg-gray-700 rounded w-3/4"></div>
                            <div className="h-6 bg-gray-700 rounded w-full max-w-md"></div>
                            <div className="h-10 bg-gray-700 rounded w-32"></div>
                        </div>
                        <div className="relative h-64 md:h-96 lg:h-[500px]">
                            <div className="absolute inset-0 bg-gray-800 rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-black text-white">
            <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <p className="text-gray-400 font-medium">{bannerProduct.brandName}</p>
                        <h1 className="text-5xl md:text-7xl font-thin tracking-tighter">
                            {bannerProduct.name.split(' ').slice(0, -1).join(' ')}{' '}
                            <span className="font-bold">{bannerProduct.name.split(' ').slice(-1)[0]}</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-md">
                            {bannerProduct.description || 'Created to change everything for the better. For everyone.'}
                        </p>
                        <Link to={`/products/${bannerProduct.id}`}>
                            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                                Alış-veriş et
                            </Button>
                        </Link>
                    </div>
                    <div className="relative h-64 md:h-96 lg:h-[500px]">
                        <img
                            src={getProductImageUrl(bannerProduct)}
                            alt={bannerProduct.name}
                            className="w-full h-full object-contain rounded-2xl"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-image.jpg';
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
