import { useState } from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../../hooks/useHabits';
import { useNotifications } from '../../hooks/useNotifications';
import { sendNotification } from '../../utils/notificationUtils';
import toast from 'react-hot-toast';

const NotificationSetup = () => {
  const { habits } = useHabits();
  const { permission, isSupported, isEnabled, enableNotifications, disableNotifications } = useNotifications(habits);

  const handleEnable = async () => {
    const granted = await enableNotifications();
    if (granted) {
      toast.success('🔔 Notifications enabled!');
    } else {
      toast.error('Permission denied. Please enable in browser settings.');
    }
  };

  const handleDisable = () => {
    disableNotifications();
    toast.success('🔕 Notifications disabled');
  };

  const handleTest = () => {
    sendNotification(
      '🎯 Test Notification',
      'This is a test from Habit Tracker! Your reminders are working.',
      '/icon-192.png'
    );
    toast.success('Test notification sent!');
  };

  const habitsWithReminders = (habits || []).filter((h) => h.reminderTime);

  if (!isSupported) {
    return (
      <div
        style={{
          padding: '16px',
          backgroundColor: '#FEF3C7',
          borderRadius: '10px',
          border: '1px solid #FCD34D',
        }}
      >
        <p style={{ margin: 0, fontSize: '14px', color: '#92400E' }}>
          ⚠️ Your browser doesn't support notifications.
        </p>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div
        style={{
          padding: '16px',
          backgroundColor: '#FEF2F2',
          borderRadius: '10px',
          border: '1px solid #FECACA',
        }}
      >
        <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#DC2626' }}>
          🔕 Notifications are blocked
        </p>
        <p style={{ margin: 0, fontSize: '13px', color: '#991B1B' }}>
          Please enable notifications in your browser settings to receive habit reminders.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>
            {permission === 'granted' ? '🔔 Reminders Enabled' : '🔕 Enable Notifications'}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
            {permission === 'granted'
              ? 'You will receive notifications for habits with reminder times'
              : 'Get notified when it is time to complete your habits'}
          </p>
        </div>

        {permission === 'granted' ? (
          <button
            onClick={isEnabled ? handleDisable : handleEnable}
            style={{
              width: '52px',
              height: '28px',
              borderRadius: '14px',
              backgroundColor: isEnabled ? 'var(--primary)' : 'var(--border)',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background-color 0.2s',
            }}
          >
            <motion.div
              initial={false}
              animate={{ x: isEnabled ? 26 : 2 }}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: '2px',
                transition: 'transform 0.2s',
              }}
            />
          </button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnable}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Enable Notifications
          </motion.button>
        )}
      </div>

      {permission === 'granted' && (
        <>
          {/* Test Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTest}
            style={{
              padding: '10px 16px',
              backgroundColor: 'transparent',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '13px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            🔔 Send Test Notification
          </motion.button>

          {/* Habits with reminders */}
          {habitsWithReminders.length > 0 ? (
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Habits with reminders:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {habitsWithReminders.map((habit) => (
                  <div
                    key={habit.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: 'var(--bg)',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  >
                    <span>{habit.icon || '⭐'}</span>
                    <span style={{ flex: 1, color: 'var(--text)' }}>{habit.name}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                      {habit.reminderTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              No habits have reminders set. Add reminder times to your habits.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationSetup;
