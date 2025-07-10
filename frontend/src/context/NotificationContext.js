import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    if (user?._id && !socketRef.current) {
      // Connect to backend socket server
      socketRef.current = io('http://localhost:4000');
      setSocket(socketRef.current);

      // Register user on backend
      socketRef.current.emit('register', user._id);
      console.log(`🔗 Socket connected, registering user: ${user._id}`);

      // Handle notification
      socketRef.current.on('follow_notification', (data) => {
        toast.info(`${data.followerName} (@${data.followerUsername}) followed you!`);
        setHasNewNotification(true);
      });
      socketRef.current.on('like_notification', (data) => {
        toast.info(`${data.likerName} (@${data.likerUsername}) liked your post!`);
        setHasNewNotification(true);
      });
      socketRef.current.on('comment_notification', (data) => {
        toast.info(`${data.commenterName} (@${data.commenterUsername}) commented: "${data.text}"`);
        setHasNewNotification(true);
      });

      // Optional error handler
      socketRef.current.on('connect_error', (err) => {
        console.error('❌ Socket connection error:', err.message);
      });
    }

    // Cleanup on logout or component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        console.log('🧹 Socket disconnected.');
      }
    };
  }, [user]);

  return (
    <NotificationContext.Provider value={{ socket, hasNewNotification, setHasNewNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
