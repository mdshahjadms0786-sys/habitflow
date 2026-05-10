import { useState, useEffect, useCallback } from 'react';
import {
  isNotificationSupported,
  getPermissionStatus,
  requestNotificationPermission,
  scheduleHabitReminders,
  clearAllReminders,
  isNotificationsEnabled,
  setNotificationsEnabled,
} from '../utils/notificationUtils';

export const useNotifications = (habits) => {
  const [permission, setPermission] = useState('default');
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    setIsSupported(isNotificationSupported());
    setPermission(getPermissionStatus());
    setIsEnabled(isNotificationsEnabled());
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    if (isEnabled && permission === 'granted' && habits) {
      scheduleHabitReminders(habits);
    } else {
      clearAllReminders();
    }

    return () => {
      clearAllReminders();
    };
  }, [isEnabled, permission, isSupported, habits]);

  const enableNotifications = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setPermission(granted ? 'granted' : Notification.permission || 'denied');
    if (granted) {
      setIsEnabled(true);
      setNotificationsEnabled(true);
    }
    return granted;
  }, []);

  const disableNotifications = useCallback(() => {
    clearAllReminders();
    setIsEnabled(false);
    setNotificationsEnabled(false);
  }, []);

  const rescheduleReminders = useCallback(() => {
    if (isEnabled && permission === 'granted' && habits) {
      clearAllReminders();
      scheduleHabitReminders(habits);
    }
  }, [isEnabled, permission, habits]);

  return {
    permission,
    isSupported,
    isEnabled,
    enableNotifications,
    disableNotifications,
    rescheduleReminders,
  };
};

export default useNotifications;
