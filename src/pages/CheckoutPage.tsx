import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useCart } from '../context/CartContext';
import { getProductImageUrl } from '../utils/imageUtils';
import { Badge } from '../components/common/Badge';

const shippingSchema = Yup.object().shape({
    firstName: Yup.string().required('Ad tələb olunur'),
    lastName: Yup.string().required('Soyad tələb olunur'),
    email: Yup.string().email('Yanlış email').required('Email tələb olunur'),
    phone: Yup.string().required('Telefon nömrəsi tələb olunur'),
    address: Yup.string().required('Ünvan tələb olunur'),
    city: Yup.string().required('Şəhər tələb olunur'),
    zipCode: Yup.string().required('Poçt indeksi tələb olunur'),
    country: Yup.string().required('Ölkə tələb olunur'),
});

const paymentSchema = Yup.object().shape({
    cardNumber: Yup.string()
        .required('Kart nömrəsi tələb olunur')
        .matches(/^\d{16}$/, 'Kart nömrəsi 16 rəqəm olmalıdır'),
    cardName: Yup.string().required('Kart sahibinin adı tələb olunur'),
    expiryDate: Yup.string()
        .required('Bitmə tarixi tələb olunur')
        .matches(/^\d{2}\/\d{2}$/, 'Format: AA/İİ'),
    cvv: Yup.string()
        .required('CVV tələb olunur')
        .matches(/^\d{3}$/, 'CVV 3 rəqəm olmalıdır'),
});

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCart();
    const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');

    const shippingForm = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            zipCode: '',
            country: '',
        },
        validationSchema: shippingSchema,
        onSubmit: (values) => {
            console.log('Shipping info:', values);
            setStep('payment');
        },
    });

    const paymentForm = useFormik({
        initialValues: {
            cardNumber: '',
            cardName: '',
            expiryDate: '',
            cvv: '',
        },
        validationSchema: paymentSchema,
        onSubmit: (values) => {
            console.log('Payment info:', values);
            // In real app, process payment here
            clearCart();
            setStep('confirmation');
        },
    });

    if (items.length === 0 && step !== 'confirmation') {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Səbətiniz boşdur</h2>
                <Button onClick={() => navigate('/products')}>Alış-verişə davam et</Button>
            </div>
        );
    }

    if (step === 'confirmation') {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto text-center">
                    <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Sifariş təsdiqləndi!</h1>
                    <p className="text-gray-600 mb-8">
                        Alış-verişiniz üçün təşəkkürlər. Sifarişiniz qəbul edildi və işləməyə başladı.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => navigate('/products')}>Alış-verişə davam et</Button>
                        <Button variant="outline" onClick={() => navigate('/')}>
                            Ana səhifəyə qayıt
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Sifarişi tamamla</h1>

            {/* Progress Steps */}
            <div className="mb-8 flex items-center justify-center gap-4">
                <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-black' : 'text-gray-400'}`}>
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step === 'shipping' ? 'bg-black text-white' : 'bg-gray-200'
                        }`}
                    >
                        1
                    </div>
                    <span className="hidden sm:inline">Çatdırılma</span>
                </div>
                <div className="w-16 h-0.5 bg-gray-200" />
                <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-black' : 'text-gray-400'}`}>
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step === 'payment' ? 'bg-black text-white' : 'bg-gray-200'
                        }`}
                    >
                        2
                    </div>
                    <span className="hidden sm:inline">Ödəniş</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2">
                    {step === 'shipping' ? (
                        <form onSubmit={shippingForm.handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Truck className="h-5 w-5" />
                                <h2 className="text-xl font-bold">Çatdırılma məlumatları</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Ad"
                                    name="firstName"
                                    value={shippingForm.values.firstName}
                                    onChange={shippingForm.handleChange}
                                    onBlur={shippingForm.handleBlur}
                                    error={
                                        shippingForm.touched.firstName && shippingForm.errors.firstName
                                            ? shippingForm.errors.firstName
                                            : undefined
                                    }
                                />
                                <Input
                                    label="Soyad"
                                    name="lastName"
                                    value={shippingForm.values.lastName}
                                    onChange={shippingForm.handleChange}
                                    onBlur={shippingForm.handleBlur}
                                    error={
                                        shippingForm.touched.lastName && shippingForm.errors.lastName
                                            ? shippingForm.errors.lastName
                                            : undefined
                                    }
                                />
                            </div>

                            <Input
                                label="E-poçt"
                                type="email"
                                name="email"
                                value={shippingForm.values.email}
                                onChange={shippingForm.handleChange}
                                onBlur={shippingForm.handleBlur}
                                error={
                                    shippingForm.touched.email && shippingForm.errors.email
                                        ? shippingForm.errors.email
                                        : undefined
                                }
                            />

                            <Input
                                label="Telefon"
                                name="phone"
                                value={shippingForm.values.phone}
                                onChange={shippingForm.handleChange}
                                onBlur={shippingForm.handleBlur}
                                error={
                                    shippingForm.touched.phone && shippingForm.errors.phone
                                        ? shippingForm.errors.phone
                                        : undefined
                                }
                            />

                            <Input
                                label="Ünvan"
                                name="address"
                                value={shippingForm.values.address}
                                onChange={shippingForm.handleChange}
                                onBlur={shippingForm.handleBlur}
                                error={
                                    shippingForm.touched.address && shippingForm.errors.address
                                        ? shippingForm.errors.address
                                        : undefined
                                }
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Input
                                    label="Şəhər"
                                    name="city"
                                    value={shippingForm.values.city}
                                    onChange={shippingForm.handleChange}
                                    onBlur={shippingForm.handleBlur}
                                    error={
                                        shippingForm.touched.city && shippingForm.errors.city
                                            ? shippingForm.errors.city
                                            : undefined
                                    }
                                />
                                <Input
                                    label="Poçt indeksi"
                                    name="zipCode"
                                    value={shippingForm.values.zipCode}
                                    onChange={shippingForm.handleChange}
                                    onBlur={shippingForm.handleBlur}
                                    error={
                                        shippingForm.touched.zipCode && shippingForm.errors.zipCode
                                            ? shippingForm.errors.zipCode
                                            : undefined
                                    }
                                />
                                <Input
                                    label="Ölkə"
                                    name="country"
                                    value={shippingForm.values.country}
                                    onChange={shippingForm.handleChange}
                                    onBlur={shippingForm.handleBlur}
                                    error={
                                        shippingForm.touched.country && shippingForm.errors.country
                                            ? shippingForm.errors.country
                                            : undefined
                                    }
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Ödənişə keç
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={paymentForm.handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 mb-6">
                                <CreditCard className="h-5 w-5" />
                                <h2 className="text-xl font-bold">Ödəniş məlumatları</h2>
                            </div>

                            <Input
                                label="Kart nömrəsi"
                                name="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={paymentForm.values.cardNumber}
                                onChange={paymentForm.handleChange}
                                onBlur={paymentForm.handleBlur}
                                error={
                                    paymentForm.touched.cardNumber && paymentForm.errors.cardNumber
                                        ? paymentForm.errors.cardNumber
                                        : undefined
                                }
                            />

                            <Input
                                label="Kart sahibinin adı"
                                name="cardName"
                                placeholder="Ad Soyad"
                                value={paymentForm.values.cardName}
                                onChange={paymentForm.handleChange}
                                onBlur={paymentForm.handleBlur}
                                error={
                                    paymentForm.touched.cardName && paymentForm.errors.cardName
                                        ? paymentForm.errors.cardName
                                        : undefined
                                }
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Bitmə tarixi"
                                    name="expiryDate"
                                    placeholder="AA/İİ"
                                    value={paymentForm.values.expiryDate}
                                    onChange={paymentForm.handleChange}
                                    onBlur={paymentForm.handleBlur}
                                    error={
                                        paymentForm.touched.expiryDate && paymentForm.errors.expiryDate
                                            ? paymentForm.errors.expiryDate
                                            : undefined
                                    }
                                />
                                <Input
                                    label="CVV"
                                    name="cvv"
                                    placeholder="123"
                                    type="password"
                                    value={paymentForm.values.cvv}
                                    onChange={paymentForm.handleChange}
                                    onBlur={paymentForm.handleBlur}
                                    error={
                                        paymentForm.touched.cvv && paymentForm.errors.cvv
                                            ? paymentForm.errors.cvv
                                            : undefined
                                    }
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep('shipping')}
                                    className="flex-1"
                                >
                                    Geri
                                </Button>
                                <Button type="submit" className="flex-1">
                                    Sifarişi tamamla
                                </Button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Sifariş xülasəsi</h2>

                        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                            {items.map((item) => {
                                const price = item.product.finalPrice ?? item.product.price;
                                return (
                                    <div key={item.product.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
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
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{item.product.name}</p>
                                            <p className="text-sm text-gray-600">Miqdar: {item.quantity}</p>
                                            <p className="text-sm font-bold">
                                                {item.product.currency}{price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t pt-4 space-y-2">
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
                            <div className="border-t pt-2 flex justify-between text-lg font-bold">
                                <span>Cəmi</span>
                                <span>{(totalPrice * 1.1).toFixed(2)} {items[0]?.product.currency || 'AZN'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
