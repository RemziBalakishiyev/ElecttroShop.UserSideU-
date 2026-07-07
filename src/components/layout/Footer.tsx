import { Link } from 'react-router-dom';
import ContactLinks from '../common/ContactLinks';

export default function Footer() {
    return (
        <footer className="bg-black text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="text-2xl font-bold tracking-tight mb-4 block">
                            Smartal
                        </Link>
                        <p className="text-gray-400 text-sm">
                            Elektronika məhsullarının satışı ilə məşğul olan modern onlayn mağaza. 
                            Ən yeni texnologiyalar və keyfiyyətli xidmət.
                        </p>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold mb-4">Xidmətlər</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="#" className="hover:text-white">Bonus proqramı</Link></li>
                            <li><Link to="#" className="hover:text-white">Hədiyyə kartları</Link></li>
                            <li><Link to="#" className="hover:text-white">Kredit və ödəniş</Link></li>
                            <li><Link to="#" className="hover:text-white">Xidmət müqavilələri</Link></li>
                            <li><Link to="#" className="hover:text-white">Nağdsız hesab</Link></li>
                            <li><Link to="#" className="hover:text-white">Ödəniş</Link></li>
                        </ul>
                    </div>

                    {/* Assistance */}
                    <div>
                        <h3 className="font-semibold mb-4">Alıcıya kömək</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="#" className="hover:text-white">Sifariş tap</Link></li>
                            <li><Link to="#" className="hover:text-white">Çatdırılma şərtləri</Link></li>
                            <li><Link to="#" className="hover:text-white">Məhsul dəyişdirmə və qaytarma</Link></li>
                            <li><Link to="#" className="hover:text-white">Zəmanət</Link></li>
                            <li><Link to="#" className="hover:text-white">Tez-tez verilən suallar</Link></li>
                            <li><Link to="#" className="hover:text-white">Sayt istifadə şərtləri</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Socials */}
                    <div>
                        <h3 className="font-semibold mb-4">Əlaqəmiz</h3>
                        <ContactLinks variant="dark" className="-ml-2" />
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} Smartal. Bütün hüquqlar qorunur.
                </div>
            </div>
        </footer>
    );
}
