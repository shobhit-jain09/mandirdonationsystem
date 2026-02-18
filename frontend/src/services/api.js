import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getUsers: () => api.get('/auth/users'),
  createUser: (userData) => api.post('/auth/users', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

export const donationAPI = {
  createDonation: (donationData) => api.post('/donations', donationData),
  getDonations: (params) => api.get('/donations', { params }),
  getDonationById: (id) => api.get(`/donations/${id}`),
  downloadReceipt: (id) => api.get(`/donations/${id}/receipt`, { responseType: 'blob' }),
  getDashboardStats: (period) => api.get('/donations/stats', { params: { period } }),
};

// Added Mandir API
export const mandirAPI = {
  getList: () => api.get('/mandirs/list'),
  register: (data) => api.post('/mandirs/register', data),
};

export default api;
