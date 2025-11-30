import { Button } from '../../../components/common/Button';
import { Link } from 'react-router-dom';

const popularProducts = [
    {
        id: 'popular-1',
        title: 'Məşhur Məhsullar',
        description: 'Retina ekran, güclü performans və çoxtapşırıqlı imkanlar.',
        image: 'earbuds-watch',
        link: '/products',
    },
    {
        id: 'popular-2',
        title: 'iPad Pro',
        description: 'Retina ekran, güclü performans və çoxtapşırıqlı imkanlar.',
        image: 'ipad',
        link: '/products?category=tablets',
    },
    {
        id: 'popular-3',
        title: 'Samsung Galaxy',
        description: 'Retina ekran, güclü performans və çoxtapşırıqlı imkanlar.',
        image: 'galaxy',
        link: '/products?category=phones',
    },
    {
        id: 'popular-4',
        title: 'Macbook Pro',
        description: 'Retina ekran, güclü performans və çoxtapşırıqlı imkanlar.',
        image: 'macbook',
        link: '/products?category=computers',
    },
];

export default function PopularProducts() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {popularProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl p-6 text-center group hover:shadow-lg transition-shadow"
                        >
                            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                                <span className="text-xs text-gray-500">{product.title}</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">{product.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                            <Link to={product.link}>
                                <Button variant="outline" size="sm" className="w-full">
                                    Alış-veriş et
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

