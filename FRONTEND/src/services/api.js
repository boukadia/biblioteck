import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.error('❌ API Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      fullError: error
    });
    
    // Commented out for debugging - we'll uncomment once we fix the 401 issue
    // if (error.response && error.response.status === 401) {
    //   localStorage.clear();
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

export default api;