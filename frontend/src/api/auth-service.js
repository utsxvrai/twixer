import axiosInstance from './axios';

const login = (email, password) => {
  return axiosInstance.post('/user/login', { email, password });
};

const register = (userData) => {
  return axiosInstance.post('/user/register', userData);
};

const AuthService = {
  login,
  register,
};

export default AuthService;