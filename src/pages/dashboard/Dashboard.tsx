import { useEffect, useState } from 'react';
import { AxiosInstance } from '../../config/api/axios';
import { API_CONFIG } from '../../config/api';
import { PROJECT_STATUS } from '../../constants/ProjectStatus';
import { USER_ROLE } from '../../constants/userRole';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchProjects = async () => {
        try {
            setLoading(true);

            const response = await AxiosInstance.get(`${API_CONFIG.PROJECTS.LIST}?per_page=1000`);

            setProjects(response.data.data.data || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const getCountByStatus = (status: number) => {
        return projects.filter((project) => project.status === status).length;
    };

    const stats = {
        submitted: projects.length,
        pending: getCountByStatus(PROJECT_STATUS.PENDING),
        underReview: getCountByStatus(PROJECT_STATUS.UNDER_REVIEW),
        changesRequested: getCountByStatus(PROJECT_STATUS.NEED_CHANGES),
        approved: getCountByStatus(PROJECT_STATUS.APPROVED),
        rejected: getCountByStatus(PROJECT_STATUS.REJECTED)
    };

    return (
        <div>
            <h3 className="fw-bold mb-4">Dashboard</h3>

            <div className="row">
                <div className="col-md-12">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <h6 className="text-muted">Welcome</h6>
                            <h4>{user?.name || 'User'}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className="fw-bold my-4">Statistics</h3>

            {loading ? (
                <p className="text-muted">Loading statistics...</p>
            ) : (
                <>
                    <div className="row g-4">
                        <StatCard title={user?.role === USER_ROLE.STUDENT ? "Submitted Projects" : user?.role === USER_ROLE.TEACHER ? "Projects Submitted To You" : "All Submitted Projects"} value={stats.submitted} />
                        <StatCard title="Pending For Review" value={stats.pending} />
                        <StatCard title="Under Review" value={stats.underReview} />
                    </div>

                    <div className="row g-4 mt-1">
                        <StatCard title="Changes Requested" value={stats.changesRequested} />
                        <StatCard title="Approved Projects" value={stats.approved} />
                        <StatCard title="Rejected Projects" value={stats.rejected} />
                    </div>
                </>
            )}
        </div>
    );
};

const StatCard = ({ title, value }: { title: string; value: number }) => {
    return (
        <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                    <h6 className="text-muted">{title}</h6>
                    <h4>{value}</h4>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;