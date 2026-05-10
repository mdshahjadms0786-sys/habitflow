const NOTIFICATIONS_ENABLED_KEY = 'ht_notifications_enabled';
const reminderTimeouts = new Map();

export const isNotificationSupported = () => {
  return 'Notification' in window;
};

export const getPermissionStatus = () => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
};

export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  try {
    const result = await Notification.requestPermission();
    return result === 'granted';
  } catch (e) {
    console.error('Error requesting notification permission:', e);
    return false;
  }
};

export const sendNotification = (title, body, icon) => {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== 'granted') return;

  try {
    new Notification(title, {
      body,
      icon: icon || '/icon-192.png',
      badge: '/icon-192.png',
      tag: title,
    });
  } catch (e) {
    console.error('Error sending notification:', e);
  }
};

export const getTimeUntilReminder = (reminderTime) => {
  if (!reminderTime) return null;

  const [hours, minutes] = reminderTime.split(':').map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime() - now.getTime();
};

export const scheduleHabitReminders = (habits) => {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== 'granted') return;

  clearAllReminders();

  if (!habits || habits.length === 0) return;

  habits.forEach((habit) => {
    if (!habit.reminderTime || !habit.isActive) return;

    const ms = getTimeUntilReminder(habit.reminderTime);
    if (ms === null || ms <= 0) return;

    const timeoutId = setTimeout(() => {
      sendNotification(
        `⏰ Time for: ${habit.name}`,
        `Don't forget to complete your habit!`,
        '/icon-192.png'
      );

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const [hours, minutes] = habit.reminderTime.split(':').map(Number);
      tomorrow.setHours(hours, minutes, 0, 0);
      const tomorrowMs = tomorrow.getTime() - new Date().getTime();

      if (tomorrowMs > 0) {
        const nextTimeoutId = setTimeout(arguments.callee, tomorrowMs);
        reminderTimeouts.set(`${habit.id}-recurring`, nextTimeoutId);
      }
    }, ms);

    reminderTimeouts.set(`${habit.id}`, timeoutId);
  });
};

export const clearAllReminders = () => {
  reminderTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
  reminderTimeouts.clear();
};

export const isNotificationsEnabled = () => {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
    return data === 'true';
  } catch {
    return false;
  }
};

export const setNotificationsEnabled = (enabled) => {
  try {
    localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(enabled));
  } catch (e) {
    console.error('Error saving notification preference:', e);
  }
};
