import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTimerContext } from '../../context/TimerContext';

const MOTIVATIONAL_MESSAGES = [
  'Stay focused, you got this! 💪',
  'Every minute counts toward your goal! 🎯',
  'Consistency is the key to success! 🔑',
  'Small steps lead to big changes! 🚀',
  'You are building great habits! ⭐',
  'Keep going, the results will come! 🌟',
  'Focus on the process, not the outcome! 🧠',
  'Your future self will thank you! 🙏',
];

const TimerModal = ({ onClose }) => {
  const {
    timeLeft,
    isRunning,
    isBreak,
    sessions,
    activeHabitId,
    activeHabitName,
    activeHabitIcon,
    pauseTimer,
    resumeTimer,
    resetTimer,
    skipBreak,
  } = useTimerContext();

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    setMessageIndex(sessions % MOTIVATIONAL_MESSAGES.length);
  }, [sessions]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const theme = isBreak
    ? { primary: '#1D9E75', bg: '#E1F5EE', label: 'BREAK TIME' }
    : { primary: '#534AB7', bg: '#EEEDFE', label: 'FOCUS MODE' };

  const totalTime = isBreak ? 5 * 60 : 25 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (!activeHabitId) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '24px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          border: `2px solid ${theme.primary}`,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          ✕
        </button>

        <div
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '12px',
            backgroundColor: theme.bg,
            fontSize: '12px',
            fontWeight: '700',
            color: theme.primary,
            marginBottom: '16px',
          }}
        >
          {theme.label}
        </div>

        <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="var(--border)"
              strokeWidth="8"
            />
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={theme.primary}
              strokeWidth="8"
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'linear' }}
              style={{
                strokeDasharray: circumference,
              }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontSize: '48px',
                fontWeight: '700',
                fontFamily: 'monospace',
                color: theme.primary,
              }}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <span style={{ fontSize: '32px' }}>{activeHabitIcon}</span>
          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--text)',
            }}
          >
            {activeHabitName}
          </p>
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}
          >
            Session {sessions + 1}/4
          </p>
        </div>

        <p
          style={{
            margin: '16px 0',
            fontSize: '14px',
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
          }}
        >
          {MOTIVATIONAL_MESSAGES[messageIndex]}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={isRunning ? pauseTimer : resumeTimer}
            style={{
              padding: '10px 24px',
              backgroundColor: theme.primary,
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {isRunning ? '⏸ Pause' : '▶ Resume'}
          </button>
          <button
            onClick={resetTimer}
            style={{
              padding: '10px 24px',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            ⏹ Stop
          </button>
          {isBreak && (
            <button
              onClick={skipBreak}
              style={{
                padding: '10px 24px',
                backgroundColor: '#1D9E75',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ⏭ Skip Break
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TimerModal;
