import api from './axios';

export const getUsers = async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
};

export const getUser = async (id) => {
    const response = await api.get(`/api/admin/users/${id}`);
    return response.data;
};

export const createUser = async (userData) => {
    const response = await api.post('/api/admin/users', userData);
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await api.put(`/api/admin/users/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
};
