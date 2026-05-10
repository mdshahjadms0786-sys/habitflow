import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTimerContext } from '../../context/TimerContext';

const FocusMiniPlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isRunning, timeLeft, activeHabitName, activeHabitIcon, pauseFocusTimer, stopFocusTimer } = useTimerContext();

  const isOnFocusPage = location.pathname === '/focus';
  const shouldShow = isRunning && !isOnFocusPage;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const truncatedName = activeHabitName?.length > 15 
    ? activeHabitName.substring(0, 15) + '...' 
    : activeHabitName || 'Focus';

  if (!shouldShow) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '16px',
        width: '200px',
        padding: '12px',
        backgroundColor: 'rgba(15, 52, 96, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        color: '#fff',
        zIndex: 50,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px' }}>{activeHabitIcon || '⭐'}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {truncatedName}
          </p>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', fontFamily: 'monospace', color: '#8b5cf6' }}>
            {formatTime(timeLeft)}
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ 
          fontSize: '10px', 
          fontWeight: '600', 
          color: '#f59e0b',
          padding: '2px 6px',
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          borderRadius: '4px'
        }}>
          PAUSED
        </span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => navigate('/focus')}
          style={{
            flex: 1,
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: '600',
            color: '#fff',
            backgroundColor: '#8b5cf6',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Resume
        </button>
        <button
          onClick={() => {
            pauseFocusTimer();
            stopFocusTimer();
          }}
          style={{
            flex: 1,
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: '600',
            color: 'rgba(255,255,255,0.7)',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default FocusMiniPlayer;