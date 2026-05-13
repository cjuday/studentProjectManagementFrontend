import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { AxiosInstance } from '../../config/api/axios';
import { API_CONFIG } from '../../config/api';
import { projectInitialValues, projectValidationSchema } from './formik';

const ProjectCreate = () => {
    const navigate = useNavigate();

    const handleSubmit = async (
        values: typeof projectInitialValues,
        { setSubmitting, setStatus }: any
    ) => {
        try {
            setStatus('');

            const formData = new FormData();

            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('repository_link', values.repository_link);

            if (values.demo_link) {
                formData.append('demo_link', values.demo_link);
            }

            if (values.teacher_id) {
                formData.append('teacher_id', values.teacher_id);
            }

            if (values.file_path) {
                formData.append('file_path', values.file_path);
            }

            await AxiosInstance.post(API_CONFIG.PROJECTS.CREATE, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate('/projects');
        } catch (error: any) {
            setStatus(
                error?.response?.data?.message ||
                    'Failed to submit project. Please try again.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="mb-4">
                <h3 className="fw-bold mb-1">Submit Project</h3>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                    <Formik
                        initialValues={projectInitialValues}
                        validationSchema={projectValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, status, setFieldValue }) => (
                            <Form>
                                {status && (
                                    <div className="alert alert-danger">
                                        {status}
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label">
                                        Project Title <span className="text-danger">*</span>
                                    </label>

                                    <Field
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        placeholder="Enter project title"
                                    />

                                    <div className="text-danger small mt-1">
                                        <ErrorMessage name="title" />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Description <span className="text-danger">*</span>
                                    </label>

                                    <Field
                                        as="textarea"
                                        name="description"
                                        rows={6}
                                        className="form-control"
                                        placeholder="Write project description. HTML is allowed if needed."
                                    />

                                    <div className="text-danger small mt-1">
                                        <ErrorMessage name="description" />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Repository Link <span className="text-danger">*</span>
                                    </label>

                                    <Field
                                        type="text"
                                        name="repository_link"
                                        className="form-control"
                                        placeholder="https://github.com/username/project"
                                    />

                                    <div className="text-danger small mt-1">
                                        <ErrorMessage name="repository_link" />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Demo Link
                                    </label>

                                    <Field
                                        type="text"
                                        name="demo_link"
                                        className="form-control"
                                        placeholder="https://demo-link.com"
                                    />

                                    <div className="text-danger small mt-1">
                                        <ErrorMessage name="demo_link" />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Project File
                                    </label>

                                    <input
                                        type="file"
                                        name="file_path"
                                        className="form-control"
                                        onChange={(event) => {
                                            const file =
                                                event.currentTarget.files?.[0] ||
                                                null;

                                            setFieldValue('file_path', file);
                                        }}
                                    />

                                    <div className="form-text">
                                        Optional: upload PDF, DOC, DOCX, or ZIP file.
                                    </div>

                                    <div className="text-danger small mt-1">
                                        <ErrorMessage name="file_path" />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">
                                        Teacher ID
                                    </label>

                                    <Field
                                        type="number"
                                        name="teacher_id"
                                        className="form-control"
                                        placeholder="Enter teacher ID if assigned"
                                    />

                                    <div className="form-text">
                                        Optional. Leave empty if no teacher is assigned yet.
                                    </div>

                                    <div className="text-danger small mt-1">
                                        <ErrorMessage name="teacher_id" />
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? 'Submitting...'
                                            : 'Submit Project'}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate('/projects')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default ProjectCreate;