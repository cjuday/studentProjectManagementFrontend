import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AxiosInstance } from '../../config/api/axios';
import { API_CONFIG } from '../../config/api';
import ProjectDetailsModal from './components/ProjectDetailsModal';
import { getStatusBadge } from './utils/ProjectStatusBadge';
import ProjectFilters from './components/ProjectFilters';

const ProjectList = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const location = useLocation();
    const successMessage = location.state?.successMessage;

    const [projects, setProjects] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
    const [message, setMessage] = useState(successMessage || '');
    const [feedbackHistory, setFeedbackHistory] = useState<any[]>([]);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const getPageTitle = () => {
        if (user?.role === 1) return 'My Submitted Projects';
        if (user?.role === 2) return 'Projects Submitted to Me';
        if (user?.role === 3) return 'All Projects';
        return 'Projects';
    };

    const fetchProjects = async (page = 1, searchValue = search, statusValue = statusFilter) => {
        try {
            setLoading(true);

            const response = await AxiosInstance.get(
                `${API_CONFIG.PROJECTS.LIST}?page=${page}&search=${searchValue}&status=${statusValue}`
            );

            setProjects(response.data.data.data || []);
            setCurrentPage(response.data.data.current_page);
            setLastPage(response.data.data.last_page);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (successMessage) {
            navigate(location.pathname, { replace: true });
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (projectId: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this project?');

        if (!confirmed) return;

        try {
            setDeletingProjectId(projectId);

            await AxiosInstance.delete(API_CONFIG.PROJECTS.DELETE(projectId));

            setMessage('Project deleted successfully.');
            fetchProjects();
        } catch (error: any) {
            alert(error?.response?.data?.message || 'Failed to delete project.');
        } finally {
            setDeletingProjectId(null);
        }
    };

    const handleStartReview = async (projectId: number) => {
        const confirmed = window.confirm(
            'Are you sure you want to start reviewing this project?'
        );

        if (!confirmed) return;

        try {
            await AxiosInstance.put(
                API_CONFIG.PROJECTS.UPDATE_STATUS(projectId),
                {
                    status: 1,
                }
            );

            setMessage('Project review started successfully.');
            fetchProjects();
        } catch (error: any) {
            alert(
                error?.response?.data?.message ||
                'Failed to start review.'
            );
        }
    };

    const fetchFeedbackHistory = async (projectId: number) => {
        try {
            setFeedbackLoading(true);

            const response = await AxiosInstance.get(
                API_CONFIG.FEEDBACK.LIST(projectId)
            );

            setFeedbackHistory(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch feedback history:', error);
        } finally {
            setFeedbackLoading(false);
        }
    };

    const handleClearFilter = () => {
        setSearch('');
        setStatusFilter('');
        fetchProjects(1, '', '');
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
            {message && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {message}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMessage('')}
                    />
                </div>
            )}
            <div className="card border-0 shadow-sm rounded-4">
                <ProjectFilters
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    onFilter={() => fetchProjects(1)}
                    onClear={handleClearFilter}
                />
                <div className="card-body">
                    {loading ? (
                        <p className="text-muted mb-0">Loading projects...</p>
                    ) : projects.length === 0 ? (
                        <p className="text-muted mb-0">No projects found.</p>
                    ) : (
                        <div className="table-responsive table-bordered table-hover">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>Project Title</th>
                                        <th>Submitted To</th>
                                        {user?.role === 3 && <th>Submitted By</th>}
                                        <th>Current Status</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {projects.map((project) => (
                                        <tr key={project.id}>
                                            <td className="fw-semibold">
                                                {project.title}
                                            </td>

                                            <td>
                                                {project.teacher?.name || 'Not Assigned'}
                                            </td>

                                            {user?.role === 3 && (
                                                <td>
                                                    {project.student?.name || 'Unknown'}
                                                </td>
                                            )}

                                            <td>
                                                {getStatusBadge(project.status)}
                                            </td>

                                            <td className="text-center">
                                                {(user?.role === 2 || user?.role === 3) && project.status === 0 ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-warning"
                                                        onClick={() => handleStartReview(project.id)}
                                                    >
                                                        Start Review
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() => {
                                                            setSelectedProject(project);
                                                            fetchFeedbackHistory(project.id);
                                                        }}
                                                    >
                                                        Details
                                                    </button>
                                                )}

                                                {user?.role === 1 && project.status === 2 && (
                                                    <Link
                                                        to={`/projects/${project.id}/edit`}
                                                        className="btn btn-sm btn-outline-warning me-2"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}

                                                {user?.role === 1 && project.status === 0 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(project.id)}
                                                        disabled={deletingProjectId === project.id}
                                                    >
                                                        {deletingProjectId === project.id ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className="container my-2">
                    {lastPage > 1 && (
                        <div className="d-flex justify-content-end mt-3">
                            <button
                                className="btn btn-sm btn-outline-primary me-2"
                                disabled={currentPage === 1}
                                onClick={() => fetchProjects(currentPage - 1)}
                            >
                                Previous
                            </button>

                            <span className="align-self-center">
                                Page {currentPage} of {lastPage}
                            </span>

                            <button
                                className="btn btn-sm btn-outline-primary ms-2"
                                disabled={currentPage === lastPage}
                                onClick={() => fetchProjects(currentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {selectedProject && (
                <ProjectDetailsModal
                    selectedProject={selectedProject}
                    setSelectedProject={setSelectedProject}
                    feedbackHistory={feedbackHistory}
                    feedbackLoading={feedbackLoading}
                    getStatusBadge={getStatusBadge}
                    fetchProjects={fetchProjects}
                    setMessage={setMessage}
                    user={user}
                />
            )}
        </div>
    );
};

export default ProjectList;