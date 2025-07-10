import React, { useEffect, useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import UserService from '../api/user-service';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState(() => {
    // Load from localStorage for persistence
    const saved = localStorage.getItem('twixer_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const { socket, setHasNewNotification } = useNotification();

  // Fetch persistent notifications from backend
  useEffect(() => {
    UserService.getNotifications().then(res => {
      setNotifications(res.data.data || []);
    });
  }, []);

  // Listen for real-time follow notifications
  useEffect(() => {
    if (socket) {
      const handler = (data) => {
        setNotifications((prev) => [
          {
            type: 'follow',
            message: `${data.followerName} (@${data.followerUsername}) followed you!`,
            createdAt: new Date(),
            fromUser: { name: data.followerName, username: data.followerUsername, _id: data.followerId, profilePicture: data.followerProfilePicture }
          },
          ...prev,
        ]);
        setHasNewNotification(true);
      };
      socket.on('follow_notification', handler);
      return () => socket.off('follow_notification', handler);
    }
  }, [socket, setHasNewNotification]);

  useEffect(() => {
    setHasNewNotification(false); // Clear indicator when visiting page
  }, [setHasNewNotification]);

  return (
    <div className="max-w-2xl mx-auto mt-4 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Notifications</h2>
      {notifications.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">No notifications yet.</div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notif, idx) => (
            <li key={idx} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow flex items-center">
              <span className="mr-2 text-blue-500">🔔</span>
              <span className="text-gray-900 dark:text-white">
                {notif.type === 'follow' && notif.fromUser ? (
                  <>
                    <a href={`/profile/${notif.fromUser._id}`} className="font-bold hover:underline">{notif.fromUser.name} (@{notif.fromUser.username})</a> followed you!
                  </>
                ) : notif.type === 'like' && notif.fromUser && notif.tweet ? (
                  <>
                    <a href={`/profile/${notif.fromUser._id}`} className="font-bold hover:underline">{notif.fromUser.name} (@{notif.fromUser.username})</a> liked your <a href={`/tweet/${notif.tweet}`} className="text-blue-500 hover:underline">post</a>!
                  </>
                ) : notif.type === 'comment' && notif.fromUser && notif.tweet ? (
                  <>
                    <a href={`/profile/${notif.fromUser._id}`} className="font-bold hover:underline">{notif.fromUser.name} (@{notif.fromUser.username})</a> commented on your <a href={`/tweet/${notif.tweet}`} className="text-blue-500 hover:underline">post</a>!
                  </>
                ) : (
                  notif.message
                )}
              </span>
              <span className="ml-auto text-xs text-gray-400">{new Date(notif.createdAt).toLocaleTimeString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
