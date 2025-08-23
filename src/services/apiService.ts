import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
};

export const biService = {
  uploadCSV: async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    
    const response = await api.post('/api/bi/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAnalysis: async (mode: string, data: any) => {
    const response = await api.post(`/api/bi/analysis/${mode}`, { data });
    return response.data;
  },

  getAIInsights: async (data: any, mode: string) => {
    const response = await api.post('/api/bi/ai-insights', { data, mode });
    return response.data;
  },
};

export const userService = {
  getCorretores: async () => {
    const response = await api.get('/api/users/corretores');
    return response.data;
  },
};

export default api;
