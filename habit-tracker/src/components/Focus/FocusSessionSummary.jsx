import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FocusSessionSummary = ({ 
  isOpen, 
  onClose, 
  habitName, 
  habitIcon, 
  duration, 
  points,
  sessionCount,
  totalTimeToday,
  onStartAnother,
  onTakeBreak,
}) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const formattedTime = `${duration} minutes`;
  const formattedTotalTime = totalTimeToday 
    ? `${Math.floor(totalTimeToday / 60)}h ${totalTimeToday % 60}m`
    : formattedTime;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
            style={{
              fontSize: '64px',
              marginBottom: '16px',
            }}
          >
            ✓
          </motion.div>

          <h2 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#ffffff' 
          }}>
            Focus Session Complete! 🎉
          </h2>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            marginBottom: '24px',
            color: 'rgba(255, 255, 255, 0.7)',
          }}>
            <span style={{ fontSize: '24px' }}>{habitIcon}</span>
            <span style={{ fontSize: '18px', fontWeight: '600' }}>{habitName}</span>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '32px',
            marginBottom: '24px',
          }}>
            <div>
              <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: '#8b5cf6' }}>
                {formattedTime}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Time Focused
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: '#22c55e' }}>
                +{points}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Points 🏆
              </p>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '24px',
            marginBottom: '24px',
            paddingBottom: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#ffffff' }}>
                {sessionCount}
              </p>
              <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
                Sessions Today
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#ffffff' }}>
                {formattedTotalTime}
              </p>
              <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
                Total Focus
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => navigate('/focus-history')}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#fff',
                backgroundColor: '#534AB7',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              📊 View Focus Stats
            </button>
            
            <button
              onClick={onStartAnother}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#ffffff',
                backgroundColor: '#8b5cf6',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              Start Another Session
            </button>
            
            <button
              onClick={onTakeBreak}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid #22c55e',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              Take a Break (5 min)
            </button>
            
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.7)',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              I'm Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FocusSessionSummary;