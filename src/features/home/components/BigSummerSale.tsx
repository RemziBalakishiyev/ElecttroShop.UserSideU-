import { Button } from '../../../components/common/Button';
import { Link } from 'react-router-dom';

export default function BigSummerSale() {
    return (
        <section className="py-16 bg-gray-900 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="flex-shrink-0">
                        <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">Tablet Image</span>
                        </div>
                    </div>
                    <div className="text-center space-y-6">
                        <h2 className="text-4xl md:text-5xl font-bold">Böyük Yay Endirimi</h2>
                        <p className="text-gray-400 text-lg max-w-md mx-auto">
                            Ən yaxşı məhsullar ən yaxşı qiymətlərlə. Yay endirimi başlayıb!
                        </p>
                        <Link to="/products">
                            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                                Alış-veriş et
                            </Button>
                        </Link>
                    </div>
                    <div className="flex-shrink-0 flex justify-end">
                        <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Phone & Watch</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

