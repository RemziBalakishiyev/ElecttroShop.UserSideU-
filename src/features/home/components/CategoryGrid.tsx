import { Smartphone, Watch, Camera, Headphones, Laptop, Gamepad } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
    { id: 'phones', name: 'Telefonlar', icon: Smartphone },
    { id: 'watches', name: 'Smart Saatlar', icon: Watch },
    { id: 'cameras', name: 'Kamera', icon: Camera },
    { id: 'headphones', name: 'Qulaqlıqlar', icon: Headphones },
    { id: 'computers', name: 'Kompyuterlər', icon: Laptop },
    { id: 'gaming', name: 'Oyun', icon: Gamepad },
];

export default function CategoryGrid() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Kateqoriyalara görə bax</h2>
                    <div className="flex gap-2">
                        {/* Navigation arrows could go here */}
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/products?category=${category.id}`}
                            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <category.icon className="h-8 w-8 mb-3 text-gray-500 group-hover:text-black transition-colors" />
                            <span className="text-sm font-medium text-gray-900">{category.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
