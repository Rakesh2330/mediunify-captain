import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';
import { soundEffects } from '../utils/audio';

const NotificationContext = createContext(null);

const NOTIF_VERSION = 'v4_new_fresh_mock_data';

export function NotificationProvider({ children }) {
  const isOutdated = typeof window !== 'undefined' && localStorage.getItem('mediunify_notif_version') !== NOTIF_VERSION;

  const [notifications, setNotifications] = useState(() => {
    if (isOutdated) return INITIAL_NOTIFICATIONS;
    const saved = localStorage.getItem('mediunify_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('mediunify_notif_version', NOTIF_VERSION);
    localStorage.setItem('mediunify_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    soundEffects.playSuccess();
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    soundEffects.playSuccess();
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const resetNotifications = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
    soundEffects.playSuccess();
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false,
      captainType: 'all',
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
    soundEffects.playAlert();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
        clearNotification,
        resetNotifications,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
