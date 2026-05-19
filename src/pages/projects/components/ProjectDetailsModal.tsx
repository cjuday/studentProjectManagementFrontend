import { Formik, Form, Field, ErrorMessage } from 'formik';
import DOMPurify from 'dompurify';
import { AxiosInstance } from '../../../config/api/axios';
import { API_CONFIG } from '../../../config/api';
import { reviewInitialValues, reviewValidationSchema } from '../formik';

type Props = {
    selectedProject: any;
    setSelectedProject: React.Dispatch<React.SetStateAction<any>>;
    feedbackHistory: any[];
    feedbackLoading: boolean;
    getStatusBadge: (status: number) => React.ReactNode;
    fetchProjects: () => Promise<void>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    user: any;
};

const ProjectDetailsModal = ({
    selectedProject,
    setSelectedProject,
    feedbackHistory,
    feedbackLoading,
    getStatusBadge,
    fetchProjects,
    setMessage,
    user,
}: Props) => {
    if(!selectedProject) {
        return null;
    }

    return(
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
                                className="overflow-auto"
                                style={{
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-word',
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(selectedProject.description),
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
    );
}

export default ProjectDetailsModal;