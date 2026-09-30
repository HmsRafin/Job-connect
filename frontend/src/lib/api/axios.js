import axios from 'axios';

const api = axios.create({
    baseURL: '/',
    timeout: 20000,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

api.interceptors.response.use(response => response, error => {
    const validation = error.response?.data?.errors;
    const message = validation
        ? Object.values(validation).flat().join(' ')
        : error.response?.data?.message || 'Cannot reach the server. Please try again.';
    window.dispatchEvent(new CustomEvent('jobconnect:api-error', { detail: message }));
    if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        window.dispatchEvent(new Event('jobconnect:unauthorized'));
    }
    return Promise.reject(error);
});

// Interceptor to automatically add the bearer token if it exists in localStorage
api.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
