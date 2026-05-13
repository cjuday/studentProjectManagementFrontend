import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { AxiosInstance } from '../../config/api/axios';
import { API_CONFIG } from '../../config/api';
import { loginInitialValues, loginValidationSchema } from './formik';

const Login = () => {
    const navigate = useNavigate();

    const handleSubmit = async (
        values: typeof loginInitialValues,
        { setSubmitting, setStatus }: any
    ) => {
        try {
            setStatus('');

            const response = await AxiosInstance.post(API_CONFIG.AUTH.LOGIN, values);

            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));

            navigate('/dashboard');
        } catch (error: any) {
            setStatus(error?.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="row w-100 justify-content-center">
                <div className="col-md-5 col-lg-4">
                    <div className="card shadow border-0 rounded-4">
                        <div className="card-body p-5">
                            <h2 className="text-center fw-bold mb-2">
                                Student Project Management
                            </h2>

                            <p className="text-center text-muted mb-4">
                                Login to your account
                            </p>

                            <Formik
                                initialValues={loginInitialValues}
                                validationSchema={loginValidationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting, status }) => (
                                    <Form>
                                        {status && (
                                            <div className="alert alert-danger">
                                                {status}
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label className="form-label">
                                                Email Address
                                            </label>

                                            <Field
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                placeholder="Enter your email"
                                            />

                                            <div className="text-danger small mt-1">
                                                <ErrorMessage name="email" />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label">
                                                Password
                                            </label>

                                            <Field
                                                type="password"
                                                name="password"
                                                className="form-control"
                                                placeholder="Enter your password"
                                            />

                                            <div className="text-danger small mt-1">
                                                <ErrorMessage name="password" />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Logging in...' : 'Login'}
                                        </button>
                                    </Form>
                                )}
                            </Formik>

                            <div className="text-center mt-4">
                                <span className="text-muted">
                                    Don&apos;t have an account?
                                </span>

                                <Link
                                    to="/register"
                                    className="ms-2 text-decoration-none"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;