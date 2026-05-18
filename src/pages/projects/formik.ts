import * as Yup from 'yup';

export const projectInitialValues = {
    title: '',
    description: '',
    repository_links: [''],
    demo_link: '',
    file_path: null as File | null,
    teacher_id: '',
};

const stripHtml = (value: string) => {
    return value.replace(/<(.|\n)*?>/g, '').replace(/&nbsp;/g, '').trim();
};

export const projectValidationSchema = Yup.object({
    title: Yup.string().required('Project title is required'),
    description: Yup.string()
                    .test(
                        'description-required',
                        'Project description is required',
                        (value) => !!value && stripHtml(value).length > 0
                    ),
    repository_links: Yup.array()
                        .of(Yup.string().required('Repository link is required'))
                        .min(1, 'At least one repository link is required'),
    demo_link: Yup.string().nullable(),
    file_path: Yup.mixed()
                    .nullable()
                    .test(
                        'fileType',
                        'Only PDF, DOC, or DOCX files are allowed',
                        (value: any) => {
                            if (!value) return true;

                            const allowedTypes = [
                                'application/pdf',
                                'application/msword',
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            ];

                            return allowedTypes.includes(value.type);
                        }
                    )
                    .test(
                        'fileSize',
                        'File size must be less than 10MB',
                        (value: any) => {
                            if (!value) return true;

                            return value.size <= 10 * 1024 * 1024;
                        }
                    ),
    teacher_id: Yup.string().required('Teacher is required'),
});

export const reviewInitialValues = {
    status: '',
    message: '',
};

export const reviewValidationSchema = Yup.object({
    status: Yup.string().required('Status is required'),

    message: Yup.string().when('status', {
        is: (status: string) => status !== '3',
        then: (schema) => schema.required('Remarks is required'),
        otherwise: (schema) => schema.nullable(),
    }),
});