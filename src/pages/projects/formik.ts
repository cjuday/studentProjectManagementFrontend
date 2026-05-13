import * as Yup from 'yup';

export const projectInitialValues = {
    title: '',
    description: '',
    repository_link: '',
    demo_link: '',
    file_path: null as File | null,
    teacher_id: '',
};

export const projectValidationSchema = Yup.object({
    title: Yup.string().required('Project title is required'),
    description: Yup.string().required('Project description is required'),
    repository_link: Yup.string().required('Repository link is required'),
    demo_link: Yup.string().nullable(),
    file_path: Yup.mixed().nullable(),
    teacher_id: Yup.string().nullable(),
});