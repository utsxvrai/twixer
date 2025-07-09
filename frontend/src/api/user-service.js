import axiosInstance from './axios';

const USER_API_URL = '/user';

const register = (userData) => {
  return axiosInstance.post(`${USER_API_URL}/register`, userData);
};

const login = (email, password) => {
  return axiosInstance.post(`${USER_API_URL}/login`, { email, password });
};

const getUser = (userId) => {
  return axiosInstance.get(`${USER_API_URL}/user/${userId}`);
};

const getAllUsers = () => {
  return axiosInstance.get(`${USER_API_URL}/users`);
};

const followUser = (userId) => {
  return axiosInstance.post(`${USER_API_URL}/follow/${userId}`);
};

const unfollowUser = (userId) => {
  return axiosInstance.post(`${USER_API_URL}/unfollow/${userId}`);
};

const getMe = () => {
  return axiosInstance.get(`${USER_API_URL}/me`);
};

const UserService = {
  register,
  login,
  getUser,
  getAllUsers,
  followUser,
  unfollowUser,
  getMe,
};

export default UserService;