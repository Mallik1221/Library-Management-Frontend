import api from './api';

const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        safeLocalStorage.setItem('token', response.data.token);
        const { token, ...userData } = response.data;
        safeLocalStorage.setItem('user', JSON.stringify(userData));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        safeLocalStorage.setItem('token', response.data.token);
        const { token, ...userData } = response.data;
        safeLocalStorage.setItem('user', JSON.stringify(userData));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during registration' };
    }
  },

  logout() {
    safeLocalStorage.removeItem('token');
    safeLocalStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = safeLocalStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  isAuthenticated() {
    return !!safeLocalStorage.getItem('token');
  },

  // Get all users (Admin only)
  async getAllUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  // Update user (Admin only)
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  // Delete user (Admin only)
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },
}; 