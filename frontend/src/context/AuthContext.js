import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../api/auth-service';
import UserService from '../api/user-service'; // Make sure this has getMe()

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    console.log('Token in useEffect (AuthContext):', token);
    if (token) {
      UserService.getMe()
        .then(res => setUser(res.data.user))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem('jwt_token', response.data.data.token);
      setUser(response.data.user); // Assuming backend returns user data on login
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await AuthService.register(email, password, name);
      // Optionally log in the user after successful registration
      // localStorage.setItem('jwt_token', response.data.token);
      // setUser(response.data.user);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);