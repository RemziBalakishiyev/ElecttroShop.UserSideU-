import { Button } from '../../../components/common/Button';
import { Link } from 'react-router-dom';
import { usePromotionalBrands } from '../../products/hooks/usePromotionalBrands';
import { getProductImageUrl } from '../../../utils/imageUtils';

export default function PromotionalBanners() {
    const { data, isLoading } = usePromotionalBrands();

    // Loading state
    if (isLoading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-8 flex items-center gap-6 animate-pulse">
                                <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // If no promotional brands, show default content
    if (!data || data.items.length === 0) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Default Banner 1 */}
                        <div className="bg-white rounded-xl p-8 flex items-center gap-6">
                            <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-xs text-gray-500">Məhsul</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2">Məhsul</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Məhsul təsviri burada göstəriləcək.
                                </p>
                                <Link to="/products">
                                    <Button variant="outline" size="sm">
                                        Alış-veriş et
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Default Banner 2 */}
                        <div className="bg-white rounded-xl p-8 flex items-center gap-6">
                            <div className="flex-1 text-right">
                                <h3 className="text-2xl font-bold mb-2">Məhsul</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Məhsul təsviri burada göstəriləcək.
                                </p>
                                <Link to="/products">
                                    <Button variant="outline" size="sm">
                                        Alış-veriş et
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-xs text-gray-500">Məhsul</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Show first two promotional brands
    const promotionalBrands = data.items.slice(0, 2);

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {promotionalBrands.map((item, index) => {
                        const { brand, featuredProduct } = item;
                        const isRightAligned = index === 1;

                        return (
                            <div
                                key={brand.id}
                                className="bg-white rounded-xl p-8 flex items-center gap-6"
                            >
                                {!isRightAligned && (
                                    <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                        {featuredProduct.imageId ? (
                                            <img
                                                src={getProductImageUrl(featuredProduct)}
                                                alt={featuredProduct.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-500">{brand.name}</span>
                                        )}
                                    </div>
                                )}
                                <div className={`flex-1 ${isRightAligned ? 'text-right' : ''}`}>
                                    <h3 className="text-2xl font-bold mb-2">{featuredProduct.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {featuredProduct.description || `${brand.name} brendinin seçilmiş məhsulu`}
                                    </p>
                                    <Link to={`/products/${featuredProduct.id}`}>
                                        <Button variant="outline" size="sm">
                                            Alış-veriş et
                                        </Button>
                                    </Link>
                                </div>
                                {isRightAligned && (
                                    <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                        {featuredProduct.imageId ? (
                                            <img
                                                src={getProductImageUrl(featuredProduct)}
                                                alt={featuredProduct.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-500">{brand.name}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Additional banners section - can be removed or kept for future use */}
                {data.items.length > 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.items.slice(2, 4).map((item, index) => {
                            const { brand, featuredProduct } = item;
                            const isDark = index === 1;

                            return (
                                <div
                                    key={brand.id}
                                    className={`rounded-xl p-8 text-center ${isDark ? 'bg-gray-900 text-white' : 'bg-white'}`}
                                >
                                    <div className={`w-32 h-32 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg mx-auto mb-4 overflow-hidden flex items-center justify-center`}>
                                        {featuredProduct.imageId ? (
                                            <img
                                                src={getProductImageUrl(featuredProduct)}
                                                alt={featuredProduct.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                        ) : (
                                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {brand.name}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{featuredProduct.name}</h3>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {featuredProduct.description || `${brand.name} brendinin seçilmiş məhsulu`}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

