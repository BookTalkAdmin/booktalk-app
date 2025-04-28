import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5001';

console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  validateStatus: status => status >= 200 && status < 300
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('API Request:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      stack: error.stack
    });

    // Network error or CORS issue
    if (!error.response || error.code === 'ECONNABORTED') {
      console.error('Network Error Details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // Check if it's a CORS issue
      if (error.message.includes('Network Error')) {
        return Promise.reject({
          message: 'Unable to connect to the server. Please make sure the backend server is running.',
          originalError: error
        });
      }
      
      // Check if it's a timeout
      if (error.code === 'ECONNABORTED') {
        return Promise.reject({
          message: 'Request timed out. Please check your connection and try again.',
          originalError: error
        });
      }

      return Promise.reject({
        message: 'Network error. Please check your connection and try again.',
        originalError: error
      });
    }

    // Server error
    if (error.response.status >= 500) {
      return Promise.reject({
        message: 'Server error. Please try again later.',
        originalError: error
      });
    }

    // Authentication error
    if (error.response.status === 401) {
      localStorage.removeItem('token'); // Clear invalid token
      return Promise.reject({
        message: 'Session expired. Please log in again.',
        originalError: error
      });
    }

    // Client error
    return Promise.reject({
      message: error.response.data.message || 'An error occurred. Please try again.',
      originalError: error
    });
  }
);

export const auth = {
  async login(email, password) {
    try {
      console.log('API Service: Attempting login...');
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      console.log('API Service: Login successful');
      return response.data;
    } catch (error) {
      console.error('API Service: Login failed:', error);
      throw error;
    }
  },

  async register(username, email, password) {
    try {
      console.log('API Service: Attempting registration...');
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      console.log('API Service: Registration successful');
      return response.data;
    } catch (error) {
      console.error('API Service: Registration failed:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      console.log('API Service: Fetching current user...');
      const response = await api.get('/auth/me');
      console.log('API Service: Current user fetched successfully');
      return response.data;
    } catch (error) {
      console.error('API Service: Failed to fetch current user:', error);
      throw error;
    }
  },
};

export default api;
