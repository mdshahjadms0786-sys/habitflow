import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerContext } from '../../context/TimerContext';
import TimerModal from './TimerModal';
import toast from 'react-hot-toast';

const TimerWidget = () => {
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

  const [showModal, setShowModal] = useState(false);
  const [showCompletionMsg, setShowCompletionMsg] = useState(false);
  const [prevTimeLeft, setPrevTimeLeft] = useState(timeLeft);

  useEffect(() => {
    if (prevTimeLeft > 0 && timeLeft === 0 && !isBreak) {
      setShowCompletionMsg(true);
      toast.success('🎉 Focus session complete! Habit logged!');
      setTimeout(() => setShowCompletionMsg(false), 2000);
    }
    setPrevTimeLeft(timeLeft);
  }, [timeLeft, isBreak]);

  if (!activeHabitId) return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const theme = isBreak
    ? { bg: '#E1F5EE', border: '#1D9E75', text: '#1D9E75', label: 'BREAK' }
    : { bg: '#EEEDFE', border: '#534AB7', text: '#534AB7', label: 'FOCUS' };

  const totalTime = isBreak ? 5 * 60 : 25 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const displayName = activeHabitName.length > 16
    ? activeHabitName.slice(0, 16) + '…'
    : activeHabitName;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={() => setShowModal(true)}
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '16px',
            width: '280px',
            backgroundColor: 'var(--surface)',
            border: `2px solid ${theme.border}`,
            borderRadius: '16px',
            padding: '16px',
            zIndex: 1000,
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px' }}>{activeHabitIcon}</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)' }}>
              {displayName}
            </span>
            <span
              style={{
                marginLeft: 'auto',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '700',
                backgroundColor: theme.bg,
                color: theme.text,
              }}
            >
              {theme.label}
            </span>
          </div>

          <div
            style={{
              fontSize: '36px',
              fontWeight: '700',
              fontFamily: 'monospace',
              color: theme.text,
              textAlign: 'center',
              margin: '8px 0',
            }}
          >
            {formatTime(timeLeft)}
          </div>

          <div
            style={{
              height: '4px',
              borderRadius: '2px',
              backgroundColor: 'var(--border)',
              overflow: 'hidden',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: theme.border,
                transition: 'width 1s linear',
              }}
            />
          </div>

          <div
            style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={isRunning ? pauseTimer : resumeTimer}
              style={{
                padding: '6px 14px',
                backgroundColor: theme.border,
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {isRunning ? '⏸ Pause' : '▶ Resume'}
            </button>
            <button
              onClick={resetTimer}
              style={{
                padding: '6px 14px',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              ⏹ Stop
            </button>
            {isBreak && (
              <button
                onClick={skipBreak}
                style={{
                  padding: '6px 14px',
                  backgroundColor: '#1D9E75',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                ⏭ Skip
              </button>
            )}
          </div>

          <AnimatePresence>
            {showCompletionMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  marginTop: '8px',
                  padding: '6px',
                  backgroundColor: '#E1F5EE',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#1D9E75',
                }}
              >
                🎉 Habit completed!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {showModal && (
        <TimerModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default TimerWidget;
