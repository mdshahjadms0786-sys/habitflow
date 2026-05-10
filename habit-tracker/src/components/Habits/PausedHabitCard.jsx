import { motion } from 'framer-motion';
import { getPauseDaysLeft, PAUSE_REASONS } from '../../utils/pauseUtils';

const PausedHabitCard = ({ habit, onResume }) => {
  const daysLeft = getPauseDaysLeft(habit);
  const reason = PAUSE_REASONS.find(r => r.id === habit.pauseReason);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '10px',
        border: '1px solid rgba(234, 179, 8, 0.3)',
        opacity: 0.8,
      }}
    >
      {reason && (
        <span style={{ fontSize: '16px', position: 'absolute', top: '8px', right: '8px' }}>
          {reason.icon}
        </span>
      )}
      
      <span style={{ fontSize: '24px' }}>{habit.icon || '⭐'}</span>
      
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'white' }}>
          {habit.name}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#EAB308' }}>
          PAUSED • Resumes in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
        </p>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onResume(habit.id)}
        style={{
          padding: '6px 12px',
          background: 'rgba(234, 179, 8, 0.2)',
          border: '1px solid #EAB308',
          borderRadius: '6px',
          color: '#EAB308',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 500,
        }}
      >
        Resume
      </motion.button>
    </motion.div>
  );
};

export default PausedHabitCard;