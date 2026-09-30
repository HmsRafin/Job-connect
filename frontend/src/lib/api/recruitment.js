import api from './axios';

// Tasks
export const fetchTasks = async () => {
  const response = await api.get('/api/tasks');
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/api/tasks', taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await api.put(`/api/tasks/${id}`, taskData);
  return response.data;
};

// Interviews
export const fetchInterviews = async () => {
  const response = await api.get('/api/interviews');
  return response.data;
};

export const createInterview = async (interviewData) => {
  const response = await api.post('/api/interviews', interviewData);
  return response.data;
};

export const updateInterview = async (id, interviewData) => {
  const response = await api.put(`/api/interviews/${id}`, interviewData);
  return response.data;
};

// Advertisements
export const fetchAdvertisements = async () => {
  const response = await api.get('/api/advertisements');
  return response.data;
};

export const createAdvertisement = async (adData) => {
  const response = await api.post('/api/advertisements', adData);
  return response.data;
};

// Payments
export const fetchPayments = async () => {
  const response = await api.get('/api/payments');
  return response.data;
};
