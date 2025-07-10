import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { NotificationProvider } from './context/NotificationContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import TweetPage from './pages/TweetPage';
import NotificationPage from './pages/NotificationPage';
import MainLayout from './components/MainLayout';
import MobileBottomNav from './components/MobileBottomNav';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner component
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DarkModeProvider>
          <NotificationProvider>
            <MainLayout>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <HomePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile/:userId"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
                <Route path="/explore" element={<PrivateRoute><div className="p-4 text-gray-900 dark:text-white">Explore Page</div></PrivateRoute>} />
                <Route path="/notifications" element={<PrivateRoute><NotificationPage /></PrivateRoute>} />
                <Route path="/messages" element={<PrivateRoute><div className="p-4 text-gray-900 dark:text-white">Messages Page</div></PrivateRoute>} />
                <Route path="/bookmarks" element={<PrivateRoute><div className="p-4 text-gray-900 dark:text-white">Bookmarks Page</div></PrivateRoute>} />
                <Route path="/more" element={<PrivateRoute><div className="p-4 text-gray-900 dark:text-white">More Page</div></PrivateRoute>} />
                <Route
                  path="/tweet/:tweetId"
                  element={
                    <PrivateRoute>
                      <TweetPage />
                    </PrivateRoute>
                  }
                />
              </Routes>
              <MobileBottomNav />
            </MainLayout>
          </NotificationProvider>
        </DarkModeProvider>
      </AuthProvider>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </Router>
  );
}

export default App;
