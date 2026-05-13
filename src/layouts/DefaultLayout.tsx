import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AxiosInstance } from '../config/api/axios';
import { API_CONFIG } from '../config/api';

const DefaultLayout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [logoutLoading, setLogoutLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLogoutLoading(true);
            await AxiosInstance.post(API_CONFIG.AUTH.LOGOUT);
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setLogoutLoading(false);
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            navigate('/login');
        }
    };

    return (
        <div className="d-flex min-vh-100 bg-light">
            <aside className="bg-dark text-white p-3" style={{ width: '260px' }}>
                <h4 className="fw-bold mb-4 text-center">SPMS</h4>

                <ul className="nav flex-column gap-2">
                    <li className="nav-item">
                        <NavLink
                            to="/dashboard"
                            className="nav-link text-white"
                        >
                            {({ isActive }) => (
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className={isActive ? 'fw-bold' : ''}>
                                        Dashboard
                                    </span>

                                    {isActive && (
                                        <span
                                            className="bg-primary rounded-circle"
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink
                            to="/projects"
                            className="nav-link text-white"
                        >
                            {({ isActive }) => (
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className={isActive ? 'fw-bold' : ''}>
                                        Projects
                                    </span>

                                    {isActive && (
                                        <span
                                            className="bg-primary rounded-circle"
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                        </NavLink>
                    </li>
                </ul>
            </aside>

            <main className="flex-grow-1">
                <nav className="navbar navbar-light bg-white shadow-sm px-4">
                    <span className="navbar-brand mb-0 h5">
                        Student Project Management System
                    </span>

                    <div className="d-flex align-items-center gap-3">
                        <span className="text-muted">
                            Hello, {user?.name || 'User'}
                        </span>

                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleLogout}
                            disabled={logoutLoading}
                        >
                            {logoutLoading ? 'Logging out...' : 'Logout'}
                        </button>
                    </div>
                </nav>

                <div className="p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DefaultLayout;