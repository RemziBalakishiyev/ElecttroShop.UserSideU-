import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';

const registerSchema = Yup.object().shape({
    firstName: Yup.string().required('Ad tələb olunur'),
    lastName: Yup.string().required('Soyad tələb olunur'),
    email: Yup.string().email('Yanlış email ünvanı').required('Email tələb olunur'),
    password: Yup.string()
        .min(8, 'Şifrə ən azı 8 simvol olmalıdır')
        .required('Şifrə tələb olunur'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Şifrələr uyğun gəlmir')
        .required('Şifrəni təsdiqləyin'),
});

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: registerSchema,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            try {
                await register({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                });
                navigate('/login');
            } catch (error: any) {
                setFieldError('email', error.response?.data?.message || 'Qeydiyyat uğursuz oldu');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold mb-2">Hesab yarat</h1>
                    <p className="text-gray-600 mb-8">Başlamaq üçün qeydiyyatdan keçin</p>

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Ad"
                                name="firstName"
                                placeholder="Ad"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.firstName && formik.errors.firstName
                                        ? formik.errors.firstName
                                        : undefined
                                }
                            />
                            <Input
                                label="Soyad"
                                name="lastName"
                                placeholder="Soyad"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.lastName && formik.errors.lastName
                                        ? formik.errors.lastName
                                        : undefined
                                }
                            />
                        </div>

                        <Input
                            label="E-poçt"
                            type="email"
                            name="email"
                            placeholder="siz@misal.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
                        />

                        <Input
                            label="Şifrə"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.password && formik.errors.password
                                    ? formik.errors.password
                                    : undefined
                            }
                        />

                        <Input
                            label="Şifrəni təsdiqlə"
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.confirmPassword && formik.errors.confirmPassword
                                    ? formik.errors.confirmPassword
                                    : undefined
                            }
                        />

                        <div className="flex items-center gap-2">
                            <input type="checkbox" className="rounded border-gray-300" required />
                            <span className="text-sm text-gray-600">
                                Mən razıyam{' '}
                                <Link to="/terms" className="text-black hover:underline">
                                    Xidmət şərtləri
                                </Link>{' '}
                                və{' '}
                                <Link to="/privacy" className="text-black hover:underline">
                                    Məxfilik siyasəti
                                </Link>
                                ilə
                            </span>
                        </div>

                        <Button type="submit" className="w-full" isLoading={formik.isSubmitting}>
                            Hesab yarat
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Artıq hesabınız var?{' '}
                            <Link to="/login" className="text-black font-medium hover:underline">
                                Daxil ol
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
