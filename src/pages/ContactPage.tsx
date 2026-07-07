import ContactLinks from '../components/common/ContactLinks';

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-md">
                <h1 className="text-3xl font-bold tracking-tight">Əlaqəmiz</h1>
                <p className="mt-2 text-gray-600">
                    Sual və sifarişləriniz üçün bizimlə əlaqə saxlayın. Sosial şəbəkələrdə bizi izləyin.
                </p>

                <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
                    <ContactLinks variant="light" />
                </div>
            </div>
        </div>
    );
}
