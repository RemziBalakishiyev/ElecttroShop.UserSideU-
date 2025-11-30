import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useState, FormEvent } from 'react';

export default function Header() {
    const navigate = useNavigate();
    const { totalItems } = useCart();
    const { wishlist } = useWishlist();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-xl font-bold tracking-tight">
                        CYBER
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-sm font-medium hover:text-gray-600">
                            Ana Səhifə
                        </Link>
                        <Link to="/products" className="text-sm font-medium hover:text-gray-600">
                            Məhsullar
                        </Link>
                        <Link to="/about" className="text-sm font-medium hover:text-gray-600">
                            Haqqımızda
                        </Link>
                        <Link to="/contact" className="text-sm font-medium hover:text-gray-600">
                            Əlaqə
                        </Link>
                    </nav>

                    {/* Search Bar (Desktop) */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center max-w-sm w-full mx-4">
                        <div className="relative w-full">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Axtarış"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-gray-100 border-transparent focus:bg-white"
                            />
                        </div>
                    </form>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Link to="/wishlist" className="relative">
                            <Heart className="h-5 w-5" />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium hidden md:block">
                                    {user.firstName || user.name}
                                </span>
                                <Button variant="ghost" size="sm" onClick={logout}>
                                    Çıxış
                                </Button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <User className="h-5 w-5" />
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-white">
                    <form onSubmit={handleSearch} className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            type="search"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-gray-100 border-transparent focus:bg-white"
                        />
                    </form>
                    <nav className="flex flex-col gap-2">
                        <Link to="/" className="text-sm font-medium py-2">
                            Ana Səhifə
                        </Link>
                        <Link to="/products" className="text-sm font-medium py-2">
                            Məhsullar
                        </Link>
                        <Link to="/about" className="text-sm font-medium py-2">
                            Haqqımızda
                        </Link>
                        <Link to="/contact" className="text-sm font-medium py-2">
                            Əlaqə
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
