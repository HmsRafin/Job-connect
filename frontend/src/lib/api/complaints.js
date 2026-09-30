import api from './axios';

// Public/Auth submit contact inquiry or complaint
export const submitContactInquiry = async (data) => {
  const response = await api.post('/api/contact/submit', data);
  return response.data;
};

// Fetch complaints (Admin gets all, Users get theirs)
export const fetchComplaints = async (params = {}) => {
  const response = await api.get('/api/complaints', { params });
  return response.data;
};

// Fetch single complaint details
export const fetchComplaintById = async (id) => {
  const response = await api.get(`/api/complaints/${id}`);
  return response.data;
};

// Admin reply / feedback
export const replyToComplaint = async (id, replyData) => {
  const response = await api.post(`/api/complaints/${id}/reply`, replyData);
  return response.data;
};

// Admin update status
export const updateComplaintStatus = async (id, statusData) => {
  const response = await api.put(`/api/complaints/${id}/status`, statusData);
  return response.data;
};
