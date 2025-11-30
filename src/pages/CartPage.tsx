import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getProductImageUrl } from '../utils/imageUtils';
import { Badge } from '../components/common/Badge';

export default function CartPage() {
    const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
    const { showToast } = useToast();

    const handleRemove = (productId: string, productName: string) => {
        removeFromCart(productId);
        showToast(`${productName} səbətdən silindi`, 'info');
    };

    const handleClearCart = () => {
        clearCart();
        showToast('Səbət təmizləndi', 'info');
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold mb-4">Səbətiniz boşdur</h2>
                    <p className="text-gray-600 mb-8">Görünür, hələ səbətinizə heç nə əlavə etməmisiniz.</p>
                    <Link to="/products">
                        <Button>Alış-verişə davam et</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Alış-veriş səbəti</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => {
                        const price = item.product.finalPrice ?? item.product.price;
                        return (
                            <div
                                key={item.product.id}
                                className="bg-white rounded-xl p-6 shadow-sm flex flex-col sm:flex-row gap-6"
                            >
                                {/* Product Image */}
                                <div className="flex-shrink-0">
                                    <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={getProductImageUrl(item.product)}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder-image.jpg';
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 flex flex-col sm:flex-row justify-between">
                                    <div className="flex-1">
                                        <Link to={`/products/${item.product.id}`}>
                                            <h3 className="text-lg font-medium mb-2 hover:text-gray-600">
                                                {item.product.name}
                                            </h3>
                                        </Link>
                                        {item.product.description && (
                                            <p className="text-sm text-gray-600 mb-2">{item.product.description}</p>
                                        )}
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-lg font-bold">
                                                {item.product.currency}{price}
                                            </span>
                                            {item.product.finalPrice && item.product.finalPrice < item.product.price && (
                                                <>
                                                    <span className="text-sm text-gray-400 line-through">
                                                        {item.product.currency}{item.product.price}
                                                    </span>
                                                    {item.product.finalDiscountPercent && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            -{item.product.finalDiscountPercent}%
                                                        </Badge>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex flex-col sm:items-end gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center border rounded-md">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="p-2 hover:bg-gray-100"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="px-4 py-2 min-w-[60px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    className="p-2 hover:bg-gray-100"
                                                    disabled={item.quantity >= item.product.stock}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(item.product.id, item.product.name)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold">
                                                {item.product.currency}{(price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex justify-end">
                        <Button variant="ghost" onClick={handleClearCart} className="text-red-600 hover:text-red-700">
                            Səbəti təmizlə
                        </Button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Sifariş xülasəsi</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Alt cəmi</span>
                                <span>{totalPrice.toFixed(2)} {items[0]?.product.currency || 'AZN'}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Çatdırılma</span>
                                <span>Pulsuz</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>ƏDV</span>
                                <span>{(totalPrice * 0.1).toFixed(2)} {items[0]?.product.currency || 'AZN'}</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between text-lg font-bold">
                                <span>Cəmi</span>
                                <span>{(totalPrice * 1.1).toFixed(2)} {items[0]?.product.currency || 'AZN'}</span>
                            </div>
                        </div>

                        <Link to="/checkout">
                            <Button className="w-full mb-4">Sifarişi tamamla</Button>
                        </Link>
                        <Link to="/products">
                            <Button variant="outline" className="w-full">
                                Alış-verişə davam et
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
