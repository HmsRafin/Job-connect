import api from './axios';

export const fetchBoostPricing = async () => {
  const response = await api.get('/api/settings/boost-pricing');
  return response.data;
};

export const updateBoostPricingApi = async (pricingData) => {
  const response = await api.post('/api/settings/boost-pricing', pricingData);
  return response.data;
};
