import api from './axios';

export const fetchApplications = async (params = {}) => {
  const response = await api.get('/api/applications', { params });
  return response.data;
};

export const fetchApplicationById = async (id) => {
  const response = await api.get(`/api/applications/${id}`);
  return response.data;
};

export const submitApplication = async (applicationData) => {
  const response = await api.post('/api/applications', applicationData);
  return response.data;
};

export const updateApplicationStatus = async (id, statusData) => {
  const response = await api.put(`/api/applications/${id}/status`, statusData);
  return response.data;
};
