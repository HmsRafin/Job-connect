import api from './axios';

export const login = async (credentials) => {
    const response = await api.post('/api/login', credentials);
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/api/register', userData);
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/api/logout');
    return response.data;
};

export const fetchCurrentUser = async () => {
    const response = await api.get('/api/me');
    return response.data;
};

export const updateCredentials = async (credentialsData) => {
    const response = await api.put('/api/update-credentials', credentialsData);
    return response.data;
};
