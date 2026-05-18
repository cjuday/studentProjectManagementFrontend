import { useEffect, useState } from 'react';
import Select from 'react-select';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosInstance } from '../../config/api/axios';
import { API_CONFIG } from '../../config/api';
import { projectInitialValues, projectValidationSchema } from './formik';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'

const ProjectEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [initialValues, setInitialValues] = useState(projectInitialValues);
    const [pageLoading, setPageLoading] = useState(true);
    const [teachers, setTeachers] = useState<any[]>([]);

    const fetchProject = async () => {
        try {
            setPageLoading(true);

            const response = await AxiosInstance.get(
                API_CONFIG.PROJECTS.DETAILS(id!)
            );

            const project = response.data.data;

            setInitialValues({
                title: project.title || '',
                description: project.description || '',
                repository_links: project.repository_link?.length
                    ? project.repository_link
                    : [''],
                demo_link: project.demo_link || '',
                file_path: null,
                teacher_id: project.teacher_id ? String(project.teacher_id) : '',
                existing_file_path: project.file_path || '',
            });
        } catch (error) {
            console.error('Failed to fetch project:', error);
        } finally {
            setPageLoading(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await AxiosInstance.get(
                API_CONFIG.USERS.TEACHERS
            );

            const formattedTeachers = response.data.data.map(
                (teacher: any) => ({
                    value: teacher.id,
                    label: `${teacher.name} (${teacher.email})`,
                })
            );

            setTeachers(formattedTeachers);
        } catch (error) {
            console.error('Failed to fetch teachers:', error);
        }
    };

    useEffect(() => {
        fetchTeachers();
        fetchProject();
    }, []);

    const handleSubmit = async (
        values: typeof projectInitialValues,
        { setSubmitting, setStatus }: any
    ) => {
        try {
            setStatus('');

            const formData = new FormData();

            formData.append('title', values.title);
            formData.append('description', values.description);
            values.repository_links.forEach((link) => {
                formData.append('repository_link[]', link);
            });

            if (values.demo_link) {
                formData.append('demo_link', values.demo_link);
            }

            if (values.teacher_id) {
                formData.append('teacher_id', values.teacher_id);
            }

            if (values.file_path) {
                formData.append('file_path', values.file_path);
            }

            await AxiosInstance.post(
                `${API_CONFIG.PROJECTS.UPDATE(id!)}?_method=PUT`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            navigate('/projects', {
                state: {
                    successMessage: 'Project submitted successfully.',
                },
            });
        } catch (error: any) {
            setStatus(
                error?.response?.data?.message ||
                    'Failed to submit project. Please try again.'
            );

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status" />

                <p className="text-muted mb-0">
                    Loading project information...
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <h3 className="fw-bold mb-1">Submit Project</h3>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={projectValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, status, setFieldValue, values, errors, submitCount }) => (
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

                                    <ReactQuill
                                        theme="snow"
                                        value={values.description}
                                        onChange={(value) => setFieldValue('description', value)}
                                        placeholder="Write project description"
                                        style={{ height: '250px', marginBottom: '50px' }}
                                    />

                                    <div className="text-danger small mt-1">
                                        <ErrorMessage name="description" />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Repository Link <span className="text-danger">*</span>
                                    </label>

                                    <FieldArray name="repository_links">
                                    {({ push, remove }) => (
                                        <>
                                            {values.repository_links.map(
                                                (_: string, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="d-flex gap-2 mb-2"
                                                    >
                                                        <Field
                                                            type="text"
                                                            name={`repository_links.${index}`}
                                                            className="form-control"
                                                            placeholder={`https://github.com/username/repo${index + 1}`}
                                                        />

                                                        {values.repository_links.length > 1 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger"
                                                                onClick={() => remove(index)}
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            )}

                                            <button
                                                type="button"
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => push('')}
                                            >
                                                Add Repository
                                            </button>
                                        </>
                                    )}
                                </FieldArray>
                                {submitCount > 0 && errors.repository_links && (
                                    <div className="text-danger small mt-1">
                                        {Array.isArray(errors.repository_links)
                                            ? 'At least one repository link is required'
                                            : errors.repository_links}
                                    </div>
                                )}
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
                                        Accepted Formats: PDF, DOC or DOCX files. Max size: 10MB.
                                    </div>

                                    {values.existing_file_path && (
                                        <div className="mt-2">
                                            <a
                                                href={`${API_CONFIG.storageUrl}/${values.existing_file_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                View Existing File
                                            </a>
                                        </div>
                                    )}

                                    <div className="text-danger small mt-1">
                                        <ErrorMessage name="file_path" />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">
                                        Assign Teacher <span className="text-danger">*</span>
                                    </label>

                                    <Select
                                        options={teachers}
                                        placeholder="Search teacher..."
                                        isClearable
                                        value={
                                            teachers.find(
                                                (teacher) => String(teacher.value) === String(values.teacher_id)
                                            ) || null
                                        }
                                        onChange={(selectedOption) => {
                                            setFieldValue(
                                                'teacher_id',
                                                selectedOption ? selectedOption.value : ''
                                            );
                                        }}
                                        isDisabled
                                    />

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

export default ProjectEdit;