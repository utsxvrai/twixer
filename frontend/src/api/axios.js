import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;