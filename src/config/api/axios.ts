import axios from 'axios';
import { API_CONFIG } from './index';

export const AxiosInstance = axios.create({
    baseURL: API_CONFIG.baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

AxiosInstance.interceptors.request.use((config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}), (error) => {    
    return Promise.reject(error);
});