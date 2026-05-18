import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AxiosInstance } from '../../config/api/axios';
import { API_CONFIG } from '../../config/api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { reviewInitialValues, reviewValidationSchema } from './formik';

const ProjectList = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const location = useLocation();
    const successMessage = location.state?.successMessage;

    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
    const [message, setMessage] = useState(successMessage || '');
    const [feedbackHistory, setFeedbackHistory] = useState<any[]>([]);
    const [feedbackLoading, setFeedbackLoading] = useState(false);

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
        if (successMessage) {
            navigate(location.pathname, { replace: true });
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, []);

    const getStatusBadge = (status: number) => {
        const statuses: Record<number, { label: string; className: string }> = {
            0: {
                label: 'Pending',
                className: 'bg-secondary',
            },
            1: {
                label: 'Under Review',
                className: 'bg-primary',
            },
            2: {
                label: 'Need Changes',
                className: 'bg-warning text-dark',
            },
            3: {
                label: 'Approved',
                className: 'bg-success',
            },
            4: {
                label: 'Rejected',
                className: 'bg-danger',
            },
        };

        const currentStatus = statuses[status] || {
            label: 'Unknown',
            className: 'bg-dark',
        };

        return (
            <span className={`badge ${currentStatus.className}`}>
                {currentStatus.label}
            </span>
        );
    };

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
            </div>
            {selectedProject && (
                <div
                    className="modal show d-block"
                    tabIndex={-1}
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Project Details
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setSelectedProject(null)}
                                />
                            </div>

                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-4">
                                        <strong>Project Title</strong>
                                    </div>
                                    <div className="col-8">
                                        <b>:</b> {selectedProject.title}
                                    </div>
                                </div>
                                {(user?.role === 1 || user?.role === 3) && (
                                    <div className="row mt-2">
                                        <div className="col-4">
                                            <strong>Submitted To</strong>
                                        </div>
                                        <div className="col-8">
                                            <b>:</b> {selectedProject.teacher?.name || 'Not Assigned'}
                                        </div>
                                    </div>
                                )}
                                {(user?.role === 2 || user?.role === 3) && (
                                    <div className="row mt-2">
                                        <div className="col-4">
                                            <strong>Submitted By</strong>
                                        </div>
                                        <div className="col-8">
                                            <b>:</b> {selectedProject.student?.name || 'Unknown'}
                                        </div>
                                    </div>
                                )}
                                <div className="row mt-2">
                                    <div className="col-4">
                                        <strong>Status</strong>
                                    </div>
                                    <div className="col-8">
                                        <b>:</b> {getStatusBadge(selectedProject.status)}
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-4">
                                        <strong>Submitted At</strong>
                                    </div>
                                    <div className="col-8">
                                        <b>:</b>{' '}
                                        {
                                            new Date(selectedProject.created_at).toLocaleString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                            })
                                        }
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-4">
                                        <strong>Project Description</strong>
                                    </div>
                                    <div className="col-8">
                                        <b>:</b>
                                    </div>
                                </div>

                                <div className="row mt-2 border rounded mx-1 p-3" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: selectedProject.description,
                                        }}
                                    />
                                </div>

                                <div className="row mt-2">
                                    <div className="col-4">
                                        <strong>Repository Links</strong>
                                    </div>
                                    <div className="col-8">
                                        <b>:</b>
                                    </div>
                                </div>
                                

                                <div>
                                    <ul className="mt-2">
                                        {(selectedProject.repository_link || []).map(
                                            (link: string, index: number) => (
                                                <li key={index}>
                                                    <a
                                                        href={link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {link}
                                                    </a>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>

                                {selectedProject.demo_link && (
                                    <div className="row mt-2">
                                        <div className="col-4">
                                            <strong>Demo Link</strong>
                                        </div>
                                        <div className="col-8">
                                            <b>:</b>{' '}
                                            <a
                                                href={selectedProject.demo_link}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {selectedProject.demo_link}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {selectedProject.file_path && (
                                    <div className="row mt-2">
                                        <div className="col-4">
                                            <strong>Attached File:</strong>
                                        </div>
                                        <div className="col-8">
                                            <b>:</b>{' '}
                                             <a
                                                href={`${API_CONFIG.storageUrl}/${selectedProject.file_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                View / Download
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {selectedProject?.status !== 0 ? (
                                    <>
                                        <h5 className="fw-bold mt-4 mb-3">Feedback History</h5>
                                        {feedbackLoading ? (
                                            <p className="text-muted">Loading feedback...</p>
                                        ) : feedbackHistory.length === 0 ? (
                                            <p className="text-muted">No feedback found.</p>
                                        ) : (
                                            <div className="list-group">
                                                {feedbackHistory.map((feedback) => (
                                                    <div
                                                        key={feedback.id}
                                                        className="list-group-item border rounded mb-2"
                                                    >
                                                        <div className="d-flex justify-content-between">
                                                            <strong>{feedback.user?.name || 'Unknown User'}</strong>
                                                            <div>
                                                                {getStatusBadge(feedback.status)}
                                                            </div>

                                                            <small className="text-muted">
                                                                {new Date(feedback.created_at).toLocaleString('en-US', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    hour12: true,
                                                                    day: '2-digit',
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                })}
                                                            </small>
                                                        </div>

                                                        <p className="mb-0 mt-2">
                                                            <b>Remarks : </b>{feedback.message}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : null}

                                {(user?.role === 2 || user?.role === 3) && (selectedProject?.status === 1 || selectedProject?.status === 2) && (
                                    <div className="mt-4 border rounded p-3 bg-light">
                                        <h5 className="fw-bold mb-3">Submit Review</h5>

                                        <Formik
                                            initialValues={reviewInitialValues}
                                            validationSchema={reviewValidationSchema}
                                            onSubmit={async (values, { setSubmitting, resetForm }) => {
                                                try {
                                                    await AxiosInstance.post(
                                                        API_CONFIG.FEEDBACK.STORE(selectedProject.id),
                                                        {
                                                            message: values.message || 'No remarks provided.',
                                                            status: Number(values.status),
                                                        }
                                                    );

                                                    await AxiosInstance.put(
                                                        API_CONFIG.PROJECTS.UPDATE_STATUS(selectedProject.id),
                                                        { status: Number(values.status) }
                                                    );

                                                    setMessage('Review submitted successfully.');
                                                    resetForm();
                                                    setSelectedProject(null);
                                                    fetchProjects();
                                                } catch (error: any) {
                                                    alert(error?.response?.data?.message || 'Failed to submit review.');
                                                } finally {
                                                    setSubmitting(false);
                                                }
                                            }}
                                        >
                                            {({ isSubmitting }) => (
                                                <Form>
                                                    <div className="mb-3">
                                                        <label className="form-label">Update Status</label>

                                                        <Field as="select" name="status" className="form-select">
                                                            <option value="">Select status</option>
                                                            <option value="2">Changes Requested</option>
                                                            <option value="3">Approved</option>
                                                            <option value="4">Rejected</option>
                                                        </Field>

                                                        <div className="text-danger small mt-1">
                                                            <ErrorMessage name="status" />
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            Remarks
                                                        </label>

                                                        <Field
                                                            as="textarea"
                                                            name="message"
                                                            rows={4}
                                                            className="form-control"
                                                            placeholder="Write remarks for the student"
                                                        />

                                                        <div className="text-danger small mt-1">
                                                            <ErrorMessage name="message" />
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                                    </button>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedProject(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectList;