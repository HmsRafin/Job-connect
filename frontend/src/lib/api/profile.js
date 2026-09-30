import api from './axios';

export const fetchProfile = async () => {
  const response = await api.get('/api/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.post('/api/profile', profileData);
  return response.data;
};

export const uploadResumeApi = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const response = await api.post('/api/profile/upload-resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadImageApi = async (file, type = 'company') => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', type);
  const response = await api.post('/api/profile/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};


