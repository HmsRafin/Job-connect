import api from './axios';

export const fetchJobs = async (params = {}) => {
  const response = await api.get('/api/jobs', { params });
  return response.data;
};

export const fetchJobById = async (id) => {
  const response = await api.get(`/api/jobs/${id}`);
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await api.post('/api/jobs', jobData);
  return response.data;
};

export const updateJob = async (id, jobData) => {
  const response = await api.put(`/api/jobs/${id}`, jobData);
  return response.data;
};

export const boostJob = async (id, boostData) => {
  const response = await api.post(`/api/jobs/${id}/boost`, boostData);
  return response.data;
};

export const cancelBoostJob = async (id) => {
  const response = await api.post(`/api/jobs/${id}/cancel-boost`);
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await api.delete(`/api/jobs/${id}`);
  return response.data;
};
