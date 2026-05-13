export const API_CONFIG = {
    baseURL: 'http://localhost:8000/api',

    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        ME: '/auth/me',
        LOGOUT: '/auth/logout',
    },

    PROJECTS: {
        LIST: "/projects",
        CREATE: "/projects",
        DETAILS: (id: number | string) => `/projects/${id}`,
        UPDATE: (id: number | string) => `/projects/${id}`,
        DELETE: (id: number | string) => `/projects/${id}`,
        UPDATE_STATUS: (id: number | string) => `/projects/${id}/status`,
    },
};