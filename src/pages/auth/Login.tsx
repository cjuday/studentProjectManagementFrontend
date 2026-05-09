import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AxiosInstance } from '../../config/api/axios';
import { API_CONFIG } from '../../config/api';

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');

            const response = await AxiosInstance.post(
                API_CONFIG.auth.login,
                formData
            );

            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem(
                'user',
                JSON.stringify(response.data.data.user)
            );

            navigate('/dashboard');
        } catch (error: any) {
            setError(
                error?.response?.data?.message ||
                'Login failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="row w-100 justify-content-center">
                <div className="col-md-5 col-lg-4">
                    <div className="card shadow border-0 rounded-4">
                        <div className="card-body p-5">
                            <h2 className="text-center fw-bold mb-4">
                                Student Project Management
                            </h2>

                            <p className="text-center text-muted mb-4">
                                Login to your account
                            </p>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Enter email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Enter password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </form>

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