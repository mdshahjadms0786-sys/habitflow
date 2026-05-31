import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isEmergencyModeActive, saveEmergencyMode } from '../../utils/emergencyUtils';
import toast from 'react-hot-toast';

const EmergencyModeToggle = ({ onToggle, style }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const active = isEmergencyModeActive();

  const handleActivate = () => {
    if (active) {
      saveEmergencyMode(false);
      toast.success('Emergency mode deactivated');
      if (onToggle) onToggle(false);
    } else {
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    saveEmergencyMode(true);
    setShowConfirm(false);
    toast.success('Emergency mode activated! 🆘');
    if (onToggle) onToggle(true);
  };

  if (showConfirm) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
          }}
          onClick={() => setShowConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '16px',
              padding: '24px',
              width: '90%',
              maxWidth: '360px'
            }}
          >
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600', color: 'var(--text)' }}>
              🆘 Activate Emergency Mode?
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Only your top 3 most important habits will show today. This resets tomorrow automatically.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: '#DC2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Activate
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleActivate}
      style={{
        padding: '8px 12px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: active ? '#DC2626' : 'transparent',
        color: active ? '#fff' : 'var(--text-secondary)',
        border: active ? 'none' : '1px solid var(--border)',
        borderRadius: '6px',
        cursor: 'pointer',
        ...style
      }}
    >
      {active ? '🆘 EMERGENCY ON' : '🆘 Emergency'}
    </motion.button>
  );
};

export default EmergencyModeToggle;