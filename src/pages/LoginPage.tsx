import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';

const loginSchema = Yup.object().shape({
    email: Yup.string().email('Yanlış email ünvanı').required('Email tələb olunur'),
    password: Yup.string().required('Şifrə tələb olunur'),
});

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            try {
                await login(values);
                navigate('/');
            } catch (error: any) {
                setFieldError('email', error.response?.data?.message || 'Yanlış email və ya şifrə');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold mb-2">Xoş gəlmisiniz</h1>
                    <p className="text-gray-600 mb-8">Hesabınıza daxil olun</p>

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
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

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded border-gray-300" />
                                <span className="text-sm text-gray-600">Məni xatırla</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-black">
                                Şifrəni unutmusunuz?
                            </Link>
                        </div>

                        <Button type="submit" className="w-full" isLoading={formik.isSubmitting}>
                            Daxil ol
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Hesabınız yoxdur?{' '}
                            <Link to="/register" className="text-black font-medium hover:underline">
                                Qeydiyyatdan keç
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
