import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiEffect from '../UI/ConfettiEffect';

const AchievementPopup = ({ badge, habitName, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
        onClick={onClose}
      >
        <ConfettiEffect trigger={true} />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '20px',
            padding: '32px',
            textAlign: 'center',
            maxWidth: '400px',
            border: `3px solid ${badge.color}`,
            boxShadow: `0 0 40px ${badge.color}50`,
          }}
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
            style={{ fontSize: '80px', display: 'block' }}
          >
            {badge.emoji}
          </motion.span>
          <h2
            style={{
              margin: '16px 0 8px 0',
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--text)',
            }}
          >
            Achievement Unlocked!
          </h2>
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '20px',
              fontWeight: '600',
              color: badge.color,
            }}
          >
            {badge.name}
          </h3>
          <p
            style={{
              margin: '0 0 8px 0',
              fontSize: '16px',
              color: 'var(--text-secondary)',
            }}
          >
            Congratulations! {habitName} has reached {badge.name}!
          </p>
          <p
            style={{
              margin: '0 0 24px 0',
              fontSize: '14px',
              color: 'var(--text-secondary)',
            }}
          >
            Keep the streak going!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            style={{
              padding: '12px 32px',
              backgroundColor: badge.color,
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Awesome!
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AchievementPopup;
