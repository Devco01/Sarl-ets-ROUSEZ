import axios from 'axios';

// Configuration de base de l'API - Vercel Functions
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Types pour les API calls
export interface ContactFormData {
  nom: string;
  email: string;
  telephone?: string;
  sujet?: string;
  message: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  createdAt: string;
}

export interface AdminStats {
  totalProjects: number;
  activeProjects: number;
  totalClients: number;
  monthlyRevenue: number;
  recentActivity: Array<{
    id: number;
    type: string;
    message: string;
    timestamp: string;
  }>;
}

// Services API

// Contact
export const contactService = {
  sendMessage: async (data: ContactFormData) => {
    const response = await api.post('/contact', data);
    return response.data;
  },
  
  testEmailConfig: async () => {
    const response = await api.get('/contact/test');
    return response.data;
  },
};

// Galerie
export const galleryService = {
  getAll: async (category?: string, limit?: number) => {
    const params: any = {};
    if (category) params.category = category;
    if (limit) params.limit = limit;
    
    const response = await api.get('/gallery', { params });
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/gallery/${id}`);
    return response.data;
  },
  
  upload: async (file: File, title: string, description: string, category: string) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    
    const response = await api.post('/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  },
  
  getCategories: async () => {
    const response = await api.get('/gallery/meta/categories');
    return response.data;
  },
};

// Administration
export const adminService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/admin/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },
  
  logout: async () => {
    try {
      await api.post('/admin/logout');
    } finally {
      localStorage.removeItem('authToken');
    }
  },
  
  getProfile: async () => {
    const response = await api.get('/admin/profile');
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/admin/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// Health check
export const healthService = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
