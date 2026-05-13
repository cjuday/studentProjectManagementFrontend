import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AxiosInstance } from '../../config/api/axios';
import { API_CONFIG } from '../../config/api';

const ProjectList = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const getPageTitle = () => {
        if (user?.role === 1) return 'My Submitted Projects';
        if (user?.role === 2) return 'Projects Submitted to Me';
        if (user?.role === 3) return 'All Projects';
        return 'Projects';
    };

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await AxiosInstance.get(API_CONFIG.PROJECTS.LIST);
            setProjects(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const getStatusBadge = (status: number) => {
        const statuses: Record<number, string> = {
            0: 'Pending',
            1: 'Under Review',
            2: 'Need Changes',
            3: 'Approved',
            4: 'Rejected',
        };

        return <span className="badge bg-secondary">{statuses[status] || 'Unknown'}</span>;
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1">{getPageTitle()}</h3>
                </div>

                {user?.role === 1 && (
                    <Link to="/projects/create" className="btn btn-primary">
                        Submit Project
                    </Link>
                )}
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                    {loading ? (
                        <p className="text-muted mb-0">Loading projects...</p>
                    ) : projects.length === 0 ? (
                        <p className="text-muted mb-0">No projects found.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Student</th>
                                        <th>Teacher</th>
                                        <th>Status</th>
                                        <th>Repository</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {projects.map((project) => (
                                        <tr key={project.id}>
                                            <td className="fw-semibold">
                                                {project.title}
                                            </td>

                                            <td>
                                                {project.student?.name || '-'}
                                            </td>

                                            <td>
                                                {project.teacher?.name || 'Not Assigned'}
                                            </td>

                                            <td>
                                                {getStatusBadge(project.status)}
                                            </td>

                                            <td>
                                                <a
                                                    href={project.repository_link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    View Repo
                                                </a>
                                            </td>

                                            <td className="text-end">
                                                <Link
                                                    to={`/projects/${project.id}`}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectList;